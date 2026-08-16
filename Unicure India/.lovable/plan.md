# Admin-controlled Website CMS

Goal: let admins customize the entire public site from `/admin` — branding, every page's content, navigation and footer — using form fields with a draft → publish workflow.

Realistically "every function" can't all be user-editable (auth flows, business logic, layout structure are code). What CAN be admin-controlled is **content, media, branding, nav, and page copy**. That's what this plan covers.

## Scope

**Editable from admin:**
- Site branding: site name, tagline, logo, favicon, primary color, accent color
- Global nav: header menu items (label + url + order)
- Footer: columns of links, contact info, social links, copyright
- Homepage: hero title/subtitle/image/CTAs, featured sections, stats
- Standard pages: About, Contact, Services/Products intro, Careers intro, News intro, Downloads intro — each with title, subtitle, hero image, and rich-text body sections
- SEO per page: meta title, meta description, OG image

**Already editable (unchanged):** Products, News, Careers, Downloads, Media library — these existing admin sections stay.

**Not in scope:** changing routes, adding new pages dynamically, editing components/code, changing auth or database structure.

## Data model

One flexible table drives everything:

```
site_content
├── key           text  (e.g. "branding", "nav", "footer", "page:home", "page:about")
├── draft         jsonb (working copy admins edit)
├── published     jsonb (what the live site renders)
├── published_at  timestamptz
├── published_by  uuid
└── updated_at    timestamptz
```

- Admins write to `draft` freely.
- "Publish" copies `draft` → `published` and stamps `published_at`.
- Public site reads `published` only.
- RLS: anon can `SELECT published` (via a view or column-restricted policy); only admins can write.
- Seeded with sensible defaults matching the current site so nothing breaks on day one.

Branding tokens (primary color, accent, fonts) flow into a `<style>` tag injected by the root route from published branding, so color changes take effect site-wide without a rebuild.

## Admin UI

New sections under `/admin`:

- `/admin/branding` — logo upload, colors (color picker), site name, tagline
- `/admin/navigation` — sortable list of header menu items
- `/admin/footer` — footer columns editor + social/contact
- `/admin/pages` — list of editable pages (Home, About, Contact, Services, Careers intro, News intro, Downloads intro)
- `/admin/pages/$key` — per-page editor: hero fields + repeatable content sections (heading, body, image) + SEO fields

Each editor has:
- Form fields per section (as chosen)
- **Save draft** — writes to `draft`
- **Preview draft** — opens the page with `?preview=1` to render draft content (admin-only)
- **Publish** — promotes draft to published, with a diff/confirmation
- **Discard changes** — resets draft to published

## Public site wiring

- Root route loads published `branding`, `nav`, `footer` server-side and injects them (colors as CSS vars, nav/footer into layout).
- Each public page (Home, About, Contact, etc.) loads its published `page:<key>` doc in the loader and renders sections from it.
- Existing hardcoded copy is migrated into the initial seed for each page's `published` doc.

## Technical notes

- Server functions in `src/lib/site-content.functions.ts` (admin CRUD + publish) and `src/lib/site-content-public.functions.ts` (public read, server publishable client, `TO anon SELECT` policy on published).
- Image uploads reuse existing `public-uploads` bucket.
- Zod schemas per content type validate draft shape before save.
- Preview mode: admin-only server fn returns `draft` when `?preview=1` and caller is admin.

## Phased delivery

This is 4–5 turns of work. Suggested order:

1. **Foundation** — `site_content` table, RLS, server fns, seed defaults, branding + nav + footer editors, wire root layout to published branding/nav/footer.
2. **Homepage editor** — editable hero + featured sections on `/`.
3. **Standard pages** — About, Contact, Services intro, Careers intro, News intro, Downloads intro editors.
4. **Preview mode + SEO fields** — draft preview via `?preview=1`, per-page meta title/description/OG image.

**I'll start with phase 1 once you approve.** Want me to proceed, or narrow/adjust the scope first?
