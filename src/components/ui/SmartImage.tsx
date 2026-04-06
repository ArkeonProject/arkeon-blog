import { useState } from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string;
  fallbackColor?: string;
}

export default function SmartImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-video",
  fallbackColor = "bg-muted/20",
  ...props
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl ${aspectRatio} ${fallbackColor} border border-border/10 group transition-all duration-700`}>
      {/* Shimmer effect while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />
      )}

      {/* Decorative tech grid backdrop */}
      <div className="absolute inset-0 dot-grid opacity-5" />

      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
          isLoaded 
            ? "opacity-100 scale-100 grayscale-0 blur-0 shadow-2xl" 
            : "opacity-0 scale-110 grayscale-[0.2] blur-xl"
        } ${className}`}
        loading="lazy"
        decoding="async"
        {...props}
      />
      
      {/* Decorative border reveal */}
      <div className={`absolute inset-0 border border-primary/20 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} />
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none group-hover:animate-scanline" />
    </div>
  );
}
