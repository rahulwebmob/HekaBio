/**
 * Rich Text Editor Component
 * Using TipTap for rich text editing capabilities
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconCode,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconH1,
  IconH2,
  IconH3,
  IconSeparator,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  error?: string;
  disabled?: boolean;
}

// MenuButton component - extracted to avoid recreation on each render
const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? 'bg-brand-100 text-brand-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  maxHeight = 600,
  error,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        error
          ? 'border-error-500'
          : 'border-gray-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500'
      } ${disabled ? 'bg-gray-50' : 'bg-white'}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={disabled}
            title="Bold"
          >
            <IconBold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={disabled}
            title="Italic"
          >
            <IconItalic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={disabled}
            title="Strikethrough"
          >
            <IconStrikethrough size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={disabled}
            title="Inline Code"
          >
            <IconCode size={18} />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            disabled={disabled}
            title="Heading 1"
          >
            <IconH1 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            disabled={disabled}
            title="Heading 2"
          >
            <IconH2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            disabled={disabled}
            title="Heading 3"
          >
            <IconH3 size={18} />
          </MenuButton>
        </div>

        {/* Lists & Quotes */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            disabled={disabled}
            title="Bullet List"
          >
            <IconList size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            disabled={disabled}
            title="Numbered List"
          >
            <IconListNumbers size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            disabled={disabled}
            title="Quote"
          >
            <IconBlockquote size={18} />
          </MenuButton>
        </div>

        {/* Other Actions */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={disabled}
            title="Horizontal Rule"
          >
            <IconSeparator size={18} />
          </MenuButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
            title="Undo"
          >
            <IconArrowBackUp size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
            title="Redo"
          >
            <IconArrowForwardUp size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="prose prose-sm max-w-none p-4 overflow-y-auto"
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-sm text-error-600 px-4 py-2 bg-error-50">{error}</p>}
    </div>
  );
}
