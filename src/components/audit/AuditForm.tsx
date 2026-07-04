import { cn } from '@/utils/cn'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Globe, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'


interface AuditFormProps {
  url: string
  onUrlChange: (value: string) => void
  validationError: string | null
  submitState: 'idle' | 'loading' | 'success' | 'error'
  submitError: string | null
  onSubmit: (e: React.FormEvent) => void
}

export function AuditForm({ url, onUrlChange, validationError, submitState, submitError, onSubmit, }: AuditFormProps) {
  const isLoading = submitState === 'loading'
  const isSuccess = submitState === 'success'

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-sm">
      <div className="h-1 w-full brand-gradient" aria-hidden="true" />

      <CardHeader className="gap-0 py-10 px-6 pb-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 mb-4 shrink-0 items-center justify-center rounded-xl brand-gradient shadow-md">
            <Globe className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold tracking-tight">Audit a Website</CardTitle>
            <CardDescription className="max-w-md text-sm leading-relaxed">
              Enter a company URL to run an AI-powered SEO and accessibility audit.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0 px-6 pb-10 pt-0">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <label htmlFor="audit-url" className="text-sm font-medium">
              Website URL
            </label>
            <div className="relative mt-2">
              <Link2
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                id="audit-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                className={cn(
                  'h-11 pl-10',
                  validationError && 'border-red-500/50 focus-visible:ring-red-500/30',
                )}
                disabled={isLoading}
                aria-invalid={!!validationError}
                aria-describedby={validationError ? 'url-error' : undefined}
              />
            </div>
            {validationError && (
              <p id="url-error" className="flex items-center gap-1.5 text-sm text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                {validationError}
              </p>
            )}
          </div>

          <Button type="submit" className="h-11 w-full text-sm font-bold cursor-pointer" disabled={isLoading || isSuccess}> Audit Website </Button>

          {submitError && (
            <p className="flex items-center gap-1.5 text-sm text-red-400"> <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} /> {submitError} </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
