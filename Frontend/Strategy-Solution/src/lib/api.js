const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function apiFetch(path, options = {}) {
  const { json, ...rest } = options
  const headers = { ...rest.headers }
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(path, {
    credentials: 'include',
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }
  }
  return { ok: res.ok, status: res.status, data }
}

export { JSON_HEADERS }
