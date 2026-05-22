'use server'
// 마스터스 오픈강좌 게시판 Server Actions

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIsAdmin } from '@/lib/admin'

const BOARD = 'open-lecture'
const BASE_PATH = '/community/open-lecture'

export async function createOpenLecture(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const category = formData.get('category') as string
  const isAdmin = await getIsAdmin()

  if (category === '공지' && !isAdmin) {
    throw new Error('공지 카테고리는 관리자만 사용할 수 있습니다.')
  }

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const event_date = formData.get('event_date') as string
  const event_time = formData.get('event_time') as string
  const content = (formData.get('content') as string) || null
  const youtube_url = (formData.get('youtube_url') as string) || null
  const article_url = (formData.get('article_url') as string) || null

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      board: BOARD,
      category,
      title,
      content,
      youtube_url,
      location,
      event_date: event_date || null,
      event_time: event_time || null,
      article_url,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  redirect(`${BASE_PATH}/${data.id}`)
}

export async function updateOpenLecture(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const category = formData.get('category') as string
  const isAdmin = await getIsAdmin()

  if (category === '공지' && !isAdmin) {
    throw new Error('공지 카테고리는 관리자만 사용할 수 있습니다.')
  }

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const event_date = formData.get('event_date') as string
  const event_time = formData.get('event_time') as string
  const content = (formData.get('content') as string) || null
  const youtube_url = (formData.get('youtube_url') as string) || null
  const article_url = (formData.get('article_url') as string) || null

  const updateQuery = supabase
    .from('posts')
    .update({
      category,
      title,
      content,
      youtube_url,
      location,
      event_date: event_date || null,
      event_time: event_time || null,
      article_url,
    })
    .eq('id', id)

  if (isAdmin) {
    const { error } = await updateQuery
    if (error) throw new Error(error.message)
  } else {
    const { error } = await updateQuery.eq('user_id', user.id)
    if (error) throw new Error(error.message)
  }

  revalidatePath(BASE_PATH)
  revalidatePath(`${BASE_PATH}/${id}`)
  redirect(`${BASE_PATH}/${id}`)
}

export async function deleteOpenLecture(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin = await getIsAdmin()
  const deleteQuery = supabase.from('posts').delete().eq('id', id)

  if (isAdmin) {
    const { error } = await deleteQuery
    if (error) throw new Error(error.message)
  } else {
    const { error } = await deleteQuery.eq('user_id', user.id)
    if (error) throw new Error(error.message)
  }

  revalidatePath(BASE_PATH)
  redirect(BASE_PATH)
}

export async function incrementOpenLectureViews(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_views', { post_id: id })
}
