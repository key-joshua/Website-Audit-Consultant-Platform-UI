import { AlertTriangle, ArrowLeft, Clock, Globe, Link2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { FindingsSummary } from '@/components/audit/FindingsSummary'
import { FindingsTable } from '@/components/audit/FindingsTable'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useVersionFindings } from '@/hooks/useVersionFindings'
import { formatDate } from '@/utils/formatDate'
import { statusColor, statusLabel } from '@/utils/statusColor'

export function VersionFindingsPage() {
  const { versionId = '' } = useParams<{ versionId: string }>()
  const { data, isLoading, error, refetch } = useVersionFindings(versionId)

  if (isLoading) {
    return <Spinner label="Loading findings…" />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Failed to load findings"
        description={error}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/audit-versions">Back to versions</Link>
            </Button>
          </div>
        }
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Version not found"
        description={`No findings exist for version "${versionId}".`}
        action={
          <Button variant="outline" asChild>
            <Link to="/audit-versions">Back to versions</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Button size="sm" className="shrink-0 self-start" asChild>
          <Link to="/audit-versions" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4 text-white" strokeWidth={1.75} />
            All Versions
          </Link>
        </Button>

        <div className="min-w-0 space-y-1 sm:text-right">
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <h2 className="text-2xl font-semibold text-foreground">{data.label}</h2>
            <span
              className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor(data.status)}`}
            >
              {statusLabel(data.status)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-end">
            <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-brand-end" strokeWidth={2.5} />
              <span className="truncate">{data.url}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 shrink-0 text-brand-end" strokeWidth={2.5} />
              <span>{data.domain}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-brand-end" strokeWidth={2.5} />
              <span>{formatDate(data.scrapedAt)}</span>
            </span>
          </div>
        </div>
      </div>

      <FindingsSummary findings={data} />
      <FindingsTable pages={data.pages} />
    </div>
  )
}
