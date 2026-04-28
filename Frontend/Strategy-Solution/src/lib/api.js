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

  let res
  let text
  let data
  try {
    res = await doFetch()
    text = await res.text()
    data = parseBody(text)
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: { message: error.message || 'Network error' },
    }
  }

  if (isTokenExpiredResponse(res.status, data)) {
    const refreshed = await tryRefreshSession()
    if (refreshed) {
      try {
        res = await doFetch()
        text = await res.text()
        data = parseBody(text)
      } catch (error) {
        return {
          ok: false,
          status: 500,
          data: { message: error.message || 'Network error after refresh' },
        }
      }
    }
  }

  return { ok: res.ok, status: res.status, data }
}

export { JSON_HEADERS }
