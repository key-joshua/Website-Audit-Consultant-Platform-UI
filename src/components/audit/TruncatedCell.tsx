import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CellDetailModal } from '@/components/ui/CellDetailModal'
import { cn } from '@/utils/cn'

interface TruncatedCellProps {
  label: string
  content: string
  className?: string
  modalContent?: ReactNode
}

export function TruncatedCell({
  label,
  content,
  className,
  modalContent,
}: TruncatedCellProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    const checkTruncation = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight + 1)
    }

    checkTruncation()

    const observer = new ResizeObserver(checkTruncation)
    observer.observe(element)

    return () => observer.disconnect()
  }, [content])

  return (
    <>
      <p ref={textRef} className={cn('line-clamp-2 break-words', className)}>
        {content}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 text-xs font-medium text-brand-end cursor-pointer hover:underline"
        >
          View all
        </button>
      )}
      <CellDetailModal open={open} onClose={() => setOpen(false)} title={label}>
        {modalContent ?? content}
      </CellDetailModal>
    </>
  )
}
