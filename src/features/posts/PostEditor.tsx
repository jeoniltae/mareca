'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadImage } from './actions'
import { useState } from 'react'

interface PostEditorProps {
  initialContent?: string
  onChange: (html: string) => void
  onImageUploaded?: (url: string) => void
}

export function PostEditor({ initialContent = '', onChange, onImageUploaded }: PostEditorProps) {
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-2' } }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-sky-600 underline' } }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'outline-none min-h-[320px] p-4 prose prose-slate max-w-none' },
    },
  })

  if (!editor) return null

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const url = await uploadImage(fd)
        editor.chain().focus().setImage({ src: url }).run()
        onImageUploaded?.(url)
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition-all">
      {/* 툴바 */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50 flex-wrap">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게 (Ctrl+B)">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임 (Ctrl+I)">
          <Italic size={14} />
        </Btn>
        <Divider />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="제목 2">
          <Heading2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="제목 3">
          <Heading3 size={14} />
        </Btn>
        <Divider />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="목록">
          <List size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="번호 목록">
          <ListOrdered size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <Minus size={14} />
        </Btn>
        <Divider />
        <Btn onClick={handleImageUpload} disabled={uploading} title="이미지 삽입">
          {uploading ? (
            <span className="text-[10px] text-slate-400">업로드중</span>
          ) : (
            <ImageIcon size={14} />
          )}
        </Btn>
        <Divider />
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="실행 취소">
          <Undo size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="다시 실행">
          <Redo size={14} />
        </Btn>
      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  )
}

function Btn({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        active ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
        disabled && 'opacity-30 cursor-not-allowed pointer-events-none',
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-slate-200 mx-1 shrink-0" />
}
