'use client'
// 최더함의 철학시가 상세의 수정·삭제 버튼 — 작성자 본인 또는 관리자에게만 렌더된다. 다크 배경용 스타일

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { deletePhilosophiaPost } from './actions'
import { plexMono } from './fonts'

type DialogType = 'edit' | 'delete' | null

interface PhilosophiaActionsProps {
  id: string
}

export function PhilosophiaActions({ id }: PhilosophiaActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState<DialogType>(null)

  function handleConfirm() {
    if (dialog === 'edit') {
      setDialog(null)
      router.replace(`/community/philosophia/${id}/edit`)
    } else if (dialog === 'delete') {
      setDialog(null)
      startTransition(async () => {
        await deletePhilosophiaPost(id)
      })
    }
  }

  return (
    <>
      <div className={`${plexMono.className} flex items-center gap-2`}>
        <button
          type="button"
          onClick={() => setDialog('edit')}
          className="flex items-center gap-1.5 rounded-full border border-[#EDE7D6]/25 px-4 py-1.5 text-[13px] text-[#EDE7D6]/70 transition-colors hover:border-[#D9B441]/70 hover:text-[#D9B441]"
        >
          <Pencil size={13} />
          수정
        </button>
        <button
          type="button"
          onClick={() => setDialog('delete')}
          disabled={isPending}
          className={cn(
            'flex items-center gap-1.5 rounded-full border border-[#E4736B]/40 px-4 py-1.5 text-[13px] text-[#E4736B] transition-colors hover:bg-[#E4736B]/10',
            isPending && 'cursor-not-allowed opacity-50',
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
