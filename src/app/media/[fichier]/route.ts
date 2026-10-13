// Sert les images envoyées depuis l'administration (stockées dans data/uploads).
import { promises as fs } from "node:fs";
import path from "node:path";
import { DOSSIER_DONNEES } from "@/lib/db";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: Request, { params }: RouteContext<"/media/[fichier]">) {
  const { fichier } = await params;
  const nom = path.basename(fichier); // pas de remontée de dossier
  const type = TYPES[path.extname(nom).toLowerCase()];
  if (!type) return new Response("Introuvable", { status: 404 });
  try {
    const contenu = await fs.readFile(path.join(DOSSIER_DONNEES, "uploads", nom));
    return new Response(contenu, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(type === "image/svg+xml" ? { "Content-Security-Policy": "script-src 'none'" } : {}),
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
