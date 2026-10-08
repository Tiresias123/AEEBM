"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, type ComponentProps, type MouseEvent } from "react";

/*
 * Changement d’onglet animé (page d’accueil ↔ page des partenaires) : le layout commun (fond, support, en-tête,
 * pied de page) reste en place et seul le contenu central change, en fondu enchaîné (API View Transitions), puis
 * le nouveau contenu entre en cascade (classe « enter »). Sans l’API (Firefox) ou avec « réduire les
 * animations » : navigation ordinaire. Sans JavaScript : lien ordinaire.
 */

/** Fin de la transition en cours : appelée quand la nouvelle page est affichée. */
let finishTransition: (() => void) | null = null;

/** Délai maximal d’attente de la nouvelle page avant d’animer quand même (réseau lent). */
const MAX_WAIT_MS = 1500;

/** À placer une fois dans le layout commun : signale l’affichage de la nouvelle page à la transition en cours. */
export function ViewTransitionBridge() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    finishTransition?.();
    finishTransition = null;
  }, [pathname]);
  return null;
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.currentTarget.target !== "_blank"
  );
}

/** Lien interne vers une autre page du layout commun, avec transition animée quand le navigateur la permet. */
export function TransitionLink({
  href,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!isPlainClick(event)) return;
    if (typeof document.startViewTransition !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Même page (ancre) : défilement ordinaire, sans transition.
    if (new URL(href, window.location.href).pathname === window.location.pathname) return;

    event.preventDefault();
    document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const timer = window.setTimeout(resolve, MAX_WAIT_MS);
          finishTransition = () => {
            window.clearTimeout(timer);
            resolve();
          };
          router.push(href);
        }),
    );
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
