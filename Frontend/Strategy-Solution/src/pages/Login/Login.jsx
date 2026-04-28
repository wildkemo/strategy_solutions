import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import forms from '../../styles/forms.module.css'
import styles from './Login.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await login(email, password)
      if (!res.ok) throw new Error(res.message || 'Login failed')
      return res
    },
    onSuccess: (res) => {
      navigate(res.isAdmin ? '/admin_dashboard' : '/services', { replace: true })
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate()
  }

  const busy = loginMutation.isPending

  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.shell}>
        <section className={styles.formPane}>
          <div className={styles.formTop}>
            <span className={styles.eyebrow}>Secure Login</span>
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Enter your credentials to access your workspace and manage your orders.</p>
          
          {error ? <p className={forms.error}>{error}</p> : null}
          
          <form onSubmit={onSubmit}>
            <div className={forms.field}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className={forms.input}
                type="email"
                autoComplete="email"
                value={email}
                placeholder="name@company.com"
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
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={forms.submit} disabled={busy}>
              {busy ? 'Verifying identity…' : 'Sign in to Account'}
            </button>
          </form>

          <div className={styles.linksRow}>
            <Link to="/register">Create account</Link>
            <Link to="/forgot-password">Reset password</Link>
          </div>

          <div className={styles.formNote}>
            Need assistance? Contact our support team for help accessing your client dashboard.
          </div>
        </section>
      </div>
    </div>
  )
}
