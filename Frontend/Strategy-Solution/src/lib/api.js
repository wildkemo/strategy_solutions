const JSON_HEADERS = { 'Content-Type': 'application/json' }

function parseBody(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function isTokenExpiredResponse(status, data) {
  if (status !== 401 || !data) return false
  if (data.code === 'TOKEN_EXPIRED') return true
  const msg = typeof data.error === 'string' ? data.error.toLowerCase() : ''
  return msg.includes('expired') || msg.includes('access token')
}

async function tryRefreshSession() {
  const res = await fetch('/api/refresh_token', {
    method: 'POST',
    credentials: 'include',
  })
  return res.ok
}

export async function apiFetch(path, options = {}) {
  const { json, ...rest } = options

  const doFetch = () => {
    const headers = { ...rest.headers }
    if (json !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
    return fetch(path, {
      credentials: 'include',
      ...rest,
      headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })
  }

  let res = await doFetch()
  let text = await res.text()
  let data = parseBody(text)

  if (isTokenExpiredResponse(res.status, data)) {
    const refreshed = await tryRefreshSession()
    if (refreshed) {
      res = await doFetch()
      text = await res.text()
      data = parseBody(text)
    }
  }

  return { ok: res.ok, status: res.status, data }
}

export { JSON_HEADERS }
