import { AlertTriangle, Link2 } from 'lucide-react'
import { TruncatedCell } from '@/components/audit/TruncatedCell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import type { PageFinding } from '@/types'

interface FindingsTableProps {
  pages: PageFinding[]
}

function MissingCell({ value, label }: { value: string | null; label: string }) {
  if (value) {
    return <TruncatedCell label={label} content={value} />
  }

  return (
    <span className="inline-flex items-center gap-1">
      <AlertTriangle className="h-4 w-4 shrink-0 text-status-warning" strokeWidth={2.5} />
      Missing {label}
    </span>
  )
}

function formatIssues(page: PageFinding): string {
  if (!page.issues.length) return '—'
  return page.issues
    .map((issue) => `${issue.issueType} (${issue.severity}): ${issue.message}`)
    .join('\n')
}

export function FindingsTable({ pages }: FindingsTableProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No page findings available for this version.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Page Findings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[7rem]">Page</TableHead>
            <TableHead className="min-w-[14rem] pr-6">URL</TableHead>
            <TableHead className="min-w-[4.5rem] pl-2 whitespace-nowrap">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead>Alt Issues</TableHead>
            <TableHead>H1</TableHead>
            <TableHead>H2</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>CTAs</TableHead>
            <TableHead>Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => {
            const hasH1 = page.headings.h1.length > 0
            const hasH2 = page.h2Count > 0
            const issuesText = formatIssues(page)
            const h2Text = hasH2 ? `${page.h2Count} — ${page.headings.h2.join(', ')}` : '—'
            const ctaText = page.ctaTexts.length > 0 ? page.ctaTexts.join(', ') : '—'

            return (
              <TableRow key={page.url}>
                <TableCell className="max-w-[120px]">
                  <TruncatedCell label="Page" content={page.pageName} />
                </TableCell>
                <TableCell className="max-w-[200px] pr-6">
                  <div className="flex items-start gap-1.5">
                    <Link2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-mid"
                      strokeWidth={2.5}
                    />
                    <TruncatedCell
                      label="URL"
                      content={page.url}
                      className="break-all"
                      modalContent={
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-mid hover:underline"
                        >
                          {page.url}
                        </a>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="min-w-[4.5rem] pl-2 whitespace-nowrap">
                  <span>{page.statusCode}</span>
                </TableCell>
                <TableCell className="max-w-[160px]">
                  <MissingCell value={page.title} label="Title" />
                </TableCell>
                <TableCell className="max-w-[160px]">
                  <MissingCell value={page.description} label="Meta Description" />
                </TableCell>
                <TableCell>
                  <span>{page.imagesMissingAltText}</span>
                </TableCell>
                <TableCell className="max-w-[140px]">
                  {hasH1 ? (
                    <TruncatedCell label="H1" content={page.headings.h1[0]} />
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle
                        className="h-3.5 w-3.5 shrink-0 text-status-warning"
                        strokeWidth={1.75}
                      />
                      Missing
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-[140px]">
                  {hasH2 ? (
                    <TruncatedCell label="H2" content={h2Text} />
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span>{page.internalImagesCount}</span>
                </TableCell>
                <TableCell className="max-w-[120px]">
                  <TruncatedCell
                    label="Links"
                    content={`${page.internalLinksCount} int / ${page.externalLinksCount} ext`}
                  />
                </TableCell>
                <TableCell className="max-w-[140px]">
                  {page.ctaTexts.length > 0 ? (
                    <TruncatedCell label="CTAs" content={ctaText} />
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {page.issues.length > 0 ? (
                    <TruncatedCell label="Issues" content={issuesText} />
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
