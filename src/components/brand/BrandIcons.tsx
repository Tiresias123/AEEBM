import type { SVGProps } from "react";
import { Globe, Mail } from "lucide-react";
import type { SocialPlatform } from "@/config/types";

/*
 * Icônes de marques au trait (24 × 24, trait de 2) harmonisées avec lucide-react.
 * Tracés issus de Tabler Icons (licence MIT, © Paweł Kuna) : lucide ne fournit plus d’icônes de marques.
 */

type IconProps = SVGProps<SVGSVGElement>;

function StrokeIcon({ children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
      <path d="M16.5 7.5v.01" />
    </StrokeIcon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0-4 0" />
      <path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
    </StrokeIcon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H7" />
    </StrokeIcon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </StrokeIcon>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0-2 0" />
      <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0-2 0" />
      <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833-1.667 3.5-3c.667-1.667.5-5.833-1.5-11.5c-1.457-1.015-3-1.34-4.5-1.5l-.972 1.923a11.913 11.913 0 0 0-4.053 0L9.001 4c-1.5.16-3.043.485-4.5 1.5c-2 5.667-2.167 9.833-1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2-2 2-3" />
      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    </StrokeIcon>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917" />
    </StrokeIcon>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
      <path d="M10 9l5 3l-5 3z" />
    </StrokeIcon>
  );
}

function EmailIcon(props: IconProps) {
  return <Mail aria-hidden="true" focusable="false" strokeWidth={1.8} {...props} />;
}

function WebsiteIcon(props: IconProps) {
  return <Globe aria-hidden="true" focusable="false" strokeWidth={1.8} {...props} />;
}

export const socialIcons: Record<SocialPlatform, (props: IconProps) => React.JSX.Element> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
  discord: DiscordIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  email: EmailIcon,
  website: WebsiteIcon,
};
