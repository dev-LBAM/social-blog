import React from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number; // Tamanho opcional
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40 }) => (
  <img
    src={src}
    alt={alt}
    className={`rounded-full`}
    style={{ width: `${size}px`, height: `${size}px` }}
  />
);
