'use client'

import { ImageAttachmentPreview } from './ImageAttachmentPreview'
import { FileAttachmentList } from './FileAttachmentList'

interface AttachmentSectionProps {
  imageFiles: File[]
  attachmentFiles: File[]
  onImageChange: (files: File[]) => void
  onAttachmentChange: (files: File[]) => void
}

export function AttachmentSection({
  imageFiles,
  attachmentFiles,
  onImageChange,
  onAttachmentChange,
}: AttachmentSectionProps) {
  return (
    <div className="space-y-4 border border-slate-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-slate-700">첨부파일</p>
      <ImageAttachmentPreview files={imageFiles} onChange={onImageChange} />
      <hr className="border-slate-100" />
      <FileAttachmentList files={attachmentFiles} onChange={onAttachmentChange} />
    </div>
  )
}
