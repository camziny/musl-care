"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function SafeImage({ src, alt, fallbackSrc, unoptimized, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const displaySrc = error ? fallbackSrc || "/vercel.svg" : src;

  return (
    <Image
      {...props}
      src={displaySrc as string}
      alt={alt}
      onError={() => setError(true)}
      unoptimized={unoptimized}
    />
  );
}
