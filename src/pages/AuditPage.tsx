import { useSubmitAudit } from '@/hooks/useSubmitAudit'
import { AuditForm } from '@/components/audit/AuditForm'
import { AuditScanOverlay } from '@/components/audit/AuditScanOverlay'

export function AuditPage() {
  const { url, setUrl, validationError, submitState, submitError, handleSubmit } = useSubmitAudit()

  return (
    <>
      <AuditScanOverlay open={submitState === 'loading'} url={url} />
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <AuditForm
          url={url}
          onUrlChange={setUrl}
          validationError={validationError}
          submitState={submitState}
          submitError={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  )
}
