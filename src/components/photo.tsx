"use client";

import Image, { type ImageLoaderProps } from "next/image";

// Les photos sont servies et redimensionnées directement par le CDN Unsplash.
function unsplash({ src, width, quality }: ImageLoaderProps) {
  return `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 75}`;
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
  return <Image loader={unsplash} src={id} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
