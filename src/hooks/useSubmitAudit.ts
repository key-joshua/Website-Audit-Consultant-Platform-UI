import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { submitAuditUrl } from '@/services/auditService'
import { normalizeUrl, validateUrl } from '@/utils/validateUrl'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

interface UseSubmitAuditResult {
  url: string
  setUrl: (value: string) => void
  validationError: string | null
  submitState: SubmitState
  submitError: string | null
  handleSubmit: (e: React.FormEvent) => void
}

export function useSubmitAudit(): UseSubmitAuditResult {
  const navigate = useNavigate();
  const [url, setUrl] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateUrl(url)
    if (error) {
      setValidationError(error)
      return
    }

    setSubmitError(null)
    setValidationError(null)
    setSubmitState('loading')

    try {
      const normalized = normalizeUrl(url)
      await submitAuditUrl(normalized)
      setSubmitState('success')
      navigate('/audit-versions')
    } catch (err) {
      setSubmitState('error')
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit audit')
    }
  }, [url])

  const handleSetUrl = useCallback((value: string) => {
    setUrl(value)
    setValidationError(null)
    setSubmitState('idle')
    setSubmitError(null)
  }, [])

  return {
    url,
    setUrl: handleSetUrl,
    validationError,
    submitState,
    submitError,
    handleSubmit,
  }
}
