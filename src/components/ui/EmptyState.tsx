import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  className?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, className, action }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center',
        className,
      )}
    >
      <Icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.75} />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
