// 관리자 여부를 확인하는 서버 전용 유틸리티
import { createClient } from '@/lib/supabase-server'

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
