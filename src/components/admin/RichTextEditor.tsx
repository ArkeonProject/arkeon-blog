import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useCallback, useState } from "react";
import {
  FiBold, FiItalic, FiUnderline, FiLink, FiImage,
  FiList, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiCode, FiMinus, FiRotateCcw, FiRotateCw,
} from "react-icons/fi";

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg text-sm transition-colors duration-150 ${
        active
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-border/60 mx-1 shrink-0" />;
}

// ─── Heading selector ─────────────────────────────────────────────────────────

function HeadingSelect({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const getValue = () => {
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive("heading", { level: i })) return String(i);
    }
    return "p";
  };

  return (
    <select
      value={getValue()}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "p") editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: parseInt(v) as 1 | 2 | 3 | 4 }).run();
      }}
      className="text-xs bg-muted border border-border/60 rounded-lg px-2 py-1.5 text-muted-foreground hover:text-foreground outline-none cursor-pointer"
    >
      <option value="p">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option value="4">Heading 4</option>
    </select>
  );
}

// ─── Link dialog ──────────────────────────────────────────────────────────────

function LinkDialog({
  onConfirm, onClose,
}: {
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-80 space-y-4">
        <h3 className="font-display font-semibold">Insert link</h3>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onConfirm(url); if (e.key === "Escape") onClose(); }}
          placeholder="https://example.com"
          className="w-full px-3 py-2 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 outline-none text-sm"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => onConfirm(url)} className="px-4 py-2 rounded-xl text-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">Insert</button>
        </div>
      </div>
    </div>
  );
}

// ─── Image dialog ─────────────────────────────────────────────────────────────

function ImageDialog({
  onConfirm, onClose,
}: {
  onConfirm: (src: string, alt: string) => void;
  onClose: () => void;
}) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-80 space-y-4">
        <h3 className="font-display font-semibold">Insert image</h3>
        <input autoFocus type="url" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 outline-none text-sm" />
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text (optional)" className="w-full px-3 py-2 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 outline-none text-sm" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => onConfirm(src, alt)} className="px-4 py-2 rounded-xl text-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">Insert</button>
        </div>
      </div>
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your post content…",
  minHeight = "400px",
}: RichTextEditorProps) {
  const [linkDialog, setLinkDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: "not-prose rounded-xl bg-muted p-4 font-mono text-sm overflow-x-auto" } },
        blockquote: { HTMLAttributes: { class: "border-l-4 border-primary/40 pl-4 italic text-muted-foreground" } },
        bulletList: { HTMLAttributes: { class: "list-disc pl-6 space-y-1" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6 space-y-1" } },
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline underline-offset-4 hover:opacity-80" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full border border-border/60 my-4" } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit] prose prose-sm dark:prose-invert max-w-none focus:outline-none px-5 py-4",
      },
    },
  });

  // Sync external value changes (e.g. when editing a post)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const insertLink = useCallback((url: string) => {
    if (!editor || !url) return;
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setLinkDialog(false);
  }, [editor]);

  const insertImage = useCallback((src: string, alt: string) => {
    if (!editor || !src) return;
    editor.chain().focus().setImage({ src, alt }).run();
    setImageDialog(false);
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      {linkDialog && <LinkDialog onConfirm={insertLink} onClose={() => setLinkDialog(false)} />}
      {imageDialog && <ImageDialog onConfirm={insertImage} onClose={() => setImageDialog(false)} />}

      <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60 transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border/60 bg-muted/40">
          <HeadingSelect editor={editor} />

          <Separator />

          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (⌘B)">
            <FiBold />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (⌘I)">
            <FiItalic />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (⌘U)">
            <FiUnderline />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
            <FiCode />
          </ToolBtn>

          <Separator />

          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <FiList />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
            <span className="text-xs font-mono leading-none">1.</span>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
            <span className="text-xs font-mono leading-none">"</span>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
            <span className="text-xs font-mono leading-none">{"{}"}</span>
          </ToolBtn>

          <Separator />

          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
            <FiAlignLeft />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
            <FiAlignCenter />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
            <FiAlignRight />
          </ToolBtn>

          <Separator />

          <ToolBtn onClick={() => setLinkDialog(true)} active={editor.isActive("link")} title="Insert link">
            <FiLink />
          </ToolBtn>
          <ToolBtn onClick={() => setImageDialog(true)} title="Insert image">
            <FiImage />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
            <FiMinus />
          </ToolBtn>

          <Separator />

          <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)">
            <FiRotateCcw />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)">
            <FiRotateCw />
          </ToolBtn>

          <div className="ml-auto text-xs text-muted-foreground font-mono">
            {editor.storage.characterCount?.characters?.() ?? 0} chars
          </div>
        </div>

        {/* Editor area */}
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}
