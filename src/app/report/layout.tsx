import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

const MASTERS_EMAIL = 'masters@mareca.kr'

export default async function ReportLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.email !== MASTERS_EMAIL) redirect('/')

  return <>{children}</>
}
