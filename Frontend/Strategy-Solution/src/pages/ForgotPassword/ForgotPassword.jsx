import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import forms from '../../styles/forms.module.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    const { ok, data } = await apiFetch('/api/send_otp', {
      method: 'POST',
      json: { email, purpose: 'Reset Password' },
    })
    setBusy(false)
    if (ok) {
      setOtpSent(true)
      setMessage('OTP sent to your email.')
    } else {
      setError(data?.message || 'Could not send OTP')
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    const { ok, data } = await apiFetch('/api/reset_password', {
      method: 'POST',
      json: { email, otp, password },
    })
    setBusy(false)
    if (ok) {
      setMessage('Password updated. Redirecting to sign in…')
      window.setTimeout(() => navigate('/login', { replace: true }), 1500)
    } else {
      setError(data?.message || 'Reset failed')
    }
  }

  return (
    <div className={forms.split}>
      <div className={forms.splitForm}>
        <div className={forms.card} style={{ maxWidth: 420 }}>
          <h1>Reset password</h1>
          <p className={forms.sub}>We will email you a one-time code.</p>
          {error ? <p className={forms.error}>{error}</p> : null}
          {message ? <p className={forms.success}>{message}</p> : null}

          <form onSubmit={sendOtp}>
            <div className={forms.field}>
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                className={forms.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
                autoComplete="email"
              />
            </div>
            <button type="submit" className={forms.submit} disabled={busy || otpSent}>
              {busy && !otpSent ? 'Sending…' : 'Send OTP'}
            </button>
          </form>

          {otpSent ? (
            <form onSubmit={reset} style={{ marginTop: '1.5rem' }}>
              <div className={forms.field}>
                <label htmlFor="fp-otp">OTP</label>
                <input
                  id="fp-otp"
                  className={forms.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="fp-pass">New password</label>
                <input
                  id="fp-pass"
                  type="password"
                  className={forms.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="fp-pass2">Confirm password</label>
                <input
                  id="fp-pass2"
                  type="password"
                  className={forms.input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className={forms.submit} disabled={busy}>
                {busy ? 'Working…' : 'Reset password'}
              </button>
            </form>
          ) : null}

          <div className={forms.links}>
            <Link to="/login">Back to sign in</Link>
          </div>
        </div>
      </div>
      <div className={forms.splitArt} aria-hidden>
        <div>
          <h2>Secure recovery</h2>
          <p style={{ marginTop: '1rem', opacity: 0.95 }}>
            Verify your email and choose a strong new password.
          </p>
        </div>
      </div>
    </div>
  )
}
