import { headers } from 'next/headers'
import { getPageData } from '@/lib/queries'
import type { Metadata } from 'next'
import DesktopHome from '@/components/DesktopHome'
import MobileHome from '@/components/MobileHome'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageData('en')
  return {
    title: data.setting.metaTitle,
    description: data.setting.metaDescription,
    openGraph: {
      title: data.setting.metaTitle,
      description: data.setting.metaDescription,
      url: 'https://interspace.co.id/en',
      siteName: 'Interspace Indonesia',
      images: [`/Assets/img/${data.setting.gsetMetaImage}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.setting.metaTitle,
      description: data.setting.metaDescription,
      images: [`/Assets/img/${data.setting.gsetMetaImage}`],
    },
    alternates: {
      languages: { id: '/', en: '/en' },
    },
  }
}

export default async function EnPage() {
  const data = await getPageData('en')
  const headersList = await headers()
  const ua = headersList.get('user-agent') || ''
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  return isMobile ? <MobileHome data={data} /> : <DesktopHome data={data} />
}
