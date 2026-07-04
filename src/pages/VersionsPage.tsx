import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { AlertTriangle, History } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuditVersions } from '@/hooks/useAuditVersions'
import { VersionCard } from '@/components/audit/VersionCard'


export function VersionsPage() {
  const { data, isLoading, error, refetch } = useAuditVersions()

  if (isLoading) {
    return <Spinner label="Loading audit versions…" />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Failed to load versions"
        description={error}
        action={
          <Button variant="outline" onClick={refetch}>
            Try again
          </Button>
        }
      />
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No audit versions yet"
        description="Run your first website audit to see results here."
        action={
          <Button asChild>
            <Link to="/audit-website">Audit a Website</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Audit History</h2>
        <p className="text-sm text-muted-foreground">
          {data.length} audit run{data.length !== 1 ? 's' : ''} — click a version to view findings.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.map((version) => (
          <VersionCard key={version.id} version={version} />
        ))}
      </div>
    </div>
  )
}
