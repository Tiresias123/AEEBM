"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { m } from "framer-motion";
import { Check, Copy, Download, Mail, Share, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand/BrandIcons";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { celebrate } from "@/lib/confetti";

export interface ShareDialogProps {
  url: string;
  title: string;
  text: string;
  /** Monogramme incrusté au centre du code QR (SVG de même origine). */
  qrLogoSrc: string;
  /** Couleur des modules du code QR. */
  qrColor: string;
  /** Couleur de la légende sous le code QR. */
  qrCaptionColor: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Élément qui reprend le focus à la fermeture. */
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Exporte le code QR en PNG haute définition (1200 px), ou en SVG si le navigateur refuse. */
async function exportQr(svg: SVGSVGElement, basename: string) {
  // Une image SVG isolée ne charge pas de ressources externes : on incorpore le logo avant l’export.
  const clone = svg.cloneNode(true) as SVGSVGElement;
  for (const image of Array.from(clone.querySelectorAll("image"))) {
    const href = image.getAttribute("href") ?? image.getAttribute("xlink:href");
    if (!href || href.startsWith("data:")) continue;
    try {
      const response = await fetch(href);
      image.setAttribute("href", await blobToDataUri(await response.blob()));
    } catch {
      image.remove();
    }
  }
  const markup = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = URL.createObjectURL(svgBlob);
    await image.decode();
    const size = 1200;
    const margin = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponible");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, size, size);
    context.drawImage(image, margin, margin, size - margin * 2, size - margin * 2);
    URL.revokeObjectURL(image.src);
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) throw new Error("Export PNG impossible");
    downloadBlob(png, `${basename}.png`);
  } catch {
    downloadBlob(svgBlob, `${basename}.svg`);
  }
}

function ActionButton({
  children,
  onClick,
  href,
  label,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  label: string;
  ariaLabel?: string;
}) {
  const classes =
    "group flex flex-[1_1_0] flex-col items-center gap-1.5 rounded-2xl py-2 text-center text-[0.7rem] font-medium text-soft transition-colors hover:text-ink";
  const inner = (
    <>
      <span className="grid size-12 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 transition-[background-color,box-shadow] duration-300 group-hover:bg-white/[0.1] group-hover:ring-white/25 forced-colors:border">
        {children}
      </span>
      {label}
    </>
  );
  if (href) {
    const external = href.startsWith("http");
    return (
      <m.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        whileTap={{ scale: 0.94 }}
        transition={SPRING}
        className={classes}
        aria-label={ariaLabel ?? (external ? `${label} (nouvel onglet)` : label)}
      >
        {inner}
      </m.a>
    );
  }
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.94 }}
      transition={SPRING}
      className={classes}
    >
      {inner}
    </m.button>
  );
}

