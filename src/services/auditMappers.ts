import type {
  AuditStatus,
  AuditVersion,
  PageFinding,
  PageIssue,
  VersionFindings,
} from '@/types'

export interface ApiAuditPageIssue {
  issue_type: string
  severity: string
  message: string
}

export interface ApiAuditPage {
  page: string
  page_url: string
  status_code: string
  title: string
  meta_desc: string
  h1_count: string
  h2_count: string
  cta_count: string
  internal_links_count: string
  external_links_count: string
  images_count: string
  images_missing_alt_count: string
  AuditPageIssues?: ApiAuditPageIssue[]
}

export interface ApiAuditReport {
  total_website_pages: string
  total_audited_pages: string
  successful_audited_pages: string
  failed_audited_pages: string
  pages_missing_title: string
  pages_missing_meta_desc: string
  pages_missing_h1: string
  pages_missing_h2: string
  total_images_missing_alt: string
  total_cta: string
  audit_score: string
  audit_duration_seconds: string
}

export interface ApiAudit {
  id: string
  version: string
  status: string
  created_at: string
  AuditPages: ApiAuditPage[]
  AuditReports: ApiAuditReport | null
}

export interface ApiWebsite {
  id: string
  url: string
  domain: string
  website_urls?: string[]
  Audits: ApiAudit[]
}

export interface ApiEnvelope<T> {
  status: number
  success: boolean
  message: string
  data: T
}

function toNum(value: string): number {
  return Number(value) || 0
}

function hasFlag(value: string): boolean {
  return value === '1'
}

export function mapStatus(status: string): AuditStatus {
  if (status === 'COMPLETED') return 'completed'
  if (status === 'FAILED') return 'failed'
  return 'partial'
}

function mapReportToSummary(report: ApiAuditReport | null): VersionFindings['summary'] {
  if (!report) {
    return {
      totalWebsitePages: 0,
      totalPagesChecked: 0,
      successfulPagesChecked: 0,
      failedPagesChecked: 0,
      pagesMissingTitles: 0,
      pagesMissingMetaDesc: 0,
      totalImagesMissingAltText: 0,
      pagesMissingHeadings: { h1: 0, h2: 0, h3: 0 },
      totalCta: 0,
      auditScore: 0,
      auditDurationSeconds: 0,
    }
  }

  return {
    totalWebsitePages: toNum(report.total_website_pages),
    totalPagesChecked: toNum(report.total_audited_pages),
    successfulPagesChecked: toNum(report.successful_audited_pages),
    failedPagesChecked: toNum(report.failed_audited_pages),
    pagesMissingTitles: toNum(report.pages_missing_title),
    pagesMissingMetaDesc: toNum(report.pages_missing_meta_desc),
    totalImagesMissingAltText: toNum(report.total_images_missing_alt),
    pagesMissingHeadings: {
      h1: toNum(report.pages_missing_h1),
      h2: toNum(report.pages_missing_h2),
      h3: 0,
    },
    totalCta: toNum(report.total_cta),
    auditScore: toNum(report.audit_score),
    auditDurationSeconds: toNum(report.audit_duration_seconds),
  }
}

function mapIssues(issues: ApiAuditPageIssue[] | undefined): PageIssue[] {
  if (!issues?.length) return []

  return issues.map((issue) => ({
    issueType: issue.issue_type,
    severity: issue.severity,
    message: issue.message,
  }))
}

function mapPage(page: ApiAuditPage): PageFinding {
  const h1Count = toNum(page.h1_count)
  const h2Count = toNum(page.h2_count)
  const ctaCount = toNum(page.cta_count)

  return {
    pageName: page.page,
    url: page.page_url,
    statusCode: toNum(page.status_code),
    title: hasFlag(page.title) ? page.page : null,
    description: hasFlag(page.meta_desc) ? 'Present' : null,
    ctaTexts:
      ctaCount > 0
        ? Array.from({ length: ctaCount }, (_, i) => `CTA ${i + 1}`)
        : [],
    internalLinksCount: toNum(page.internal_links_count),
    externalLinksCount: toNum(page.external_links_count),
    internalImagesCount: toNum(page.images_count),
    externalImagesCount: 0,
    imagesMissingAltText: toNum(page.images_missing_alt_count),
    h2Count,
    headings: {
      h1: h1Count > 0 ? [page.page] : [],
      h2:
        h2Count > 0
          ? Array.from({ length: h2Count }, (_, i) => `H2 ${i + 1}`)
          : [],
      h3: [],
    },
    issues: mapIssues(page.AuditPageIssues),
  }
}

export function mapAuditToVersion(audit: ApiAudit, website: ApiWebsite): AuditVersion {
  return {
    id: audit.id,
    label: `V${audit.version}`,
    url: website.url,
    domain: website.domain,
    scrapedAt: audit.created_at,
    status: mapStatus(audit.status),
    ...mapReportToSummary(audit.AuditReports),
  }
}

export function mapAuditToFindings(audit: ApiAudit, website: ApiWebsite): VersionFindings {
  const summary = mapReportToSummary(audit.AuditReports)

  return {
    versionId: audit.id,
    label: `V${audit.version}`,
    url: website.url,
    domain: website.domain,
    websiteUrls: website.website_urls ?? [],
    scrapedAt: audit.created_at,
    status: mapStatus(audit.status),
    summary,
    pages: audit.AuditPages.map(mapPage),
  }
}

export function normalizeWebsites(data: ApiWebsite | ApiWebsite[]): ApiWebsite[] {
  return Array.isArray(data) ? data : [data]
}

export function parseApiData<T>(body: ApiEnvelope<T>): T {
  if (!body.success) {
    throw new Error(body.message || 'Request failed')
  }
  return body.data
}
