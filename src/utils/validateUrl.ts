export function validateUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'URL is required'

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'URL must use http or https'
    }
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
}
