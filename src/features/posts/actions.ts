'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── 게시글 생성 ────────────────────────────────────────────────────────────────
export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = (formData.get('category') as string) || '일반'
  const youtube_url = (formData.get('youtube_url') as string) || null

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, board: 'free', category, title, content, youtube_url })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/community/free')
  redirect(`/community/free/${data.id}`)
}

// ─── 게시글 수정 ────────────────────────────────────────────────────────────────
export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = (formData.get('category') as string) || '일반'
  const youtube_url = (formData.get('youtube_url') as string) || null

  const { error } = await supabase
    .from('posts')
    .update({ category, title, content, youtube_url })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/community/free')
  revalidatePath(`/community/free/${id}`)
  redirect(`/community/free/${id}`)
}

// ─── 게시글 삭제 ────────────────────────────────────────────────────────────────
export async function deletePost(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 삭제 전 본문에서 Storage 이미지 경로 추출
  const { data: post } = await supabase
    .from('posts')
    .select('content')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (post?.content) {
    const imagePaths = extractStorageImagePaths(post.content)
    if (imagePaths.length > 0) {
      await supabase.storage.from('post-images').remove(imagePaths)
    }
  }

  // 첨부 이미지 Storage 삭제
  const { data: postImages } = await supabase
    .from('post_images')
    .select('url')
    .eq('post_id', id)

  if (postImages && postImages.length > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/post-images/`
    const paths = postImages
      .map((img) => img.url)
      .filter((url) => url.startsWith(bucketPrefix))
      .map((url) => decodeURIComponent(url.slice(bucketPrefix.length)))
    if (paths.length > 0) await supabase.storage.from('post-images').remove(paths)
  }

  // 첨부 파일 Storage 삭제
  const { data: attachments } = await supabase
    .from('post_attachments')
    .select('file_url')
    .eq('post_id', id)

  if (attachments && attachments.length > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/post-attachments/`
    const paths = attachments
      .map((a) => a.file_url)
      .filter((url) => url.startsWith(bucketPrefix))
      .map((url) => decodeURIComponent(url.slice(bucketPrefix.length)))
    if (paths.length > 0) await supabase.storage.from('post-attachments').remove(paths)
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/community/free')
  redirect('/community/free')
}

/** 본문 HTML에서 post-images 버킷 경로 목록을 추출합니다. */
function extractStorageImagePaths(content: string): string[] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return []

  const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/post-images/`
  const imgRegex = /<img[^>]+src="([^"]+)"/g
  const paths: string[] = []
  let match

  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1]
    if (src.startsWith(bucketPrefix)) {
      paths.push(decodeURIComponent(src.slice(bucketPrefix.length)))
    }
  }

  return paths
}

// ─── 첨부 이미지 저장 ───────────────────────────────────────────────────────────
export async function savePostImages(postId: string, imageFiles: File[]): Promise<void> {
  if (imageFiles.length === 0) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다')

  const rows: { post_id: string; url: string; display_order: number }[] = []

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}_${i}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, file)

    if (uploadError) throw new Error(uploadError.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(path)

    rows.push({ post_id: postId, url: publicUrl, display_order: i })
  }

  const { error } = await supabase.from('post_images').insert(rows)
  if (error) throw new Error(error.message)
}

// ─── 첨부 파일 저장 ─────────────────────────────────────────────────────────────
export async function savePostAttachments(
  postId: string,
  attachmentFiles: File[],
): Promise<void> {
  if (attachmentFiles.length === 0) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다')

  const rows: {
    post_id: string
    file_name: string
    file_url: string
    file_size: number
    mime_type: string
  }[] = []

  for (const file of attachmentFiles) {
    const path = `${user.id}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('post-attachments')
      .upload(path, file)

    if (uploadError) throw new Error(uploadError.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-attachments').getPublicUrl(path)

    rows.push({
      post_id: postId,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
    })
  }

  const { error } = await supabase.from('post_attachments').insert(rows)
  if (error) throw new Error(error.message)
}

// ─── 파일 첨부 업로드 ───────────────────────────────────────────────────────────
export async function uploadAttachment(file: File): Promise<{
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다')

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('post-attachments')
    .upload(path, file)

  if (uploadError) throw new Error(uploadError.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from('post-attachments').getPublicUrl(path)

  return {
    file_name: file.name,
    file_url: publicUrl,
    file_size: file.size,
    mime_type: file.type || `application/octet-stream`,
  }
}

// ─── 첨부 이미지 단건 삭제 ──────────────────────────────────────────────────────
export async function deletePostImage(id: string): Promise<void> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('post_images')
    .select('url')
    .eq('id', id)
    .single()

  if (data?.url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/post-images/`
    if (data.url.startsWith(bucketPrefix)) {
      const path = decodeURIComponent(data.url.slice(bucketPrefix.length))
      await supabase.storage.from('post-images').remove([path])
    }
  }

  await supabase.from('post_images').delete().eq('id', id)
}

// ─── 첨부 파일 단건 삭제 ────────────────────────────────────────────────────────
export async function deletePostAttachment(id: string): Promise<void> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('post_attachments')
    .select('file_url')
    .eq('id', id)
    .single()

  if (data?.file_url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/post-attachments/`
    if (data.file_url.startsWith(bucketPrefix)) {
      const path = decodeURIComponent(data.file_url.slice(bucketPrefix.length))
      await supabase.storage.from('post-attachments').remove([path])
    }
  }

  await supabase.from('post_attachments').delete().eq('id', id)
}

// ─── 조회수 증가 ────────────────────────────────────────────────────────────────
export async function incrementViews(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_views', { post_id: id })
}

// ─── 이미지 업로드 ──────────────────────────────────────────────────────────────
export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('로그인이 필요합니다')

  const file = formData.get('file') as File
  if (!file) throw new Error('파일이 없습니다')

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(path, file)

  if (uploadError) throw new Error(uploadError.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from('post-images').getPublicUrl(path)

  return publicUrl
}
