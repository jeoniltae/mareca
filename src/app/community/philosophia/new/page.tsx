// 최더함의 철학시가 등록 페이지 — 로그인 필수

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PhilosophiaForm } from '@/features/philosophia/PhilosophiaForm'

const BASE_PATH = '/community/philosophia'

export const metadata = { title: '영상 등록 — 최더함의 철학시가' }

export default async function NewPhilosophiaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${BASE_PATH}/new`)

  return (
    <>
      {/* 폼은 라이트 톤이지만 헤더 색으로 코너 정체성을 잇는다 */}
      <PageHeader
        title="영상 등록"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '최더함의 철학시가', href: BASE_PATH },
          { label: '영상 등록' },
        ]}
        bgColor="bg-[#182B4E]"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhilosophiaForm mode="create" cancelHref={BASE_PATH} />
      </div>
    </>
  )
}
