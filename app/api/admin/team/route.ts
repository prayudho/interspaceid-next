import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { str, requireFields } from '@/lib/validate'

function parseBody(body: Record<string, unknown>) {
  return {
    oteaName:      str(body.oteaName, 50),
    oteaPosition:  str(body.oteaPosition, 100),
    oteaHistoryId: str(body.oteaHistoryId, 65535),
    oteaHistoryEn: str(body.oteaHistoryEn, 65535),
    oteaStatus:    Number(body.oteaStatus) === 1 ? 1 : 0,
    oteaFoto:      str(body.oteaFoto, 255),
    oteaAvatar:    str(body.oteaAvatar, 255),
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

  const missing = requireFields(body, ['oteaName', 'oteaPosition'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('our_team')
    .insert({ ...parseBody(body), oteaCreateBy: session.userId, oTeaCreateTime: new Date().toISOString() })
    .select()
    .single()

  if (error) { console.error('[team POST]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
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

  const missing = requireFields(body, ['oteaId', 'oteaName'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('our_team')
    .update({ ...parseBody(body), oteaUpdateBy: session.userId, oteaUpdateTime: new Date().toISOString() })
    .eq('oteaId', Number(body.oteaId))

  if (error) { console.error('[team PUT]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  try { await requireAdminSession() } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('our_team').delete().eq('oteaId', id)
  if (error) { console.error('[team DELETE]', error); return NextResponse.json({ error: 'Delete failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}
