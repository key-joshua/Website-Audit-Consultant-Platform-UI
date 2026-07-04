import { FileText, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'

interface CellDetailModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function CellDetailModal({ open, onClose, title, children }: CellDetailModalProps) {
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cell-detail-title"
      onClick={onClose}
    >
      <div
        className="w-xl max-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full brand-gradient" aria-hidden="true" />

        <div className="flex items-start gap-3 border-b border-border p-6 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg brand-gradient">
            <FileText className="h-5 w-5 text-white" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p id="cell-detail-title" className="font-semibold text-foreground">
              {title}
            </p>
            <p className="text-xs text-muted-foreground">Full finding details</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg border border-border cursor-pointer bg-background hover:bg-surface"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 text-sm leading-relaxed whitespace-pre-wrap break-words text-muted-foreground">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
