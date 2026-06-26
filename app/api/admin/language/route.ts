import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { str, requireFields } from '@/lib/validate'

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const missing = requireFields(body, ['langId'])
  if (missing) return NextResponse.json({ error: `Missing: ${missing}` }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('variable_language')
    .update({
      langWordsId: str(body.langWordsId, 255),
      langWordsEn: str(body.langWordsEn, 255),
      langUpdateTime: new Date().toISOString(),
    })
    .eq('langId', Number(body.langId))

  if (error) {
    console.error('[language PUT]', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
