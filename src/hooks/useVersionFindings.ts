import { useCallback, useEffect, useState } from 'react'
import { getVersionFindings } from '@/services/auditService'
import type { VersionFindings } from '@/types'

interface UseVersionFindingsResult {
  data: VersionFindings | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useVersionFindings(versionId: string): UseVersionFindingsResult {
  const [data, setData] = useState<VersionFindings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setIsLoading(true)
    setFetchKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!versionId) return

    let cancelled = false

    getVersionFindings(versionId)
      .then((findings) => {
        if (!cancelled) {
          setData(findings)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load findings')
          setData(null)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [versionId, fetchKey])

  return { data, isLoading, error, refetch }
}
