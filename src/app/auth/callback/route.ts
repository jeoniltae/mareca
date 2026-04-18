import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const safeOrigin = origin.replace('//0.0.0.0', '//localhost')

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    const user = data.session?.user
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.nickname) {
        return NextResponse.redirect(`${safeOrigin}/login?setup=nickname`)
      }
    }
  }

  return NextResponse.redirect(`${safeOrigin}${next}`)
}
