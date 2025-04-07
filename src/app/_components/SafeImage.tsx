'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc: string;
  unoptimized?: boolean;
}

const isSpecialDomain = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const specialDomains = ['utfs.io', 'uploadthing.com'];
  return specialDomains.some(domain => url.includes(domain));
};

export default function SafeImage({ src, alt, fallbackSrc, unoptimized, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [isError, setIsError] = useState(false);
  const [shouldUnoptimize, setShouldUnoptimize] = useState<boolean>(
    unoptimized || isSpecialDomain(src as string)
  );
  
  useEffect(() => {
    if (!isError) {
      setImgSrc(src as string);
      setShouldUnoptimize(unoptimized || isSpecialDomain(src as string));
    }
  }, [src, isError, unoptimized]);
  
  const handleError = () => {
    console.log("Image error loading:", imgSrc);
    setIsError(true);
    setImgSrc(fallbackSrc);
    setShouldUnoptimize(unoptimized || false);
  };
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={shouldUnoptimize}
    />
  );
} 