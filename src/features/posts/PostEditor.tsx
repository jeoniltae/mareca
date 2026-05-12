'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
  Minus,
  Quote,
  Link as LinkIcon,
  Link2Off,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Rows3,
  Columns3,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadImage } from './actions'
import { useState, useRef } from 'react'

interface PostEditorProps {
  initialContent?: string
  onChange: (html: string) => void
  onImageUploaded?: (url: string) => void
}

const TEXT_COLORS = [
  { label: '기본', value: '' },
  { label: '빨강', value: '#ef4444' },
  { label: '주황', value: '#f97316' },
  { label: '노랑', value: '#eab308' },
  { label: '초록', value: '#22c55e' },
  { label: '파랑', value: '#3b82f6' },
  { label: '보라', value: '#a855f7' },
  { label: '회색', value: '#6b7280' },
]

export function PostEditor({ initialContent = '', onChange, onImageUploaded }: PostEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showTablePicker, setShowTablePicker] = useState(false)
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 })
  const linkInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-2' } }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-sky-600 underline' } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
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

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run()
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      editor.chain().focus().setLink({ href: url }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  const handleLinkOpen = () => {
    const existing = editor.getAttributes('link').href as string | undefined
    setLinkUrl(existing ?? '')
    setShowLinkInput(true)
    setTimeout(() => linkInputRef.current?.focus(), 0)
  }

  const currentColor = editor.getAttributes('textStyle').color as string | undefined

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition-all">
      {/* 툴바 */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50 flex-wrap">
        {/* 텍스트 정렬 */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
          <AlignLeft size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬">
          <AlignCenter size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
          <AlignRight size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="양쪽 정렬">
          <AlignJustify size={14} />
        </Btn>

        <Divider />

        {/* 텍스트 서식 */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게 (Ctrl+B)">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임 (Ctrl+I)">
          <Italic size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄 (Ctrl+U)">
          <UnderlineIcon size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="취소선">
          <Strikethrough size={14} />
        </Btn>

        <Divider />

        {/* 텍스트 색상 */}
        <div className="relative">
          <button
            type="button"
            title="텍스트 색상"
            onClick={() => { setShowColorPicker(v => !v); setShowLinkInput(false) }}
            className={cn(
              'p-1.5 rounded-md transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100',
              showColorPicker && 'bg-slate-200 text-slate-900',
            )}
          >
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] font-bold leading-none" style={{ color: currentColor || undefined }}>A</span>
              <span className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: currentColor || '#6b7280' }} />
            </span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex gap-1.5 flex-wrap w-44">
              {TEXT_COLORS.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onClick={() => {
                    if (!value) {
                      editor.chain().focus().unsetColor().run()
                    } else {
                      editor.chain().focus().setColor(value).run()
                    }
                    setShowColorPicker(false)
                  }}
                  className={cn(
                    'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                    !value && 'border-slate-300 bg-white',
                    currentColor === value && value ? 'border-slate-800' : 'border-transparent',
                  )}
                  style={value ? { backgroundColor: value } : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* 하이라이트 */}
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="형광펜">
          <Highlighter size={14} />
        </Btn>

        <Divider />

        {/* 제목 */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="제목 2">
          <Heading2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="제목 3">
          <Heading3 size={14} />
        </Btn>

        <Divider />

        {/* 목록 */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="목록">
          <List size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="번호 목록">
          <ListOrdered size={14} />
        </Btn>

        {/* 인용구 */}
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="인용구">
          <Quote size={14} />
        </Btn>

        {/* 구분선 */}
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <Minus size={14} />
        </Btn>

        <Divider />

        {/* 링크 */}
        <Btn onClick={handleLinkOpen} active={editor.isActive('link')} title="링크 삽입">
          <LinkIcon size={14} />
        </Btn>
        {editor.isActive('link') && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="링크 제거">
            <Link2Off size={14} />
          </Btn>
        )}

        <Divider />

        {/* 테이블 */}
        <div className="relative">
          <Btn
            onClick={() => { setShowTablePicker(v => !v); setShowColorPicker(false); setShowLinkInput(false) }}
            active={showTablePicker}
            title="테이블 삽입"
          >
            <TableIcon size={14} />
          </Btn>
          {showTablePicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
              <p className="text-[10px] text-slate-400 mb-1.5 text-center">
                {tableHover.rows > 0 && tableHover.cols > 0
                  ? `${tableHover.rows} × ${tableHover.cols}`
                  : '행 × 열 선택'}
              </p>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                {Array.from({ length: 36 }, (_, i) => {
                  const r = Math.floor(i / 6) + 1
                  const c = (i % 6) + 1
                  const active = r <= tableHover.rows && c <= tableHover.cols
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setTableHover({ rows: r, cols: c })}
                      onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}
                      onClick={() => {
                        editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run()
                        setShowTablePicker(false)
                        setTableHover({ rows: 0, cols: 0 })
                      }}
                      className={cn(
                        'w-5 h-5 border rounded-sm transition-colors',
                        active ? 'bg-sky-200 border-sky-400' : 'bg-slate-100 border-slate-300',
                      )}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 테이블 조작 — 테이블 셀 안에 커서가 있을 때만 표시 */}
        {editor.isActive('table') && (
          <>
            <Divider />
            <Btn onClick={() => editor.chain().focus().addRowBefore().run()} title="위에 행 추가">
              <span className="flex flex-col items-center gap-px">
                <span className="w-3 h-px bg-sky-500 rounded" />
                <Rows3 size={12} />
              </span>
            </Btn>
            <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="아래에 행 추가">
              <span className="flex flex-col items-center gap-px">
                <Rows3 size={12} />
                <span className="w-3 h-px bg-sky-500 rounded" />
              </span>
            </Btn>
            <Btn onClick={() => editor.chain().focus().deleteRow().run()} title="현재 행 삭제">
              <span className="flex items-center gap-0.5">
                <Rows3 size={12} />
                <Trash2 size={10} className="text-red-400" />
              </span>
            </Btn>
            <Divider />
            <Btn onClick={() => editor.chain().focus().addColumnBefore().run()} title="왼쪽에 열 추가">
              <span className="flex items-center gap-px">
                <span className="w-px h-3 bg-sky-500 rounded" />
                <Columns3 size={12} />
              </span>
            </Btn>
            <Btn onClick={() => editor.chain().focus().addColumnAfter().run()} title="오른쪽에 열 추가">
              <span className="flex items-center gap-px">
                <Columns3 size={12} />
                <span className="w-px h-3 bg-sky-500 rounded" />
              </span>
            </Btn>
            <Btn onClick={() => editor.chain().focus().deleteColumn().run()} title="현재 열 삭제">
              <span className="flex items-center gap-0.5">
                <Columns3 size={12} />
                <Trash2 size={10} className="text-red-400" />
              </span>
            </Btn>
            <Divider />
            <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="테이블 삭제">
              <span className="flex items-center gap-0.5">
                <TableIcon size={12} />
                <Trash2 size={10} className="text-red-400" />
              </span>
            </Btn>
          </>
        )}

        <Divider />

        {/* 이미지 */}
        <Btn onClick={handleImageUpload} disabled={uploading} title="이미지 삽입">
          {uploading ? (
            <span className="text-[10px] text-slate-400">업로드중</span>
          ) : (
            <ImageIcon size={14} />
          )}
        </Btn>

        <Divider />

        {/* 실행취소/다시실행 */}
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="실행 취소">
          <Undo size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="다시 실행">
          <Redo size={14} />
        </Btn>
      </div>

      {/* 링크 입력 바 */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
          <LinkIcon size={13} className="text-slate-400 shrink-0" />
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleLinkSubmit() }
              if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl('') }
            }}
            placeholder="URL 입력 (예: https://example.com)"
            className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleLinkSubmit}
            className="shrink-0 text-xs px-2.5 py-1 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); setLinkUrl('') }}
            className="shrink-0 text-xs px-2.5 py-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            취소
          </button>
        </div>
      )}

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className="bg-white"
        onClick={() => { setShowColorPicker(false); setShowTablePicker(false) }}
      />
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
