export type AuditStatus = 'completed' | 'failed' | 'partial'

export interface HeadingCounts {
  h1: number
  h2: number
  h3: number
}

export interface PageIssue {
  issueType: string
  severity: string
  message: string
}

export interface AuditVersion {
  id: string
  label: string
  url: string
  domain: string
  scrapedAt: string
  status: AuditStatus
  totalWebsitePages: number
  totalPagesChecked: number
  successfulPagesChecked: number
  failedPagesChecked: number
  pagesMissingTitles: number
  pagesMissingMetaDesc: number
  totalImagesMissingAltText: number
  pagesMissingHeadings: HeadingCounts
  totalCta: number
  auditScore: number
  auditDurationSeconds: number
}

export interface PageHeadings {
  h1: string[]
  h2: string[]
  h3: string[]
}

export interface PageFinding {
  pageName: string
  url: string
  statusCode: number
  title: string | null
  description: string | null
  ctaTexts: string[]
  internalLinksCount: number
  externalLinksCount: number
  internalImagesCount: number
  externalImagesCount: number
  imagesMissingAltText: number
  h2Count: number
  headings: PageHeadings
  issues: PageIssue[]
}

export interface VersionFindings {
  versionId: string
  label: string
  url: string
  domain: string
  websiteUrls: string[]
  scrapedAt: string
  status: AuditStatus
  summary: {
    totalWebsitePages: number
    totalPagesChecked: number
    successfulPagesChecked: number
    failedPagesChecked: number
    pagesMissingTitles: number
    pagesMissingMetaDesc: number
    totalImagesMissingAltText: number
    pagesMissingHeadings: HeadingCounts
    totalCta: number
    auditScore: number
    auditDurationSeconds: number
  }
  pages: PageFinding[]
}

export interface SubmitAuditResponse {
  versionId: string
}
