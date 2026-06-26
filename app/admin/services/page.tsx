import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import ServicesClient from './ServicesClient'

export default async function ServicesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { data } = await supabaseAdmin
    .from('our_service')
    .select('*')
    .order('oserId', { ascending: true })

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      <ServicesClient rows={data || []} />
    </AdminShell>
  )
}
