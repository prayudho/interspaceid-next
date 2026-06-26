import { supabaseAdmin } from './supabase'

export type Service = {
  oserId: number
  oserTitle: string
  oserSubTitleId: string
  oserSubTitleEn: string
  oserDescriptionId: string
  oserDescriptionEn: string
  oserUrl: string
  oserImage: string
  sub_title: string
  description: string
}

export type Team = {
  oteaId: number
  oteaName: string
  oteaPosition: string
  oteaHistoryId: string
  oteaHistoryEn: string
  oteaStatus: number
  oteaFoto: string
  oteaAvatar: string
  history: string
}

export type Branch = {
  mbraId: number
  mbraCode: string
  mbraName: string
  mbraAddress: string
  mbraPhone: string
  mbraPhone2: string
  mbraCountry: string
  mbraMail: string
}

export type GlobalSetting = {
  gsetAboutId: string
  gsetAboutEn: string
  gsetFb: string
  gsetTwitter: string
  gsetInstagram: string
  gsetYoutube: string
  gsetMetaTitleId: string
  gsetMetaTitleEn: string
  gsetMetaImage: string
  gsetMetaDescriptionId: string
  gsetMetaDescriptionEn: string
  about_us_content: string
  metaTitle: string
  metaDescription: string
}

export type LangVars = Record<string, string>

export type PageData = {
  lang: string
  services: Service[]
  teams: Team[]
  branches: Record<string, Branch[]>
  setting: GlobalSetting
  langVars: LangVars
}

export async function getGlobalSetting(lang: string): Promise<GlobalSetting> {
  const { data } = await supabaseAdmin
    .from('global_setting')
    .select('*')
    .single()
  if (!data) throw new Error('global_setting not found')
  const langKey = lang === 'en' ? 'En' : 'Id'
  return {
    ...data,
    about_us_content: data[`gsetAbout${langKey}`] || data.gsetAboutId || '',
    metaTitle: data[`gsetMetaTitle${langKey}`] || data.gsetMetaTitleId || '',
    metaDescription: data[`gsetMetaDescription${langKey}`] || data.gsetMetaDescriptionId || '',
  }
}

export async function getServices(lang: string): Promise<Service[]> {
  const { data } = await supabaseAdmin
    .from('our_service')
    .select('*')
    .order('oserId', { ascending: true })
  if (!data) return []
  const langKey = lang === 'en' ? 'En' : 'Id'
  return data.map((s) => ({
    ...s,
    sub_title: s[`oserSubTitle${langKey}`] || s.oserSubTitleId || '',
    description: s[`oserDescription${langKey}`] || s.oserDescriptionId || '',
  }))
}

export async function getTeams(lang: string): Promise<Team[]> {
  const { data } = await supabaseAdmin
    .from('our_team')
    .select('*')
    .eq('oteaStatus', 0)
    .order('oteaId', { ascending: true })
  if (!data) return []
  const langKey = lang === 'en' ? 'En' : 'Id'
  return data.map((t) => ({
    ...t,
    history: t[`oteaHistory${langKey}`] || t.oteaHistoryId || '',
  }))
}

export async function getBranches(): Promise<Record<string, Branch[]>> {
  const { data } = await supabaseAdmin
    .from('master_branch')
    .select('*')
    .order('mbraId', { ascending: true })
  if (!data) return {}
  return data.reduce<Record<string, Branch[]>>((acc, b) => {
    const code = b.mbraCode || 'ina'
    if (!acc[code]) acc[code] = []
    acc[code].push(b)
    return acc
  }, {})
}

export async function getLangVars(lang: string): Promise<LangVars> {
  const { data } = await supabaseAdmin
    .from('variable_language')
    .select('*')
  if (!data) return {}
  const langKey = lang === 'en' ? 'langWordsEn' : 'langWordsId'
  return data.reduce<LangVars>((acc, row) => {
    acc[row.langVariable] = row[langKey] || ''
    return acc
  }, {})
}

export async function getPageData(lang: string): Promise<PageData> {
  const [setting, services, teams, branches, langVars] = await Promise.all([
    getGlobalSetting(lang),
    getServices(lang),
    getTeams(lang),
    getBranches(),
    getLangVars(lang),
  ])
  return { lang, setting, services, teams, branches, langVars }
}

export async function getUserByEmail(email: string) {
  const { data } = await supabaseAdmin
    .from('user')
    .select('udafId, udafName, udafEmail, udafPassword, udafIsAdmin, udafImage')
    .eq('udafEmail', email)
    .single()
  return data
}
