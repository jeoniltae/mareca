import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'

interface Attachment {
  id: string
  file_name: string
  file_url: string
  file_size: number
}

interface PostFileDownloadListProps {
  attachments: Attachment[]
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return <FileText size={15} className="text-red-400 shrink-0" />
  if (ext === 'xls' || ext === 'xlsx') return <FileSpreadsheet size={15} className="text-green-500 shrink-0" />
  return <File size={15} className="text-slate-400 shrink-0" />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function PostFileDownloadList({ attachments }: PostFileDownloadListProps) {
  if (attachments.length === 0) return null

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-700 mb-3">첨부 파일</p>
      <ul className="space-y-2">
        {attachments.map((att) => (
          <li key={att.id}>
            <a
              href={att.file_url}
              download={att.file_name}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-sm"
            >
              <FileIcon name={att.file_name} />
              <span className="flex-1 truncate text-slate-700">{att.file_name}</span>
              <span className="text-xs text-slate-400 shrink-0">{formatSize(att.file_size)}</span>
              <Download size={14} className="text-slate-400 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
