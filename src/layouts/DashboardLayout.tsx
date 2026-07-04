import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

const pageTitles: Record<string, string> = {
  '/audit-website': 'Audit Website',
  '/audit-versions': 'Audit Versions',
}

const SIDEBAR_COLLAPSED_KEY = 'bliss-sidebar-collapsed'

function getInitialCollapsed(): boolean {
  return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/audit-versions/')) return 'Version Findings'
  return pageTitles[pathname] ?? 'Dashboard'
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)
  const { pathname } = useLocation()

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={getPageTitle(pathname)} onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
