import { dummyFindings } from '@/data/findings.dummy'
import { dummyVersions } from '@/data/versions.dummy'
import type { AuditVersion, SubmitAuditResponse, VersionFindings } from '@/types'

function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export async function getVersions(): Promise<AuditVersion[]> {
  return delay(dummyVersions, 400)
}

export async function getVersionFindings(versionId: string): Promise<VersionFindings> {
  const findings = dummyFindings[versionId]
  if (!findings) {
    throw new Error(`Version "${versionId}" not found`)
  }
  return delay(findings, 400)
}

export async function submitAuditUrl(url: string): Promise<SubmitAuditResponse> {
  void url
  return delay({ versionId: 'v-new' }, 10000)
}
