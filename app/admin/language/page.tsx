import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import LanguageClient from './LanguageClient'

export default async function LanguagePage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { data } = await supabaseAdmin
    .from('variable_language')
    .select('*')
    .order('langId', { ascending: true })

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      <LanguageClient rows={data || []} />
    </AdminShell>
  )
}
