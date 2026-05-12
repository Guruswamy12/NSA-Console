import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const HEADING_SIZES: Record<number, string> = {
  1: "1.75rem",
  2: "1.375rem",
  3: "1.125rem",
  4: "1rem",
  5: "0.9rem",
  6: "0.8rem",
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content here...",
  minHeight = "150px",
}: RichTextEditorProps) {
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setHeaderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none px-3 py-2 text-sm text-gray-800",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) return null;

  const getActiveHeaderLevel = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) return i;
    }
    return null;
  };

  const activeHeaderLevel = getActiveHeaderLevel();
  const ToolBtn = ({
    onMouseDown,
    active,
    title,
    children,
  }: {
    onMouseDown: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      className={`h-6 w-6 flex items-center justify-center rounded transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
        <ToolBtn
          title="Bold"
          active={editor.isActive("bold")}
          onMouseDown={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="Italic"
          active={editor.isActive("italic")}
          onMouseDown={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            title="Heading"
            onMouseDown={(e) => {
              e.preventDefault();
              setHeaderDropdownOpen((o) => !o);
            }}
            className={`h-6 px-1.5 flex items-center justify-center rounded transition-colors gap-0.5 ${
              activeHeaderLevel
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            <span className="text-xs font-semibold leading-none">
              {activeHeaderLevel ? `H${activeHeaderLevel}` : "H"}
            </span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {headerDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-38 overflow-y-auto min-w-[60px]">
              {([1, 2, 3, 4, 5, 6] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleHeading({ level }).run();
                    setHeaderDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                    activeHeaderLevel === level
                      ? "bg-primary text-white"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                  style={{ fontSize: HEADING_SIZES[level] }}
                >
                  h{level}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onMouseDown={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onMouseDown={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn
          title="Link"
          active={editor.isActive("link")}
          onMouseDown={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          <Link2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="Image"
          active={false}
          onMouseDown={() => {
            const url = window.prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn
          title="Undo"
          active={false}
          onMouseDown={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          title="Redo"
          active={false}
          onMouseDown={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
