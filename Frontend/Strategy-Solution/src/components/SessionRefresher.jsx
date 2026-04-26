import { useEffect, useRef } from 'react'
import { apiFetch } from '../lib/api'

const REFRESH_MS = 14 * 60 * 1000

export function SessionRefresher() {
  const timer = useRef(null)

  useEffect(() => {
    const tick = async () => {
      await apiFetch('/api/refresh_token', { method: 'POST' })
    }
    timer.current = window.setInterval(tick, REFRESH_MS)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [])

  return null
}
