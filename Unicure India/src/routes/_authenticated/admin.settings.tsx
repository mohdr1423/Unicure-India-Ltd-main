import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { RichEditor } from "@/components/admin/RichEditor";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

type Contact = { phone?: string; email?: string; address?: string; hours?: string; body?: string };
type Hero = { headline?: string; subheadline?: string; body?: string };
type About = { mission?: string; vision?: string; body?: string };

function SettingsAdmin() {
  const [contact, setContact] = useState<Contact>({});
  const [hero, setHero] = useState<Hero>({});
  const [about, setAbout] = useState<About>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*");
      (data ?? []).forEach((r: any) => {
        if (r.key === "contact") setContact(r.value ?? {});
        if (r.key === "hero") setHero(r.value ?? {});
        if (r.key === "about") setAbout(r.value ?? {});
      });
    })();
  }, []);

  async function saveKey(key: string, value: object) {
    setBusy(true);
    const { error } = await supabase.from("site_settings").upsert({ key, value } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${key} saved`);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Site settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Headline shown on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Headline</Label>
            <Input
              value={hero.headline ?? ""}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
            />
          </div>
          <div>
            <Label>Subheadline</Label>
            <Textarea
              rows={2}
              value={hero.subheadline ?? ""}
              onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
            />
          </div>
          <div>
            <Label>Rich content (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Shown under the homepage hero. Supports headings, lists, links.
            </p>
            <RichEditor
              value={hero.body ?? ""}
              onChange={(html) => setHero({ ...hero, body: html })}
            />
          </div>
          <Button disabled={busy} onClick={() => saveKey("hero", hero)}>
            Save hero
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Mission</Label>
            <Textarea
              rows={3}
              value={about.mission ?? ""}
              onChange={(e) => setAbout({ ...about, mission: e.target.value })}
            />
          </div>
          <div>
            <Label>Vision</Label>
            <Textarea
              rows={3}
              value={about.vision ?? ""}
              onChange={(e) => setAbout({ ...about, vision: e.target.value })}
            />
          </div>
          <div>
            <Label>Rich content (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Appears on the About page. Use headings, lists, links, quotes.
            </p>
            <RichEditor
              value={about.body ?? ""}
              onChange={(html) => setAbout({ ...about, body: html })}
              minHeight={240}
            />
          </div>
          <Button disabled={busy} onClick={() => saveKey("about", about)}>
            Save about
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Shown in the footer and contact page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input
                value={contact.phone ?? ""}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={contact.email ?? ""}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              rows={2}
              value={contact.address ?? ""}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
            />
          </div>
          <div>
            <Label>Hours</Label>
            <Input
              value={contact.hours ?? ""}
              onChange={(e) => setContact({ ...contact, hours: e.target.value })}
            />
          </div>
          <div>
            <Label>Rich content (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Appears on the Contact page above the form.
            </p>
            <RichEditor
              value={contact.body ?? ""}
              onChange={(html) => setContact({ ...contact, body: html })}
            />
          </div>
          <Button disabled={busy} onClick={() => saveKey("contact", contact)}>
            Save contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
