'use client'

import { useState } from 'react'
import { ImageAttachmentPreview, ExistingImage } from './ImageAttachmentPreview'
import { FileAttachmentList, ExistingAttachment } from './FileAttachmentList'

interface AttachmentSectionProps {
  imageFiles: File[]
  attachmentFiles: File[]
  onImageChange: (files: File[]) => void
  onAttachmentChange: (files: File[]) => void
  initialImages?: ExistingImage[]
  initialAttachments?: ExistingAttachment[]
}

export function AttachmentSection({
  imageFiles,
  attachmentFiles,
  onImageChange,
  onAttachmentChange,
  initialImages = [],
  initialAttachments = [],
}: AttachmentSectionProps) {
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(initialImages)
  const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>(initialAttachments)

  return (
    <div className="space-y-4 border border-slate-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-slate-700">첨부파일</p>
      <ImageAttachmentPreview
        files={imageFiles}
        onChange={onImageChange}
        existingImages={existingImages}
        onExistingDelete={(id) => setExistingImages((prev) => prev.filter((img) => img.id !== id))}
      />
      <hr className="border-slate-100" />
      <FileAttachmentList
        files={attachmentFiles}
        onChange={onAttachmentChange}
        existingAttachments={existingAttachments}
        onExistingDelete={(id) => setExistingAttachments((prev) => prev.filter((a) => a.id !== id))}
      />
    </div>
  )
}
