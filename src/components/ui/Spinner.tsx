import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 min-h-[calc(100vh-10rem)]', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-mid" strokeWidth={1.75} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
