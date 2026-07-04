import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SidebarToggle } from '@/components/layout/Sidebar'

interface TopbarProps {
  title: string
  onMenuOpen: () => void
}

export function Topbar({ title, onMenuOpen }: TopbarProps) {
  return (
    <header className="nav-chrome z-10 flex h-14 items-center justify-between border-b border-border px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <SidebarToggle onOpen={onMenuOpen} />
        <h1 className="text-sm font-medium uppercase text-foreground">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  )
}
