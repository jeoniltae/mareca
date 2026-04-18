'use server'

import { createClient } from '@/lib/supabase-server'

export async function checkNeedsNickname(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle()

  return !profile?.nickname
}

export async function saveNickname(nickname: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, nickname: nickname.trim() })

  if (error) throw new Error(error.message)
}
