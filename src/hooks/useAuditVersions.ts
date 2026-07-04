import type { AuditVersion } from '@/types'
import { getVersions } from '@/services/auditService'
import { useCallback, useEffect, useState } from 'react'

interface UseAuditVersionsResult {
  data: AuditVersion[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAuditVersions(): UseAuditVersionsResult {
  const [data, setData] = useState<AuditVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setIsLoading(true)
    setFetchKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    getVersions()
    .then((versions) => {
      if (!cancelled) {
        setData(versions)
        setError(null)
      }
    })
    .catch((err: unknown) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Failed to load versions')
      }
    })
    .finally(() => {
      if (!cancelled) setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [fetchKey])

  return { data, isLoading, error, refetch }
}