function ShareSheet({
  url,
  title,
  text,
  qrLogoSrc,
  qrColor,
  qrCaptionColor,
}: Omit<ShareDialogProps, "open" | "onOpenChange" | "returnFocusTo">) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const urlRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const encodedUrl = encodeURIComponent(url);
  const message = `${text} ${url}`;

  /** Repli sans API Presse-papiers : le champ doit vivre DANS la fenêtre, sinon le piège de focus annule la sélection. */
  function legacyCopy(value: string): boolean {
    const button = copyRef.current;
    const host = button?.closest<HTMLElement>("[role=dialog]") ?? document.body;
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    field.tabIndex = -1;
    Object.assign(field.style, { position: "fixed", top: "0", left: "0", opacity: "0", fontSize: "16px" });
    host.append(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, value.length);
    let ok = false;
    try {
      ok = document.activeElement === field && document.execCommand("copy");
    } catch {
      ok = false;
    }
    button?.focus({ preventScroll: true });
    field.remove();
    return ok;
  }

  async function copyLink() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = legacyCopy(url);
    }
    if (ok) {
      setCopyState("copied");
      void celebrate(copyRef.current);
    } else {
      setCopyState("failed");
      // Sélectionne l’adresse affichée pour une copie manuelle.
      const node = urlRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // Partage annulé par la personne : rien à faire.
    }
  }

  const copyLabel = copyState === "copied" ? "Lien copié" : copyState === "failed" ? "Copiez l’adresse" : "Copier";

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Dialog.Title className="font-display-name text-[length:calc(1.15rem*var(--display-scale))] text-ink">
            Partager la page
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[0.8rem] text-pretty text-muted">
            Scannez le code QR ou envoyez le lien à votre cohorte.
          </Dialog.Description>
        </div>
        <Dialog.Close
          className="-mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-soft ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] hover:text-ink"
          aria-label="Fermer"
        >
          <X aria-hidden="true" className="size-4" />
        </Dialog.Close>
      </div>

      {/* Code QR */}
      <div className="relative mx-auto mt-5 w-fit short:mt-4">
        <div aria-hidden="true" className="avatar-ring absolute -inset-3 rounded-[2rem] opacity-40 blur-2xl" />
        <div className="relative rounded-[1.6rem] bg-white p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] short:p-3">
          <QRCodeSVG
            ref={qrRef}
            value={url}
            size={208}
            level="H"
            marginSize={0}
            bgColor="#FFFFFF"
            fgColor={qrColor}
            title={`Code QR vers ${prettyUrl(url)}`}
            imageSettings={{ src: qrLogoSrc, height: 52, width: 52, excavate: true }}
            className="block size-[min(13rem,calc(100vw-4.5rem))] short:size-[9.5rem]"
          />
          <p
            className="mt-3 text-center text-[0.68rem] font-semibold tracking-[0.2em] uppercase short:hidden"
            style={{ color: qrCaptionColor }}
          >
            {prettyUrl(url)}
          </p>
        </div>
      </div>

      {/* Lien à copier */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-black/30 p-1.5 pl-4 ring-1 ring-white/10 forced-colors:border short:mt-4">
        <span ref={urlRef} className="min-w-0 flex-1 truncate text-[0.85rem] text-soft select-all" title={url}>
          {prettyUrl(url)}
        </span>
        <m.button
          ref={copyRef}
          type="button"
          onClick={copyLink}
          whileTap={{ scale: TAP_SCALE }}
          transition={SPRING}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-cta-gradient px-4 text-[0.8rem] font-semibold text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.3)] forced-colors:border"
        >
          {copyState === "copied" ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          {copyLabel}
        </m.button>
      </div>
      <p role="status" className="sr-only">
        {copyState === "copied"
          ? "Lien copié dans le presse-papiers."
          : copyState === "failed"
            ? "Copie automatique impossible\u00A0: l’adresse est sélectionnée, copiez-la manuellement."
            : ""}
      </p>

      {/* Partage direct */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-1 gap-y-3">
        {canNativeShare ? (
          <ActionButton label="Partager" ariaLabel="Partager avec une autre application" onClick={nativeShare}>
            <Share aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
          </ActionButton>
        ) : (
          <ActionButton
            label="Courriel"
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`}
          >
            <Mail aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
          </ActionButton>
        )}
        <ActionButton label="WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(message)}`}>
          <WhatsAppIcon className="size-[1.15rem]" />
        </ActionButton>
        <ActionButton label="LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}>
          <LinkedInIcon className="size-[1.15rem]" />
        </ActionButton>
        <ActionButton label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>
          <FacebookIcon className="size-[1.15rem]" />
        </ActionButton>
        <ActionButton
          label="Code QR"
          ariaLabel="Télécharger le code QR (image PNG)"
          onClick={() => {
            if (qrRef.current) void exportQr(qrRef.current, `${title.toLowerCase()}-code-qr`);
          }}
        >
          <Download aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
        </ActionButton>
      </div>
    </>
  );
}

/** Fenêtre de partage : copie du lien, partage direct et code QR téléchargeable (chargée à la demande). */
export default function ShareDialog({ open, onOpenChange, returnFocusTo, ...props }: ShareDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content
          aria-modal="true"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusTo.current?.focus();
          }}
          className={clsx(
            "dialog-sheet fixed z-50 max-h-[92dvh] scrollbar-thin overflow-y-auto border-t border-white/10 surface p-5 shadow-2xl outline-none",
            "inset-x-0 bottom-0 rounded-t-[1.75rem] pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] short:pt-5",
            "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[24rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem] sm:border sm:p-6",
          )}
        >
          <ShareSheet {...props} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
