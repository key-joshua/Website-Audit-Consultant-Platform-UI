import type { AuditStatus } from '@/types'

export function statusColor(status: AuditStatus): string {
  switch (status) {
    case 'completed':
      return 'badge-completed'
    case 'partial':
      return 'badge-partial'
    case 'failed':
      return 'badge-failed'
  }
}

export function statusLabel(status: AuditStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'partial':
      return 'Partial'
    case 'failed':
      return 'Failed'
  }
}
