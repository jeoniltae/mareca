'use server'
// 리폼드북스 게시판 Server Actions (createBook, updateBook)

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getIsAdmin } from '@/lib/admin'
import { compressImage, isImageFile } from '@/lib/compress-image'
import type { Json } from '@/types/supabase'

export type BookSections = {
  book_info: {
    author: string
    subtitle: string
    publisher: string
    pub_date: string
    pages: string
    isbn: string
    price: string
  }
  book_intro: string
  recommendation: string
  table_of_contents: string
  body_preview: string
  author_intro: string
  translator_intro: string
  purchase_url: string
}

export async function createBook(formData: FormData): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin = await getIsAdmin()
  if (!isAdmin) throw new Error('관리자만 등록할 수 있습니다.')

  const title = formData.get('title') as string
  if (!title?.trim()) throw new Error('책 제목을 입력해 주세요.')

  const author = (formData.get('author') as string) || ''
  if (!author?.trim()) throw new Error('저자를 입력해 주세요.')

  // 책 표지 이미지 처리
  let thumbnail_url: string | null = (formData.get('thumbnail_url') as string) || null
  const coverFile = formData.get('cover_file') as File | null
  if (coverFile && coverFile.size > 0) {
    let uploadData: Buffer | File = coverFile
    let ext = coverFile.name.split('.').pop() ?? 'jpg'
    let contentType = coverFile.type

    if (isImageFile(coverFile)) {
      const compressed = await compressImage(coverFile)
      uploadData = compressed.buffer
      ext = compressed.ext
      contentType = compressed.contentType
    }

    const path = `${user.id}/${Date.now()}_cover.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, uploadData, { contentType })
    if (uploadError) throw new Error(uploadError.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(path)
    thumbnail_url = publicUrl
  }

  const sections: BookSections = {
    book_info: {
      author,
      subtitle: (formData.get('subtitle') as string) || '',
      publisher: (formData.get('publisher') as string) || '',
      pub_date: (formData.get('pub_date') as string) || '',
      pages: (formData.get('pages') as string) || '',
      isbn: (formData.get('isbn') as string) || '',
      price: (formData.get('price') as string) || '',
    },
    book_intro: (formData.get('book_intro') as string) || '',
    recommendation: (formData.get('recommendation') as string) || '',
    table_of_contents: (formData.get('table_of_contents') as string) || '',
    body_preview: (formData.get('body_preview') as string) || '',
    author_intro: (formData.get('author_intro') as string) || '',
    translator_intro: (formData.get('translator_intro') as string) || '',
    purchase_url: (formData.get('purchase_url') as string) || '',
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      board: 'reformed-books',
      category: '도서',
      title: title.trim(),
      content: null,
      thumbnail_url,
      sections: sections as unknown as Json,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/news/books')
  return data.id
}

export async function updateBook(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin = await getIsAdmin()
  if (!isAdmin) throw new Error('관리자만 수정할 수 있습니다.')

  const title = formData.get('title') as string
  if (!title?.trim()) throw new Error('책 제목을 입력해 주세요.')

  // 수정 전 기존 thumbnail_url 조회 (교체 시 Storage 정리 목적)
  const { data: existing } = await supabase
    .from('posts')
    .select('thumbnail_url')
    .eq('id', id)
    .single()
  const oldThumbnailUrl = existing?.thumbnail_url ?? null

  // 책 표지 이미지 처리
  let thumbnail_url: string | null = (formData.get('thumbnail_url') as string) || null
  const coverFile = formData.get('cover_file') as File | null
  if (coverFile && coverFile.size > 0) {
    let uploadData: Buffer | File = coverFile
    let ext = coverFile.name.split('.').pop() ?? 'jpg'
    let contentType = coverFile.type

    if (isImageFile(coverFile)) {
      const compressed = await compressImage(coverFile)
      uploadData = compressed.buffer
      ext = compressed.ext
      contentType = compressed.contentType
    }

    const path = `${user.id}/${Date.now()}_cover.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, uploadData, { contentType })
    if (uploadError) throw new Error(uploadError.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(path)
    thumbnail_url = publicUrl
  }

  // 표지 이미지가 교체된 경우 구 Storage 파일 삭제
  if (oldThumbnailUrl && oldThumbnailUrl !== thumbnail_url) {
    const oldPath = extractStoragePath(oldThumbnailUrl)
    if (oldPath) await supabase.storage.from('post-images').remove([oldPath])
  }

  const sections: BookSections = {
    book_info: {
      author: (formData.get('author') as string) || '',
      subtitle: (formData.get('subtitle') as string) || '',
      publisher: (formData.get('publisher') as string) || '',
      pub_date: (formData.get('pub_date') as string) || '',
      pages: (formData.get('pages') as string) || '',
      isbn: (formData.get('isbn') as string) || '',
      price: (formData.get('price') as string) || '',
    },
    book_intro: (formData.get('book_intro') as string) || '',
    recommendation: (formData.get('recommendation') as string) || '',
    table_of_contents: (formData.get('table_of_contents') as string) || '',
    body_preview: (formData.get('body_preview') as string) || '',
    author_intro: (formData.get('author_intro') as string) || '',
    translator_intro: (formData.get('translator_intro') as string) || '',
    purchase_url: (formData.get('purchase_url') as string) || '',
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title: title.trim(),
      thumbnail_url,
      sections: sections as unknown as Json,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/news/books')
  revalidatePath(`/news/books/${id}`)
}

/** Supabase post-images 버킷 public URL에서 Storage 경로를 추출합니다. */
function extractStoragePath(url: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null
  const prefix = `${supabaseUrl}/storage/v1/object/public/post-images/`
  if (!url.startsWith(prefix)) return null
  return decodeURIComponent(url.slice(prefix.length))
}
