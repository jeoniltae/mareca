// shadcn/ui 스타일 Skeleton 기본 컴포넌트
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />
  )
}
