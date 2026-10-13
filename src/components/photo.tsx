"use client";

import Image, { type ImageLoaderProps } from "next/image";

// Une image peut être : un identifiant de photo Unsplash, une image envoyée depuis
// l'admin (/media/…) ou une adresse web complète.
function unsplash({ src, width, quality }: ImageLoaderProps) {
  return `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 75}`;
}

export function estUnsplash(id: string) {
  return /^\d{10,}-[\w-]+$/.test(id);
}

export function urlImage(id: string, largeur = 800) {
  return estUnsplash(id) ? unsplash({ src: id, width: largeur }) : id;
}

export function Photo({
  id,
  alt,
  sizes = "100vw",
  priority,
  className = "",
}: {
  id: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!id) return null;
  if (estUnsplash(id)) {
    return <Image loader={unsplash} src={id} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  return <Image src={id} alt={alt} fill sizes={sizes} priority={priority} unoptimized className={`object-cover ${className}`} />;
}
