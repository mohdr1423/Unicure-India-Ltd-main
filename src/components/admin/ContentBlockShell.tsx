import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getSiteContentBlock,
  saveSiteContentDraft,
  publishSiteContentBlock,
  discardSiteContentDraft,
  listSiteContentVersions,
  restoreSiteContentVersion,
} from "@/lib/site-content.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Undo2, Loader2, History, Eye, EyeOff, CheckCircle2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

type Props<T> = {
  keyName: string;
  title: string;
  description?: string;
  defaultDraft: T;
  render: (state: { value: T; setValue: (updater: (prev: T) => T) => void }) => ReactNode;
};

export function ContentBlockShell<T extends object>({
  keyName,
  title,
  description,
  defaultDraft,
  render,
  helpText,
  previewPath = "/",
}: Props<T> & { helpText?: string; previewPath?: string }) {
  const qc = useQueryClient();
  const get = useServerFn(getSiteContentBlock);
  const save = useServerFn(saveSiteContentDraft);
  const publish = useServerFn(publishSiteContentBlock);
  const discard = useServerFn(discardSiteContentDraft);
  const listVersions = useServerFn(listSiteContentVersions);
  const restoreVersion = useServerFn(restoreSiteContentVersion);

  const { data, isLoading } = useQuery({
    queryKey: ["site-content", keyName],
    queryFn: () => get({ data: { key: keyName } }),
  });

  const value: T = (data?.draft as T) ?? defaultDraft;
  const isDirty = data ? JSON.stringify(data.draft) !== JSON.stringify(data.published) : false;

  const setValue = (updater: (prev: T) => T) => {
    qc.setQueryData(["site-content", keyName], (prev: any) => ({
      ...(prev ?? { key: keyName, published: defaultDraft, published_at: null, updated_at: "" }),
      draft: updater((prev?.draft as T) ?? defaultDraft),
    }));
  };

  const saveMut = useMutation({
    mutationFn: () => save({ data: { key: keyName, draft: value } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const publishMut = useMutation({
    mutationFn: async () => {
      await save({ data: { key: keyName, draft: value } });
      return publish({ data: { key: keyName } });
    },
    onSuccess: () => {
      toast.success("Published — visitors will see the changes now.");
      qc.invalidateQueries({ queryKey: ["site-content", keyName] });
      qc.invalidateQueries({ queryKey: ["site-chrome"] });
      qc.invalidateQueries({ queryKey: ["site-content-versions", keyName] });
      setPreviewNonce((n) => n + 1);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Publish failed"),
  });

  const discardMut = useMutation({
    mutationFn: () => discard({ data: { key: keyName } }),
    onSuccess: () => {
      toast.success("Draft reset to published version.");
      qc.invalidateQueries({ queryKey: ["site-content", keyName] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Reset failed"),
  });

  const restoreMut = useMutation({
    mutationFn: (versionId: string) => restoreVersion({ data: { versionId } }),
    onSuccess: () => {
      toast.success("Restored — click Save & Publish to make it live.");
      qc.invalidateQueries({ queryKey: ["site-content", keyName] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Restore failed"),
  });

  const versionsQ = useQuery({
    queryKey: ["site-content-versions", keyName],
    queryFn: () => listVersions({ data: { key: keyName } }),
  });

  // Autosave: debounce dirty draft to server every 1.5s
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const autosaveRef = useRef<any>(null);
  useEffect(() => {
    if (!data || !isDirty) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(async () => {
      try {
        await save({ data: { key: keyName, draft: value } });
        setLastSavedAt(Date.now());
      } catch {
        /* toast already surfaces on manual save */
      }
    }, 1500);
    return () => autosaveRef.current && clearTimeout(autosaveRef.current);
  }, [JSON.stringify(value), isDirty, data?.updated_at]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewNonce, setPreviewNonce] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const busy = saveMut.isPending || publishMut.isPending || discardMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {isDirty ? (
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Draft — not visible to visitors yet
            </Badge>
          ) : data?.published_at ? (
            <Badge className="bg-green-600 hover:bg-green-600 gap-1">
              <CheckCircle2 className="h-3 w-3" /> Live
            </Badge>
          ) : null}
        </div>
      </div>

      {helpText && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground flex gap-2">
          <HelpCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span>{helpText}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className={`grid gap-6 ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_480px]" : ""}`}>
          <div className="space-y-6 min-w-0 max-w-3xl">
            <div className="rounded-md border bg-background p-5">{render({ value, setValue })}</div>

            <div className="flex flex-wrap items-center gap-2">
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button disabled={busy}>
                    <Send className="h-4 w-4 mr-2" /> Save & Publish
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Publish these changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your draft will replace what visitors see on the live site right away. You can
                      restore a previous version later from the History menu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Not yet</AlertDialogCancel>
                    <AlertDialogAction onClick={() => publishMut.mutate()}>
                      Yes, publish now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                disabled={busy || !isDirty}
                onClick={() => discardMut.mutate()}
              >
                <Undo2 className="h-4 w-4 mr-2" /> Discard changes
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <History className="h-4 w-4 mr-2" /> History
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  <DropdownMenuLabel>Previously published versions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(versionsQ.data ?? []).length === 0 ? (
                    <div className="px-2 py-4 text-xs text-muted-foreground">
                      No older versions yet. They'll appear here after your first publish.
                    </div>
                  ) : (
                    (versionsQ.data ?? []).map((v) => (
                      <DropdownMenuItem
                        key={v.id}
                        onClick={() => restoreMut.mutate(v.id)}
                        className="flex flex-col items-start gap-0.5"
                      >
                        <span className="text-sm">{new Date(v.published_at).toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          Click to load into the editor
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" onClick={() => setShowPreview((s) => !s)}>
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" /> Hide preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" /> Live preview
                  </>
                )}
              </Button>

              <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                {saveMut.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                  </>
                ) : lastSavedAt ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600" /> Draft autosaved
                  </>
                ) : isDirty ? (
                  <>Autosaves as you type</>
                ) : (
                  <>All changes saved</>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.published_at
                ? `Last published ${new Date(data.published_at).toLocaleString()}. Publishing shows your draft to real visitors.`
                : "Nothing is live yet. Click Save & Publish when you're ready for visitors to see this."}
            </p>
          </div>

          {showPreview && (
            <div className="rounded-md border overflow-hidden bg-background sticky top-4 h-[80vh]">
              <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
                <span>Live preview — {previewPath}</span>
                <button
                  className="hover:text-foreground"
                  onClick={() => setPreviewNonce((n) => n + 1)}
                >
                  Refresh
                </button>
              </div>
              <iframe
                key={previewNonce}
                src={previewPath}
                title="Live site preview"
                className="w-full h-[calc(80vh-33px)]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Reusable field wrapper with label and optional plain-English help text. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
