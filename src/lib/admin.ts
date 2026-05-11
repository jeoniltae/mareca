// 관리자 여부를 확인하는 서버 전용 유틸리티
import { createClient } from '@/lib/supabase-server'

const MASTERS_EMAIL = 'masters@mareca.kr'

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const result = (await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()) as unknown as { data: { is_admin: boolean | null } | null }
  return result.data?.is_admin === true
}

// 공지 카테고리 지정 권한 — 관리자 또는 masters 계정
export async function getCanPin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  if (user.email === MASTERS_EMAIL) return true
  const result = (await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()) as unknown as { data: { is_admin: boolean | null } | null }
  return result.data?.is_admin === true
}
