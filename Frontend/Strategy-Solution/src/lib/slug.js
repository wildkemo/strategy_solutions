export function slugify(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function servicePath(service) {
  const id = service?.id ?? ''
  const base = slugify(service?.title || 'service')
  return base ? `${id}-${base}` : String(id)
}

export function parseServiceIdFromSlug(param) {
  if (!param) return null
  const m = String(param).match(/^(\d+)/)
  return m ? Number(m[1]) : null
}
