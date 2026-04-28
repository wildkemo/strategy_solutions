import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from '../../components/Modal'
import forms from '../../styles/forms.module.css'

export default function RegisterPage() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [existsOpen, setExistsOpen] = useState(false)

  const validate = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setBusy(true)
    
    // 1. Signup the user
    const signupRes = await apiFetch('/api/signup', {
      method: 'POST',
      json: { name, email, companyName: company, phone, password },
    })

    if (signupRes.status === 409) {
      setBusy(false)
      setError(signupRes.data?.error || 'Account already exists')
      setExistsOpen(true)
      return
    }

    if (!signupRes.ok) {
      setBusy(false)
      setError(signupRes.data?.error || signupRes.data?.details?.join(', ') || 'Registration failed')
      return
    }

    // 2. Request OTP (access token cookie is already set by signup)
    const otpRes = await apiFetch('/api/otp/create', {
      method: 'POST'
    })

    setBusy(false)
    if (otpRes.ok) {
      setOtpOpen(true)
    } else {
      setError(otpRes.data?.error || 'Could not send OTP. Please try logging in to verify your account.')
    }
  }

  const finalize = async () => {
    setBusy(true)
    setError('')
    
    // 3. Validate OTP
    const v = await apiFetch('/api/otp/validate', {
      method: 'POST',
      json: { otp },
    })

    if (!v.ok) {
      setBusy(false)
      setError(v.data?.error || v.data?.details?.join(', ') || 'Invalid or expired OTP')
      return
    }

    // 4. Success!
    setBusy(false)
    setOtpOpen(false)
    await refreshUser()
    navigate('/services', { replace: true })
  }

  return (
    <div className={forms.pageCenter}>
      <div className={forms.card}>
        <h1>Create account</h1>
        <p className={forms.sub}>Join to request services and track orders.</p>
        {error ? <p className={forms.error}>{error}</p> : null}
        <form onSubmit={onSubmit}>
          <div className={forms.field}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              className={forms.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className={forms.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              className={forms.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              className={forms.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="reg-pass">Password</label>
            <input
              id="reg-pass"
              type="password"
              className={forms.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="reg-pass2">Confirm password</label>
            <input
              id="reg-pass2"
              type="password"
              className={forms.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className={forms.submit} disabled={busy}>
            {busy ? 'Sending…' : 'Continue'}
          </button>
        </form>
        <div className={forms.links}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>

      <Modal
        open={otpOpen}
        title="Verify email"
        onClose={() => !busy && setOtpOpen(false)}
        actions={
          <>
            <button type="button" className={forms.submit} style={{ width: 'auto' }} onClick={() => setOtpOpen(false)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className={forms.submit} style={{ width: 'auto' }} onClick={finalize} disabled={busy || otp.length < 4}>
              {busy ? '…' : 'Verify & register'}
            </button>
          </>
        }
      >
        <p>Enter the OTP sent to your email.</p>
        {error ? <p className={forms.error}>{error}</p> : null}
        <input
          className={forms.input}
          style={{ marginTop: '0.75rem' }}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
        />
      </Modal>

      <Modal
        open={existsOpen}
        title="Account exists"
        onClose={() => setExistsOpen(false)}
        actions={
          <Link to="/login" className={forms.submit} style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }} onClick={() => setExistsOpen(false)}>
            Go to login
          </Link>
        }
      >
        <p>{error || 'This account is already registered.'} Try signing in instead.</p>
      </Modal>
    </div>
  )
}
