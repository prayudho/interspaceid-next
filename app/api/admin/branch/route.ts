import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { str, requireFields, stripTags } from '@/lib/validate'

function parseBody(body: Record<string, unknown>) {
  return {
    mbraCode:    str(body.mbraCode, 3).toLowerCase().replace(/[^a-z]/g, ''),
    mbraName:    stripTags(str(body.mbraName, 160)),
    mbraAddress: stripTags(str(body.mbraAddress, 1000)),
    mbraPhone:   stripTags(str(body.mbraPhone, 15)),
    mbraPhone2:  stripTags(str(body.mbraPhone2, 15)),
    mbraCountry: stripTags(str(body.mbraCountry, 15)),
    mbraMail:    str(body.mbraMail, 150).toLowerCase(),
  }
}

export async function POST(req: NextRequest) {
  let session
  try { session = await requireAdminSession() } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const missing = requireFields(body, ['mbraCode', 'mbraName'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('master_branch')
    .insert({ ...parseBody(body), mbraCreateBy: session.userId, mbraCreateTime: new Date().toISOString() })
    .select()
    .single()

  if (error) { console.error('[branch POST]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  let session
  try { session = await requireAdminSession() } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const missing = requireFields(body, ['mbraId', 'mbraCode', 'mbraName'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('master_branch')
    .update({ ...parseBody(body), mbraUpdateBy: session.userId, mbraUpdateTime: new Date().toISOString() })
    .eq('mbraId', Number(body.mbraId))

  if (error) { console.error('[branch PUT]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  try { await requireAdminSession() } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('master_branch').delete().eq('mbraId', id)
  if (error) { console.error('[branch DELETE]', error); return NextResponse.json({ error: 'Delete failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}
