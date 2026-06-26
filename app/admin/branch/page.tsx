import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import BranchClient from './BranchClient'

export default async function BranchPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { data } = await supabaseAdmin
    .from('master_branch')
    .select('*')
    .order('mbraId', { ascending: true })

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      <BranchClient rows={data || []} />
    </AdminShell>
  )
}
