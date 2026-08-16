type Props = { html?: string | null; className?: string };

/**
 * Renders admin-authored HTML from the TipTap rich editor. Content is trusted
 * (admin-only write policy on site_settings) so we render it directly; if
 * untrusted sources are added later, wrap this with a sanitizer.
 */
export function RichContent({ html, className = "" }: Props) {
  if (!html || !html.replace(/<[^>]*>/g, "").trim()) return null;
  return (
    <div
      className={`prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-primary ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}