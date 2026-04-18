import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { GalleryForm } from '@/features/gallery/GalleryForm'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '갤러리 수정' }

export default async function GalleryEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('id, user_id, title, content')
    .eq('id', id)
    .eq('board', 'gallery')
    .single()

  if (!post) notFound()
  if (post.user_id !== user.id) redirect(`/community/gallery/${id}`)

  const { data: images } = await supabase
    .from('post_images')
    .select('url')
    .eq('post_id', id)
    .order('display_order', { ascending: true })

  const imageUrls = (images ?? []).map((img) => img.url)

  return (
    <>
      <PageHeader
        title="갤러리 수정"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '갤러리', href: '/community/gallery' },
          { label: '수정' },
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryForm
          mode="edit"
          postId={id}
          initialTitle={post.title}
          initialDescription={post.content ?? ''}
          initialImages={imageUrls}
        />
      </div>
    </>
  )
}
