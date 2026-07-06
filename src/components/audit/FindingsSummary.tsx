import { AlertTriangle, CheckCircle2, Clock, FileText, Globe, Heading, Image, MousePointerClick, Star, XCircle, } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { VersionFindings } from '@/types'

interface FindingsSummaryProps {
  findings: VersionFindings
}

export function FindingsSummary({ findings }: FindingsSummaryProps) {
  const { summary } = findings

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Summary</h2>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <StatCard label="Website Pages" value={summary.totalWebsitePages} icon={Globe} />
        <StatCard label="Pages Checked" value={summary.totalPagesChecked} icon={FileText} />
        <StatCard
          label="Successful Pages"
          value={summary.successfulPagesChecked}
          icon={CheckCircle2}
        />
        <StatCard
          label="Failed Pages"
          value={summary.failedPagesChecked}
          icon={XCircle}
          variant={summary.failedPagesChecked > 0 ? 'danger' : 'default'}
        />
        <StatCard
          label="Missing Titles"
          value={summary.pagesMissingTitles}
          icon={FileText}
          variant={summary.pagesMissingTitles > 0 ? 'warning' : 'default'}
        />
        <StatCard
          label="Missing Meta Desc"
          value={summary.pagesMissingMetaDesc}
          icon={AlertTriangle}
          variant={summary.pagesMissingMetaDesc > 0 ? 'warning' : 'default'}
        />
        <StatCard
          label="Images Missing Alt"
          value={summary.totalImagesMissingAltText}
          icon={Image}
          variant={summary.totalImagesMissingAltText > 0 ? 'danger' : 'default'}
        />
        <StatCard
          label="Missing H1"
          value={summary.pagesMissingHeadings.h1}
          icon={Heading}
          variant={summary.pagesMissingHeadings.h1 > 0 ? 'warning' : 'default'}
        />
        <StatCard
          label="Missing H2"
          value={summary.pagesMissingHeadings.h2}
          icon={Heading}
          variant={summary.pagesMissingHeadings.h2 > 0 ? 'warning' : 'default'}
        />
        <StatCard label="Total CTAs" value={summary.totalCta} icon={MousePointerClick} />
        <StatCard label="Audit Score" value={summary.auditScore} icon={Star} />
        <StatCard label="Audit Duration (s)" value={summary.auditDurationSeconds} icon={Clock} />
      </div>
    </div>
  )
}
