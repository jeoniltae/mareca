'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteGalleryPost } from './actions'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { cn } from '@/lib/utils'

interface GalleryActionsProps {
  id: string
}

export function GalleryActions({ id }: GalleryActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)

  function handleConfirm() {
    if (dialog === 'edit') {
      setDialog(null)
      router.push(`/community/gallery/${id}/edit`)
    } else if (dialog === 'delete') {
      setDialog(null)
      startTransition(async () => {
        await deleteGalleryPost(id)
      })
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDialog('edit')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Pencil size={13} />
          수정
        </button>
        <button
          type="button"
          onClick={() => setDialog('delete')}
          disabled={isPending}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors',
            isPending && 'opacity-50 cursor-not-allowed',
          )}
        >
          <Trash2 size={13} />
          {isPending ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <ConfirmDialog
        open={dialog === 'edit'}
        variant="default"
        title="게시글을 수정하시겠습니까?"
        confirmLabel="수정하기"
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'delete'}
        variant="danger"
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 게시글은 복구할 수 없습니다."
        confirmLabel="삭제하기"
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </>
  )
}
