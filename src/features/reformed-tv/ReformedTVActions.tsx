'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { deleteReformedTVPost } from './actions'

type DialogType = 'edit' | 'delete' | null

interface ReformedTVActionsProps {
  id: string
}

export function ReformedTVActions({ id }: ReformedTVActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState<DialogType>(null)

  function handleConfirm() {
    if (dialog === 'edit') {
      setDialog(null)
      router.push(`/community/reformed-tv/${id}/edit`)
    } else if (dialog === 'delete') {
      setDialog(null)
      startTransition(async () => {
        await deleteReformedTVPost(id)
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
        title="영상을 삭제하시겠습니까?"
        description="삭제한 게시글은 복구할 수 없습니다."
        confirmLabel="삭제하기"
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </>
  )
}
