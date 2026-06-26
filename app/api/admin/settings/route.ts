import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { str } from '@/lib/validate'

export async function PUT(req: NextRequest) {
  let session
  try {
    session = await requireAdminSession()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    return NextResponse.json({ error: 'Unauthorized' }, { status: msg === 'FORBIDDEN' ? 403 : 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const { error } = await supabaseAdmin
    .from('global_setting')
    .update({
      gsetAboutId:             str(body.gsetAboutId, 65535),
      gsetAboutEn:             str(body.gsetAboutEn, 65535),
      gsetFb:                  str(body.gsetFb, 150),
      gsetTwitter:             str(body.gsetTwitter, 150),
      gsetInstagram:           str(body.gsetInstagram, 150),
      gsetYoutube:             str(body.gsetYoutube, 150),
      gsetMetaTitleId:         str(body.gsetMetaTitleId, 60),
      gsetMetaTitleEn:         str(body.gsetMetaTitleEn, 60),
      gsetMetaDescriptionId:   str(body.gsetMetaDescriptionId, 160),
      gsetMetaDescriptionEn:   str(body.gsetMetaDescriptionEn, 160),
      gsetUpdateBy:            session.userId,
      gsetUpdateTime:          new Date().toISOString(),
    })
    .eq('gsetId', Number(body.gsetId))

  if (error) {
    console.error('[settings PUT]', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
