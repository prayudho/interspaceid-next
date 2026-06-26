import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin – Interspace Indonesia' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/Assets/plugins_admin/admin_main_style.css" />
      <Script src="/Assets/plugins_admin/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins_admin/popper.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins_admin/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins_admin/admin_main_script.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins_admin/lobibox.min.js" strategy="afterInteractive" />
      {children}
    </>
  )
}
