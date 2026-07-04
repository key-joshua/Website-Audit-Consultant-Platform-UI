import { Globe, History, Menu, PanelLeft, PanelLeftClose, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import blissLogo from '@/assets/logo-bliss.png'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { to: '/audit-website', label: 'Audit Website', icon: Globe },
  { to: '/audit-versions', label: 'Audit Versions', icon: History },
]

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'nav-chrome fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border transition-all duration-300 lg:static lg:translate-x-0',
          collapsed ? 'w-52 lg:w-16' : 'w-52',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-3">
          {collapsed ? (
            <div className="hidden flex-1 items-center justify-center lg:flex">
              <div className="group/collapsed relative flex cursor-pointer items-center justify-center">
                <img
                  src={blissLogo}
                  alt="Bliss"
                  className="h-7 w-auto max-w-[2rem] cursor-pointer object-contain transition-opacity duration-200 group-hover/collapsed:opacity-0"
                />
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="pointer-events-none absolute  flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover/collapsed:pointer-events-auto group-hover/collapsed:opacity-100"
                  aria-label="Expand sidebar"
                >
                  <PanelLeft className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden min-w-0 flex-1 items-center justify-between gap-2 lg:flex">
              <img
                src={blissLogo}
                alt="Bliss"
                className="h-10 w-auto max-w-[9rem] shrink-0 cursor-pointer object-contain object-left"
              />
              <button
                type="button"
                onClick={onToggleCollapse}
                className="cursor-pointer rounded-md p-2 text-foreground transition-colors hover:bg-background hover:text-foreground"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          )}

          <img
            src={blissLogo}
            alt="Bliss"
            className="h-10 w-auto max-w-[9rem] shrink-0 object-contain object-left lg:hidden"
          />

          <button
            className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  collapsed && 'lg:justify-center lg:px-2',
                  isActive
                    ? 'brand-gradient text-white'
                    : 'text-foreground hover:bg-background hover:text-foreground',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span className={cn('text-sm font-medium', collapsed && 'lg:hidden')}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export function SidebarToggle({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="rounded-md p-2 text-foreground hover:bg-background lg:hidden"
      onClick={onOpen}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" strokeWidth={2} />
    </button>
  )
}
