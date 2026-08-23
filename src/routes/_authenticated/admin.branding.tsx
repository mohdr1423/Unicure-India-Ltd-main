import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell, Field } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";

type Branding = {
  site_name: string;
  tagline: string;
  company_name: string;
  primary_color: string;
  accent_color: string;
  phone: string;
  email: string;
  address: string;
};

const DEFAULTS: Branding = {
  site_name: "Unicure India",
  tagline: "Limited",
  company_name: "Unicure India Ltd",
  primary_color: "#0b3b8f",
  accent_color: "#2b8ac9",
  phone: "0120-4786786",
  email: "unicure@unicureindia.com",
  address: "C-21, 22 & 23 Sector-3, Noida-201301, U.P., India",
};

export const Route = createFileRoute("/_authenticated/admin/branding")({
  component: BrandingEditor,
  head: () => ({ meta: [{ title: "Branding — Admin" }, { name: "robots", content: "noindex" }] }),
});

function BrandingEditor() {
  return (
    <ContentBlockShell<Branding>
      keyName="branding"
      title="Branding & contact"
      description="These details appear in your header, footer, and contact page."
      helpText="Not sure? Start with your site name and colors — everything is saved as a draft and only goes live when you click Save & Publish."
      previewPath="/"
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name" hint="Shown in the top-left of every page.">
            <Input value={value.site_name} onChange={(e) => setValue((p) => ({ ...p, site_name: e.target.value }))} />
          </Field>
          <Field label="Tagline" hint="The small line under your site name.">
            <Input value={value.tagline} onChange={(e) => setValue((p) => ({ ...p, tagline: e.target.value }))} />
          </Field>
          <Field label="Company name" hint="Used in the footer's copyright line.">
            <Input value={value.company_name} onChange={(e) => setValue((p) => ({ ...p, company_name: e.target.value }))} />
          </Field>
          <Field label="Phone" hint="Visitors can click this to call you.">
            <Input value={value.phone} onChange={(e) => setValue((p) => ({ ...p, phone: e.target.value }))} />
          </Field>
          <Field label="Email" hint="Contact form and footer use this address.">
            <Input type="email" value={value.email} onChange={(e) => setValue((p) => ({ ...p, email: e.target.value }))} />
          </Field>
          <Field label="Address" hint="Your office or headquarters address.">
            <Input value={value.address} onChange={(e) => setValue((p) => ({ ...p, address: e.target.value }))} />
          </Field>
          <Field label="Primary color" hint="The main brand color — used for buttons and headings.">
            <div className="flex gap-2">
              <Input type="color" className="h-10 w-14 p-1" value={value.primary_color}
                onChange={(e) => setValue((p) => ({ ...p, primary_color: e.target.value }))} />
              <Input value={value.primary_color}
                onChange={(e) => setValue((p) => ({ ...p, primary_color: e.target.value }))} />
            </div>
          </Field>
          <Field label="Accent color" hint="A second color used for links and highlights.">
            <div className="flex gap-2">
              <Input type="color" className="h-10 w-14 p-1" value={value.accent_color}
                onChange={(e) => setValue((p) => ({ ...p, accent_color: e.target.value }))} />
              <Input value={value.accent_color}
                onChange={(e) => setValue((p) => ({ ...p, accent_color: e.target.value }))} />
            </div>
          </Field>
        </div>
      )}
    />
  );
}