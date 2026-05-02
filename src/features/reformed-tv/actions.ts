'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const BOARD = 'reformed-tv'
const BASE_PATH = '/community/reformed-tv'

export async function createReformedTVPost(formData: FormData) {
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
  redirect(`${BASE_PATH}/${data.id}`)
}

export async function updateReformedTVPost(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const youtube_url = (formData.get('youtube_url') as string) || null
  const content = (formData.get('description') as string) || null
  const category = formData.get('category') as string

  const { error } = await supabase
    .from('posts')
    .update({ title, content, youtube_url, category })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  revalidatePath(`${BASE_PATH}/${id}`)
  redirect(`${BASE_PATH}/${id}`)
}

export async function deleteReformedTVPost(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(BASE_PATH)
  redirect(BASE_PATH)
}

export async function incrementReformedTVViews(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_views', { post_id: id })
}
