import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Link as LinkIcon, Minus } from 'lucide-react';
import { useEffect, useCallback } from 'react';

export default function TipTapEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || 'What\'s on your mind today? Start writing your story...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none px-1 py-2',
      },
    },
  });

  // Sync external content changes (e.g., loading a draft)
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const BubbleBtn = ({ onClick, active, children, label }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${
        active ? 'bg-terracotta text-cream' : 'text-deep-indigo hover:bg-deep-indigo/10'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="relative">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 150, placement: 'top' }}
        className="flex items-center gap-0.5 bg-white rounded-xl shadow-lg border border-sunset-orange/20 p-1"
      >
        <BubbleBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="Bold">
          <Bold size={18} />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="Italic">
          <Italic size={18} />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} label="Strike">
          <Strikethrough size={18} />
        </BubbleBtn>
        <div className="w-px h-6 bg-sunset-orange/20" />
        <BubbleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="Heading 1">
          <Heading1 size={18} />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="Heading 2">
          <Heading2 size={18} />
        </BubbleBtn>
        <div className="w-px h-6 bg-sunset-orange/20" />
        <BubbleBtn onClick={setLink} active={editor.isActive('link')} label="Link">
          <LinkIcon size={18} />
        </BubbleBtn>
      </BubbleMenu>

      {/* Bottom Quick Toolbar for mobile */}
      <div className="flex items-center gap-1 mb-2 overflow-x-auto scrollbar-hide pb-1">
        {[
          { icon: <Bold size={16} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
          { icon: <Italic size={16} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
          { icon: <Heading1 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), label: 'H1' },
          { icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'H2' },
          { icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet' },
          { icon: <ListOrdered size={16} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Numbered' },
          { icon: <Quote size={16} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Quote' },
          { icon: <Minus size={16} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, label: 'Divider' },
          { icon: <LinkIcon size={16} />, action: setLink, active: editor.isActive('link'), label: 'Link' },
        ].map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            aria-label={btn.label}
            className={`flex-shrink-0 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
              btn.active ? 'bg-terracotta/10 text-terracotta' : 'text-deep-indigo/60 hover:bg-deep-indigo/5'
            }`}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-sunset-orange/20 p-4 min-h-[250px]">
        <EditorContent editor={editor} />
      </div>

      {/* Word count */}
      <div className="text-right mt-1">
        <span className="text-xs font-mono text-earth-brown/50">
          {editor.storage.characterCount?.words?.() || editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}
