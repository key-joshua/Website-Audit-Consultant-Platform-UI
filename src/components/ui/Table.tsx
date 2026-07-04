import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg bg-surface shadow-sm',
        className,
      )}
    >
      <table className="min-w-[1500px] text-sm">{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-border bg-surface [&_tr]:hover:bg-surface">{children}</thead>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border bg-surface">{children}</tbody>
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr className={cn('bg-surface transition-colors hover:bg-background/50', className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'p-4 text-left text-sm font-semibold text-foreground',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('bg-surface p-4 text-foreground text-sm text-muted-foreground', className)}>{children}</td>
}
