import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

const ALLOWED_EMAILS = ['masters@mareca.kr', 'admin@mareca.kr']

export default async function ReportLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !ALLOWED_EMAILS.includes(user.email)) redirect('/')

  return <>{children}</>
}
