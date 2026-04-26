export function parseServiceFeatures(featuresRaw) {
  if (!featuresRaw) return []
  if (Array.isArray(featuresRaw)) return featuresRaw
  try {
    const parsed = JSON.parse(featuresRaw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function serviceImageUrl(service) {
  if (!service?.image) return null
  if (service.image.startsWith('http')) return service.image
  return `/api/image/${encodeURIComponent(service.image)}`
}
