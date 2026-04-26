import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import forms from '../shared/forms.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await login(email, password)
    setBusy(false)
    if (res.ok) {
      navigate(res.isAdmin ? '/blank_admin' : '/services', { replace: true })
    } else {
      setError(res.message || 'Login failed')
    }
  }

  return (
    <div className={forms.split}>
      <div className={forms.splitForm}>
        <div className={forms.card} style={{ maxWidth: 400 }}>
          <h1>Sign in</h1>
          <p className={forms.sub}>Welcome back. Enter your credentials.</p>
          {error ? <p className={forms.error}>{error}</p> : null}
          <form onSubmit={onSubmit}>
            <div className={forms.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className={forms.input}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={forms.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className={forms.input}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={forms.submit} disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className={forms.links}>
            <Link to="/register">Create an account</Link>
            {' · '}
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>
      </div>
      <div className={forms.splitArt} aria-hidden>
        <div>
          <h2>Strategy Solutions</h2>
          <p style={{ marginTop: '1rem', opacity: 0.95 }}>
            Clarity, alignment, and momentum for your next chapter.
          </p>
        </div>
      </div>
    </div>
  )
}
