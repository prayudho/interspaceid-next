/** Trims and caps string length. Returns empty string for non-strings. */
export function str(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return ''
  return val.slice(0, maxLen).trim()
}

/** Returns first missing field name, or null if all present. */
export function requireFields(obj: Record<string, unknown>, fields: string[]): string | null {
  for (const f of fields) {
    const v = obj[f]
    if (v === undefined || v === null || String(v).trim() === '') return f
  }
  return null
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Strips HTML tags — lightweight protection for plain-text fields. */
export function stripTags(val: string): string {
  return val.replace(/<[^>]*>/g, '')
}
