import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

export interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
  fallbackText?: string;
}

export function SafeImage({
  src,
  alt,
  fallback,
  fallbackText,
  className,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div
        className={`grid place-items-center rounded-xl bg-secondary/80 border border-border/50 text-xs font-semibold text-muted-foreground p-3 text-center select-none ${
          className ?? ""
        }`}
        title={alt ?? fallbackText}
      >
        <span>{fallbackText ?? alt ?? "Unicure India"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
