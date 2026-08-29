'use server'
// 최더함의 철학시가 게시글 생성·수정·삭제 Server Action — 조회수 증가는 features/posts의 incrementViews가 담당한다

import { createClient } from '@/lib/supabase-server'
import { getIsAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const BOARD = 'philosophia'
const BASE_PATH = '/community/philosophia'

export async function createPhilosophiaPost(formData: FormData): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const youtube_url = (formData.get('youtube_url') as string) || null
  const content = (formData.get('description') as string) || null
  const category = formData.get('category') as string

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, board: BOARD, category, title, content, youtube_url })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  return data.id
}

export async function updatePhilosophiaPost(id: string, formData: FormData): Promise<string> {
  const supabase = await createClient()
  const [{ data: { user } }, isAdmin] = await Promise.all([
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const youtube_url = (formData.get('youtube_url') as string) || null
  const content = (formData.get('description') as string) || null
  const category = formData.get('category') as string

  let query = supabase
    .from('posts')
    .update({ title, content, youtube_url, category })
    .eq('id', id)

  // 관리자는 모든 게시글, 일반 사용자는 본인 게시글만
  if (!isAdmin) query = query.eq('user_id', user.id)

  const { error } = await query

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  return id
}

export async function deletePhilosophiaPost(id: string) {
  const supabase = await createClient()
  const [{ data: { user } }, isAdmin] = await Promise.all([
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!user) redirect('/login')

  let query = supabase.from('posts').delete().eq('id', id)

  if (!isAdmin) query = query.eq('user_id', user.id)

  const { error } = await query

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  redirect(BASE_PATH)
}
