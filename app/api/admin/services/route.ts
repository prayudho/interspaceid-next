import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { str, requireFields } from '@/lib/validate'

function parseBody(body: Record<string, unknown>) {
  return {
    oserTitle:          str(body.oserTitle, 60),
    oserSubTitleId:     str(body.oserSubTitleId, 60),
    oserSubTitleEn:     str(body.oserSubTitleEn, 60),
    oserDescriptionId:  str(body.oserDescriptionId, 65535),
    oserDescriptionEn:  str(body.oserDescriptionEn, 65535),
    oserUrl:            str(body.oserUrl, 50),
    oserImage:          str(body.oserImage, 255),
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

  const missing = requireFields(body, ['oserTitle'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('our_service')
    .insert({ ...parseBody(body), oserCreateBy: session.userId, oserCreateTime: new Date().toISOString() })
    .select()
    .single()

  if (error) { console.error('[services POST]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
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

  const missing = requireFields(body, ['oserId', 'oserTitle'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('our_service')
    .update({ ...parseBody(body), oserUpdateBy: session.userId, oserUpdateTime: new Date().toISOString() })
    .eq('oserId', Number(body.oserId))

  if (error) { console.error('[services PUT]', error); return NextResponse.json({ error: 'Save failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  try { await requireAdminSession() } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('our_service').delete().eq('oserId', id)
  if (error) { console.error('[services DELETE]', error); return NextResponse.json({ error: 'Delete failed' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}
