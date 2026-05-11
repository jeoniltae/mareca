// 게시물 목록 작성자 아이콘 — 계정 구분별 다른 아이콘 표시
import { User, Landmark, ShieldCheck } from 'lucide-react'

interface AuthorIconProps {
  isAdmin?: boolean | null
  isMasters?: boolean | null
  size?: number
}

export function AuthorIcon({ isAdmin, isMasters, size = 12 }: AuthorIconProps) {
  if (isAdmin) return <ShieldCheck size={size} className="shrink-0 text-amber-500" />
  if (isMasters) return <Landmark size={size} className="shrink-0 text-emerald-600" />
  return <User size={size} className="shrink-0 text-indigo-400" />
}
