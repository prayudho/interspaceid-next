import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { data } = await supabaseAdmin.from('global_setting').select('*').single()

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      <SettingsClient setting={data} />
    </AdminShell>
  )
}
