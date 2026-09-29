"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { m } from "framer-motion";
import { Check, Copy, Download, Ellipsis, Mail, Share, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand/BrandIcons";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { celebrate } from "@/lib/confetti";
import { svgToDataUri } from "@/lib/monogram-svg";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  url: string;
  title: string;
  text: string;
  /** Monogramme (SVG autonome) incrusté au centre du code QR. */
  qrLogoSvg: string;
  /** Couleur des modules du code QR. */
  qrColor: string;
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

/** Exporte le code QR affiché en PNG haute définition (1200 px), ou en SVG si le navigateur refuse. */
async function exportQr(svg: SVGSVGElement, basename: string) {
  const markup = new XMLSerializer().serializeToString(svg);
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
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  label: string;
  className?: string;
}) {
  const classes = cn(
    "group flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2 text-[0.7rem] font-medium text-soft transition-colors hover:text-ink",
    className,
  );
  const inner = (
    <>
      <span className="grid size-12 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 transition-[background-color,box-shadow] duration-300 group-hover:bg-white/[0.1] group-hover:ring-white/25">
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
        aria-label={external ? `${label} (nouvel onglet)` : label}
      >
        {inner}
      </m.a>
    );
  }
  return (
    <m.button type="button" onClick={onClick} whileTap={{ scale: 0.94 }} transition={SPRING} className={classes}>
      {inner}
    </m.button>
  );
}

function ShareSheet({ url, title, text, qrLogoSvg, qrColor }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const logoUri = useMemo(() => svgToDataUri(qrLogoSvg), [qrLogoSvg]);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const message = `${text} ${url}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Repli pour les navigateurs intégrés sans API Presse-papiers.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    void celebrate(copyRef.current);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // Partage annulé par l’utilisateur : rien à faire.
    }
  }

  return (
    <>
      <div className="mx-auto mt-1 mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <Dialog.Title className="text-[1.1rem] font-semibold tracking-[-0.01em] text-ink">
            Partager la page
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[0.8rem] text-muted">
            Scannez le code QR ou envoyez le lien à votre cohorte.
          </Dialog.Description>
        </div>
        <Dialog.Close
          className="-mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-soft ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] hover:text-ink"
          aria-label="Fermer"
        >
          <X aria-hidden="true" className="size-4" />
        </Dialog.Close>
      </div>

      {/* Code QR */}
      <div className="relative mx-auto mt-5 w-fit">
        <div aria-hidden="true" className="avatar-ring absolute -inset-3 rounded-[2rem] opacity-40 blur-2xl" />
        <div className="relative rounded-[1.6rem] bg-white p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
          <QRCodeSVG
            ref={qrRef}
            value={url}
            size={208}
            level="H"
            marginSize={0}
            bgColor="#FFFFFF"
            fgColor={qrColor}
            title={`Code QR vers ${prettyUrl(url)}`}
            imageSettings={{ src: logoUri, height: 52, width: 52, excavate: true }}
            className="block size-[13rem]"
          />
          <p className="mt-3 text-center text-[0.68rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
            {prettyUrl(url)}
          </p>
        </div>
      </div>

      {/* Lien à copier */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-black/30 p-1.5 pl-4 ring-1 ring-white/10">
        <span className="min-w-0 flex-1 truncate text-[0.85rem] text-soft" title={url}>
          {prettyUrl(url)}
        </span>
        <m.button
          ref={copyRef}
          type="button"
          onClick={copyLink}
          whileTap={{ scale: TAP_SCALE }}
          transition={SPRING}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-cta-gradient px-4 text-[0.8rem] font-semibold text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.3)]"
        >
          {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          <span aria-live="polite">{copied ? "Lien copié" : "Copier"}</span>
        </m.button>
      </div>

      {/* Partage direct */}
      <div className="mt-4 grid grid-cols-5 gap-1">
        {canNativeShare ? (
          <ActionButton label="Partager" onClick={nativeShare}>
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

/** Bouton d’action rapide (en haut à droite) et fenêtre de partage avec code QR. */
export function ShareModal(props: ShareModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <m.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          aria-label="Partager la page et afficher le code QR"
          className="grid size-11 place-items-center rounded-full glass text-ink/90 transition-colors hover:text-ink"
        >
          <Ellipsis aria-hidden="true" className="size-5" />
        </m.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "dialog-sheet fixed z-50 max-h-[92dvh] scrollbar-none overflow-y-auto border border-white/10 bg-bg-elevated/95 p-5 shadow-2xl backdrop-blur-2xl outline-none",
            "inset-x-0 bottom-0 rounded-t-[1.75rem] pb-[max(1.25rem,env(safe-area-inset-bottom))]",
            "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[24rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem] sm:p-6",
          )}
        >
          <ShareSheet {...props} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
