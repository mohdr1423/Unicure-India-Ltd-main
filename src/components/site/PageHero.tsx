import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  showBreadcrumbs = true,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  showBreadcrumbs?: boolean;
}) {
  return (
    <section
      className="relative pb-16 md:pb-24 overflow-hidden bg-[color:var(--brand-blue-dark)] text-white"
      style={{
        paddingTop: "calc(var(--header-height, 108px) + 1.75rem)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,16,46,0.12),transparent_60%)]" />

      <div className="container-x relative z-10">
        {showBreadcrumbs && (
          <div className="mb-4 sm:mb-5">
            <Breadcrumbs theme="dark" />
          </div>
        )}

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/75 inline-block">
          {eyebrow}
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.15]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
