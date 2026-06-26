import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import TeamClient from './TeamClient'

export default async function TeamPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { data } = await supabaseAdmin
    .from('our_team')
    .select('*')
    .order('oteaId', { ascending: true })

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      <TeamClient rows={data || []} />
    </AdminShell>
  )
}
