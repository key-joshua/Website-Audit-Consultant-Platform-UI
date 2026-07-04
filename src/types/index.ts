export type AuditStatus = 'completed' | 'failed' | 'partial'

export interface HeadingCounts {
  h1: number
  h2: number
  h3: number
}

export interface AuditVersion {
  id: string
  label: string
  url: string
  scrapedAt: string
  status: AuditStatus
  totalPagesChecked: number
  successfulPagesChecked: number
  failedPagesChecked: number
  pagesMissingTitles: number
  pagesMissingMetaDesc: number
  totalImagesMissingAltText: number
  pagesMissingHeadings: HeadingCounts
}

export interface PageHeadings {
  h1: string[]
  h2: string[]
  h3: string[]
}

export interface PageFinding {
  url: string
  title: string | null
  description: string | null
  ctaTexts: string[]
  internalLinksCount: number
  externalLinksCount: number
  internalImagesCount: number
  externalImagesCount: number
  imagesMissingAltText: number
  headings: PageHeadings
}

export interface VersionFindings {
  versionId: string
  label: string
  url: string
  scrapedAt: string
  status: AuditStatus
  summary: {
    totalPagesChecked: number
    successfulPagesChecked: number
    failedPagesChecked: number
    pagesMissingTitles: number
    pagesMissingMetaDesc: number
    totalImagesMissingAltText: number
    pagesMissingHeadings: HeadingCounts
  }
  pages: PageFinding[]
}

export interface SubmitAuditResponse {
  versionId: string
}
