"use client";

import { m } from "framer-motion";
import { Ellipsis } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SPRING } from "@/components/motion";
import type { ShareDialogProps } from "@/components/ShareDialog";

const loadDialog = () => import("@/components/ShareDialog");
const ShareDialog = dynamic(loadDialog, { ssr: false });

type ShareModalProps = Omit<ShareDialogProps, "open" | "onOpenChange" | "returnFocusTo">;

/**
 * Bouton d’action rapide (en haut à droite) ouvrant la fenêtre de partage et le code QR.
 * La fenêtre et la bibliothèque de code QR ne sont chargées qu’au besoin (survol, focus ou temps mort).
 */
export function ShareModal(props: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void loadDialog());
    return () => cancel(handle);
  }, []);

  return (
    <>
      <m.button
        ref={triggerRef}
        type="button"
        onPointerEnter={() => void loadDialog()}
        onFocus={() => void loadDialog()}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
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
      {requested ? <ShareDialog {...props} open={open} onOpenChange={setOpen} returnFocusTo={triggerRef} /> : null}
    </>
  );
}
