'use client'

import { useRef } from 'react'
import { X, Paperclip, FileText, FileSpreadsheet, File } from 'lucide-react'

const MAX_COUNT = 5
const MAX_SIZE_MB = 10
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/haansofthwp',
  'application/x-hwp',
]

function FileIcon({ mime }: { mime: string }) {
  if (mime === 'application/pdf') return <FileText size={14} className="text-red-400" />
  if (mime.includes('excel') || mime.includes('spreadsheet')) return <FileSpreadsheet size={14} className="text-green-500" />
  return <File size={14} className="text-slate-400" />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

interface FileAttachmentListProps {
  files: File[]
  onChange: (files: File[]) => void
}

export function FileAttachmentList({ files, onChange }: FileAttachmentListProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const valid = selected.filter((f) => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false
      return true
    })
    const merged = [...files, ...valid].slice(0, MAX_COUNT)
    onChange(merged)
    e.target.value = ''
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          파일 첨부 <span className="text-slate-400 font-normal">({files.length}/{MAX_COUNT})</span>
        </span>
        {files.length < MAX_COUNT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Paperclip size={14} />
            파일 추가
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <FileIcon mime={file.type} />
              <span className="flex-1 truncate text-slate-700">{file.name}</span>
              <span className="text-xs text-slate-400 shrink-0">{formatSize(file.size)}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="shrink-0 text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-400">PDF, HWP, DOC, DOCX, XLS, XLSX · 최대 {MAX_SIZE_MB}MB · 최대 {MAX_COUNT}개</p>
    </div>
  )
}
