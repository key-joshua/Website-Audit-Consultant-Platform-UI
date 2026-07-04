import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Image,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import type { AuditVersion } from '@/types'
import { formatDate } from '@/utils/formatDate'
import { statusColor, statusLabel } from '@/utils/statusColor'

interface VersionCardProps {
  version: AuditVersion
}

export function VersionCard({ version }: VersionCardProps) {
  const StatusIcon =
    version.status === 'completed'
      ? CheckCircle2
      : version.status === 'failed'
        ? XCircle
        : AlertTriangle

  const issueCount =
    version.pagesMissingTitles +
    version.pagesMissingMetaDesc +
    version.totalImagesMissingAltText +
    version.pagesMissingHeadings.h1 +
    version.pagesMissingHeadings.h2 +
    version.pagesMissingHeadings.h3

  return (
    <Link to={`/audit-versions/${version.id}`} className="group block">
      <Card className="border-2 border-transparent shadow-sm transition-all duration-200 hover:border-brand-mid hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{version.label}</span>
                <Badge className={statusColor(version.status)}>
                  <StatusIcon className="mr-1 h-3 w-3" strokeWidth={1.75} />
                  {statusLabel(version.status)}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">{version.url}</p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full brand-gradient transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {formatDate(version.scrapedAt)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-xs">
                <span className="font-medium text-foreground">{version.totalPagesChecked}</span>{' '}
                pages
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-xs">
                <span className="font-medium text-foreground">
                  {version.totalImagesMissingAltText}
                </span>{' '}
                alt issues
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
              <span className="text-xs">
                <span className="font-medium text-amber-400">{issueCount}</span> issues
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
