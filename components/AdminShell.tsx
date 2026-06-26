'use client'

import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin/language', label: 'Word Library', icon: 'fa-language' },
  { href: '/admin/settings', label: 'Global Setting', icon: 'fa-cog' },
  { href: '/admin/services', label: 'Our Service', icon: 'fa-briefcase' },
  { href: '/admin/team', label: 'Our Team', icon: 'fa-users' },
  { href: '/admin/branch', label: 'Branch', icon: 'fa-building' },
]

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string }
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div id="wrapper" className="theme-1">
      {/* Top nav */}
      <nav className="navbar navbar-top navbar-light bg-light border-bottom py-0 d-block">
        <div className="pl-3 pt-2 float-right d-inline-block">
          <div className="btn-group dropdown float-right ml-4 d-inline-block">
            <div
              className="userAccount pointer d-inline-block"
              role="button"
              data-toggle="dropdown"
              title={user.name}
            >
              <span className="accountDefault rounded-circle">
                <i className="fa fa-user"></i>
              </span>
            </div>
            <div className="dropdown-menu mw-250 dropdown-menu-right text-secondary rounded shadow mt-1 px-3">
              <p className="font-half font-weight-bold mb-0">{user.name}</p>
              <p className="font-half mb-0">{user.email}</p>
              <div className="dropdown-divider mb-2"></div>
              <button
                className="btn btn-sm btn-outline-danger font-weight-bold font-mini"
                onClick={handleLogout}
              >
                <i className="fa fa-lock"></i> Logout
              </button>
            </div>
          </div>
        </div>
        <a href="/admin" className="navbar-brand font1 font-weight-bold imgCont text-uppercase d-inline-block">
          <img src="/Assets/img/default/ATA-logo.svg" alt="Interspace" />
        </a>
      </nav>

      {/* Sidebar */}
      <nav className="navbar-side collapse show flexcroll" id="sideMenu" role="navigation">
        <ul id="side" className="nav navbar-nav side-nav border-top in d-block">
          {NAV.map((item) => (
            <li key={item.href} className={pathname === item.href ? 'active' : ''}>
              <a href={item.href}>
                <i className={`fa ${item.icon} mr-2`}></i>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div id="page-wrapper" className="bg-gray pTop inActive relative">
        {children}
        <div className="clearfix"></div>
        <footer className="ftr text-dark">
          <div className="pull-right">v2.0</div>
          <div>&copy; {new Date().getFullYear()} – Interspace Indonesia</div>
        </footer>
      </div>
    </div>
  )
}
