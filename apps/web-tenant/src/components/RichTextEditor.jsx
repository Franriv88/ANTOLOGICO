import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const BTN = 'p-1.5 rounded text-ink-muted hover:bg-surface-100 hover:text-ink transition-colors disabled:opacity-30';
const BTN_ACTIVE = 'p-1.5 rounded bg-primary/10 text-primary transition-colors';

function ToolbarButton({ editor, action, isActive, icon, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={action}
      className={isActive ? BTN_ACTIVE : BTN}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

export default function RichTextEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[180px] px-4 py-3 text-ink',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface-50">
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrita"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>'
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Itálica"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>'
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Subrayado"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>'
        />

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12l3-2v8"/></svg>'
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Subtítulo"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 01-2 2c-1.5 0-2 .5-2 2h4"/></svg>'
        />

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista con viñetas"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>'
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" font-size="8" fill="currentColor" stroke="none" font-family="sans-serif">1</text><text x="2" y="14" font-size="8" fill="currentColor" stroke="none" font-family="sans-serif">2</text><text x="2" y="20" font-size="8" fill="currentColor" stroke="none" font-family="sans-serif">3</text></svg>'
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Cita"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>'
        />

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          title="Línea separadora"
          icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>'
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror { min-height: 180px; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: '${placeholder || 'Escribí tus términos y condiciones...'}';
          float: left; color: #9C8E7A; pointer-events: none; height: 0;
        }
        .ProseMirror h2 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #2C2416; }
        .ProseMirror h3 { font-size: 1rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: #2C2416; }
        .ProseMirror p { margin: 0.3rem 0; line-height: 1.6; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0.4rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.4rem 0; }
        .ProseMirror li { margin: 0.15rem 0; }
        .ProseMirror blockquote { border-left: 3px solid #E5DDD0; padding-left: 1rem; margin: 0.5rem 0; color: #6B5D4D; }
        .ProseMirror hr { border: none; border-top: 1px solid #E5DDD0; margin: 1rem 0; }
        .ProseMirror strong { font-weight: 600; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u { text-decoration: underline; }
      `}</style>
    </div>
  );
}
