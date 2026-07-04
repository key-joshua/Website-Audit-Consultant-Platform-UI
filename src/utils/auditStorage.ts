const DOMAIN_KEY = 'auditDomain'
const DEFAULT_DOMAIN = 'blissagency.it'

export function setAuditDomain(domain: string): void {
  localStorage.setItem(DOMAIN_KEY, domain)
}

export function getAuditDomain(): string | null {
  return localStorage.getItem(DOMAIN_KEY)
}

export function initAuditDomain(): void {
  if (!getAuditDomain()) {
    setAuditDomain(DEFAULT_DOMAIN)
  }
}

export function domainFromUrl(url: string): string {
  return new URL(url).hostname
}
