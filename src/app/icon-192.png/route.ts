import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

export function GET() {
  return renderIcon({ size: 192 });
}
