import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  variant?: 'default' | 'warning' | 'danger'
  className?: string
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg  bg-surface p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full brand-gradient">
            <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="shrink-0 text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
