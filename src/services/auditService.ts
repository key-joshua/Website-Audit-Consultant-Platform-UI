import { getAuditDomain, setAuditDomain, domainFromUrl } from '@/utils/auditStorage'
import { axiosClient } from '@/services/axiosClient'
import {
  mapAuditToFindings,
  mapAuditToVersion,
  normalizeWebsites,
  parseApiData,
  type ApiEnvelope,
  type ApiWebsite,
} from '@/services/auditMappers'
import type { AuditVersion, SubmitAuditResponse, VersionFindings } from '@/types'

let cachedWebsites: ApiWebsite[] | null = null
let cachedDomain: string | null = null

function invalidateCache(): void {
  cachedWebsites = null
  cachedDomain = null
}

function getLatestAuditId(website: ApiWebsite): string {
  const latest = [...website.Audits].sort(
    (a, b) => (Number(b.version) || 0) - (Number(a.version) || 0),
  )[0]

  if (!latest) {
    throw new Error('Audit completed but no version was returned')
  }

  return latest.id
}

async function fetchWebsitesByDomain(domain: string): Promise<ApiWebsite[]> {
  if (cachedDomain === domain && cachedWebsites) {
    return cachedWebsites
  }

  const response = await axiosClient.get<ApiEnvelope<ApiWebsite | ApiWebsite[]>>(
    `/audit-website/domain/${encodeURIComponent(domain)}`,
  )
  const websites = normalizeWebsites(parseApiData(response.data))

  cachedDomain = domain
  cachedWebsites = websites

  return websites
}

function getAllAudits(websites: ApiWebsite[]): { audit: ApiWebsite['Audits'][number]; website: ApiWebsite }[] {
  return websites.flatMap((website) =>
    website.Audits.map((audit) => ({ audit, website })),
  )
}

function findAuditById(
  websites: ApiWebsite[],
  versionId: string,
): { audit: ApiWebsite['Audits'][number]; website: ApiWebsite } | null {
  for (const website of websites) {
    const audit = website.Audits.find((a) => a.id === versionId)
    if (audit) return { audit, website }
  }
  return null
}

export async function getVersions(): Promise<AuditVersion[]> {
  const domain = getAuditDomain()
  if (!domain) return []

  const websites = await fetchWebsitesByDomain(domain)

  return getAllAudits(websites)
    .map(({ audit, website }) => mapAuditToVersion(audit, website))
    .sort((a, b) => {
      const versionA = Number(a.label.replace('V', '')) || 0
      const versionB = Number(b.label.replace('V', '')) || 0
      return versionB - versionA
    })
}

export async function getVersionFindings(versionId: string): Promise<VersionFindings> {
  const domain = getAuditDomain()
  if (!domain) {
    throw new Error(`Version "${versionId}" not found`)
  }

  const websites = await fetchWebsitesByDomain(domain)
  const match = findAuditById(websites, versionId)

  if (!match) {
    throw new Error(`Version "${versionId}" not found`)
  }

  return mapAuditToFindings(match.audit, match.website)
}

export async function submitAuditUrl(url: string): Promise<SubmitAuditResponse> {
  const domain = domainFromUrl(url)
  setAuditDomain(domain)
  invalidateCache()

  const response = await axiosClient.post<ApiEnvelope<ApiWebsite | ApiWebsite[]>>(
    '/audit-website',
    { url },
  )
  const websites = normalizeWebsites(parseApiData(response.data))

  cachedDomain = domain
  cachedWebsites = websites

  const website = websites.find((w) => w.domain === domain) ?? websites[0]
  if (!website?.Audits.length) {
    throw new Error('Audit completed but no version was returned')
  }

  setAuditDomain(website.domain)
  return { versionId: getLatestAuditId(website) }
}
