"use client";

import { m } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { SPRING } from "@/components/motion";
import type { ShareDialogProps } from "@/components/ShareDialog";

type ShareModalProps = Omit<ShareDialogProps, "open" | "onOpenChange" | "returnFocusTo">;
type DialogComponent = ComponentType<ShareDialogProps>;

/*
 * Chargement manuel (sans next/dynamic ni Suspense) : pas de délai d’affichage à la première ouverture,
 * et une nouvelle tentative reste possible si le fichier n’a pas pu être téléchargé.
 */
let dialogPromise: Promise<DialogComponent> | null = null;
function loadDialog(): Promise<DialogComponent> {
  dialogPromise ??= import("@/components/ShareDialog").then(
    (module) => module.default,
    (error: unknown) => {
      dialogPromise = null;
      throw error;
    },
  );
  return dialogPromise;
}

/** Repli si la fenêtre ne peut pas être chargée (réseau coupé, déploiement en cours) : partage natif ou copie. */
async function fallbackShare(url: string, title: string, text: string): Promise<boolean> {
  try {
    if (typeof navigator.share === "function") {
      await navigator.share({ title, text, url });
      return true;
    }
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Bouton d’action rapide (en haut à droite) ouvrant la fenêtre de partage et le code QR.
 * La fenêtre et la bibliothèque de code QR sont chargées au survol, au focus ou au premier temps mort.
 */
export function ShareModal(props: ShareModalProps) {
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const preload = useCallback(() => {
    loadDialog().then(
      (component) => setDialog(() => component),
      () => undefined,
    );
  }, []);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(preload);
    return () => cancel(handle);
  }, [preload]);

  async function handleClick() {
    setNotice("");
    try {
      const component = await loadDialog();
      setDialog(() => component);
      setOpen(true);
    } catch {
      const ok = await fallbackShare(props.url, props.title, props.text);
      setNotice(ok ? "Lien copié dans le presse-papiers." : "Partage indisponible pour le moment. Réessayez.");
    }
  }

  return (
    <>
      <m.button
        ref={triggerRef}
        type="button"
        onPointerEnter={preload}
        onFocus={preload}
        onClick={handleClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={SPRING}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Partager la page et afficher le code QR"
        className="grid size-11 place-items-center rounded-full glass text-ink/90 transition-colors hover:text-ink forced-colors:border"
      >
        <Ellipsis aria-hidden="true" className="size-5" />
      </m.button>
      <p role="status" className="sr-only">
        {notice}
      </p>
      {Dialog ? <Dialog {...props} open={open} onOpenChange={setOpen} returnFocusTo={triggerRef} /> : null}
    </>
  );
}
