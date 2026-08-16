import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered,
  Quote, Undo2, Redo2, Link as LinkIcon, Unlink, Minus,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function RichEditor({ value, onChange, minHeight = 180 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noreferrer", target: "_blank", class: "text-primary underline" },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none px-4 py-3 " +
          "prose-headings:font-semibold prose-a:text-primary",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. initial fetch) without wiping cursor mid-typing.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  if (!editor) {
    return <div className="rounded-md border bg-background" style={{ minHeight: minHeight + 44 }} />;
  }

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `p-1.5 rounded hover:bg-muted ${active ? "bg-muted text-primary" : "text-muted-foreground"}`;

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1 bg-muted/30">
      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold"><Bold className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic"><Italic className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} aria-label="Strikethrough"><Strikethrough className="h-4 w-4" /></button>
      <span className="w-px h-5 bg-border mx-1" />
      <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2"><Heading2 className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3"><Heading3 className="h-4 w-4" /></button>
      <span className="w-px h-5 bg-border mx-1" />
      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list"><List className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered list"><ListOrdered className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Quote"><Quote className="h-4 w-4" /></button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Divider"><Minus className="h-4 w-4" /></button>
      <span className="w-px h-5 bg-border mx-1" />
      <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} aria-label="Link"><LinkIcon className="h-4 w-4" /></button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().unsetLink().run()} aria-label="Remove link"><Unlink className="h-4 w-4" /></button>
      <span className="ml-auto flex gap-0.5">
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="Undo"><Undo2 className="h-4 w-4" /></button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="Redo"><Redo2 className="h-4 w-4" /></button>
      </span>
    </div>
  );
}