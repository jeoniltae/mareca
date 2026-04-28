'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { compressImage } from '@/lib/compress-image'

const BUCKET = 'post-images'

function getStoragePath(publicUrl: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null
  const prefix = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/`
  if (!publicUrl.startsWith(prefix)) return null
  return decodeURIComponent(publicUrl.slice(prefix.length))
}

// ─── 이미지 업로드 ──────────────────────────────────────────────────────────────
export async function uploadGalleryImage(formData: FormData): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다')

  const file = formData.get('file') as File
  if (!file) throw new Error('파일이 없습니다')

  const { buffer, contentType, ext } = await compressImage(file)
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType })
  if (uploadError) throw new Error(uploadError.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return publicUrl
}

// ─── 게시글 생성 ────────────────────────────────────────────────────────────────
export async function createGalleryPost(
  title: string,
  description: string,
  imageUrls: string[],
): Promise<never> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      board: 'gallery',
      category: '일반',
      title,
      content: description,
      thumbnail_url: imageUrls[0] ?? null,
    })
    .select('id')
    .single()

  if (postError || !post) throw new Error(postError?.message ?? '게시글 생성 실패')

  if (imageUrls.length > 0) {
    const { error: imgError } = await supabase.from('post_images').insert(
      imageUrls.map((url, i) => ({ post_id: post.id, url, display_order: i })),
    )
    if (imgError) throw new Error(imgError.message)
  }

  revalidatePath('/community/album')
  redirect(`/community/album/${post.id}`)
}

// ─── 게시글 수정 ────────────────────────────────────────────────────────────────
export async function updateGalleryPost(
  id: string,
  title: string,
  description: string,
  imageUrls: string[],
  deletedUrls: string[],
): Promise<never> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error: postError } = await supabase
    .from('posts')
    .update({
      title,
      content: description,
      thumbnail_url: imageUrls[0] ?? null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (postError) throw new Error(postError.message)

  // Storage에서 삭제된 이미지 제거
  if (deletedUrls.length > 0) {
    const storagePaths = deletedUrls.map(getStoragePath).filter(Boolean) as string[]
    if (storagePaths.length > 0) {
      await supabase.storage.from(BUCKET).remove(storagePaths)
    }
  }

  // post_images 전체 교체
  await supabase.from('post_images').delete().eq('post_id', id)
  if (imageUrls.length > 0) {
    await supabase.from('post_images').insert(
      imageUrls.map((url, i) => ({ post_id: id, url, display_order: i })),
    )
  }

  revalidatePath('/community/album')
  revalidatePath(`/community/album/${id}`)
  redirect(`/community/album/${id}`)
}

// ─── 조회수 증가 ────────────────────────────────────────────────────────────────
export async function incrementGalleryViews(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_views', { post_id: id })
}

// ─── 게시글 삭제 ────────────────────────────────────────────────────────────────
export async function deleteGalleryPost(id: string): Promise<never> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: images } = await supabase
    .from('post_images')
    .select('url')
    .eq('post_id', id)

  if (images && images.length > 0) {
    const storagePaths = images.map((img) => getStoragePath(img.url)).filter(Boolean) as string[]
    if (storagePaths.length > 0) {
      await supabase.storage.from(BUCKET).remove(storagePaths)
    }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/community/album')
  redirect('/community/album')
}
