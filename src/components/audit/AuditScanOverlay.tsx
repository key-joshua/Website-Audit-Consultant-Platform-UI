import { ScanLine } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

interface AuditScanOverlayProps {
  open: boolean
  url: string
}

const SKELETON_WIDTHS = [
  100, 88, 94, 72, 90, 65, 96, 78, 84, 58, 92, 70, 86, 100, 74, 88, 62, 95, 80, 68, 91, 76, 83,
  55, 97, 71, 89, 64, 93, 79,
]

export function AuditScanOverlay({ open, url }: AuditScanOverlayProps) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-label="Scanning website"
    >
      <div className="w-3xl max-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        <div className="h-1 w-full brand-gradient" aria-hidden="true" />

        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg brand-gradient">
              <ScanLine className="h-5 w-5 text-white" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">Scanning website</p>
              <p className="truncate text-sm text-muted-foreground">{url}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400/80" />
              <div className="ml-1 h-5 min-w-0 flex-1 truncate rounded-md bg-surface px-2 text-[10px] leading-5 text-muted-foreground">
                {url}
              </div>
            </div>

            <div className="relative h-[60vh] overflow-hidden p-4">
              <div className="flex h-full w-full flex-col gap-3">
                {SKELETON_WIDTHS.map((width, index) => (
                  <div
                    key={index}
                    className={cn(
                      'audit-skeleton-line h-2.5 max-w-full shrink-0 origin-left rounded-full bg-border',
                    )}
                    style={{
                      width: `${width}%`,
                      animationDelay: `${index * 0.22}s`,
                    }}
                  />
                ))}
              </div>
              <div className="audit-scan-beam pointer-events-none absolute inset-x-4 top-4 h-10 brand-gradient opacity-25" />
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Analyzing pages line by line…
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
