import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

const SIZES = [16, 32, 48] as const;

/**
 * /favicon.ico : demandé directement (sans lire les <link rel="icon">) par certains navigateurs intégrés,
 * robots et services de favoris. Conteneur ICO embarquant trois PNG.
 */
export async function GET() {
  const pngs = await Promise.all(
    SIZES.map(async (size) => new Uint8Array(await renderIcon({ size, variant: "favicon" }).arrayBuffer())),
  );
  const headerSize = 6 + 16 * pngs.length;
  const ico = new Uint8Array(headerSize + pngs.reduce((total, png) => total + png.length, 0));
  const view = new DataView(ico.buffer);
  view.setUint16(2, 1, true); // Type : icône
  view.setUint16(4, pngs.length, true);
  let offset = headerSize;
  pngs.forEach((png, index) => {
    const entry = 6 + 16 * index;
    ico[entry] = SIZES[index];
    ico[entry + 1] = SIZES[index];
    view.setUint16(entry + 4, 1, true); // Plans de couleur
    view.setUint16(entry + 6, 32, true); // Bits par pixel
    view.setUint32(entry + 8, png.length, true);
    view.setUint32(entry + 12, offset, true);
    ico.set(png, offset);
    offset += png.length;
  });
  return new Response(ico, {
    headers: { "Content-Type": "image/x-icon", "Cache-Control": "public, max-age=86400" },
  });
}
