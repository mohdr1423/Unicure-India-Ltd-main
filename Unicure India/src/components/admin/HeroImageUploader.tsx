import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, ImageIcon, Trash2, Crop as CropIcon } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "public-uploads";
const SIGNED_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

const ASPECTS: { label: string; value: number }[] = [
  { label: "16:9 (widescreen)", value: 16 / 9 },
  { label: "21:9 (cinema)", value: 21 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1 (square)", value: 1 },
  { label: "3:2", value: 3 / 2 },
];

type Props = {
  value?: string;
  onChange: (url: string) => void;
  defaultAspect?: number;
  maxWidth?: number;
};

export function HeroImageUploader({ value, onChange, defaultAspect = 16 / 9, maxWidth = 1920 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [srcData, setSrcData] = useState<string | null>(null);
  const [aspect, setAspect] = useState(defaultAspect);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [quality, setQuality] = useState(0.85);
  const [outWidth, setOutWidth] = useState(maxWidth);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onFilePicked = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSrcData(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_a: Area, pixels: Area) => setCroppedArea(pixels), []);

  async function applyAndUpload() {
    if (!srcData || !croppedArea) return;
    setBusy(true);
    try {
      const img = await loadImage(srcData);
      const scale = Math.min(1, outWidth / croppedArea.width);
      const targetW = Math.round(croppedArea.width * scale);
      const targetH = Math.round(croppedArea.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height,
        0, 0, targetW, targetH,
      );
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Compression failed"))), "image/jpeg", quality),
      );
      const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_TTL);
      if (signErr || !signed?.signedUrl) throw signErr ?? new Error("Could not create URL");
      onChange(signed.signedUrl);
      toast.success(`Hero image updated (${(blob.size / 1024).toFixed(0)} KB)`);
      setSrcData(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="relative w-56 aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <img src={value} alt="Hero preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFilePicked(e.target.files?.[0] ?? undefined)}
          />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> {value ? "Replace image" : "Upload image"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <Trash2 className="h-4 w-4 mr-2" /> Remove
            </Button>
          )}
          <p className="text-xs text-muted-foreground max-w-xs">
            Drop-in image gets cropped, resized to your chosen width, and compressed to JPEG before upload.
          </p>
        </div>
      </div>

      <Dialog open={!!srcData} onOpenChange={(o) => !o && setSrcData(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CropIcon className="h-4 w-4" /> Crop, resize & compress
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-80 bg-muted rounded-md overflow-hidden">
            {srcData && (
              <Cropper
                image={srcData}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Aspect ratio</Label>
              <Select value={String(aspect)} onValueChange={(v) => setAspect(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASPECTS.map((a) => (
                    <SelectItem key={a.label} value={String(a.value)}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Output width: {outWidth}px</Label>
              <Slider
                min={640} max={2400} step={80}
                value={[outWidth]}
                onValueChange={([v]) => setOutWidth(v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Zoom: {zoom.toFixed(2)}×</Label>
              <Slider min={1} max={4} step={0.05} value={[zoom]} onValueChange={([v]) => setZoom(v)} />
            </div>
            <div className="space-y-1.5">
              <Label>Quality: {Math.round(quality * 100)}%</Label>
              <Slider min={0.5} max={0.95} step={0.05} value={[quality]} onValueChange={([v]) => setQuality(v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => setSrcData(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" onClick={applyAndUpload} disabled={busy}>
              {busy ? "Uploading…" : "Save image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}