import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from '../components/Modal'
import forms from '../shared/forms.module.css'

export default function RegisterPage() {
  const { login, refreshUser } = useAuth()
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
    const { ok, data, status } = await apiFetch('/api/register', {
      method: 'POST',
      json: { name, email },
    })
    setBusy(false)
    if (status === 409 || data?.status === 'error') {
      if (status === 409 || /exist|registered/i.test(data?.message || '')) {
        setExistsOpen(true)
        return
      }
    }
    if (ok && (data?.status === 'success' || data?.message)) {
      setOtpOpen(true)
      return
    }
    setError(data?.message || 'Registration could not start')
  }

  const finalize = async () => {
    setBusy(true)
    setError('')
    const v = await apiFetch('/api/verify', {
      method: 'POST',
      json: { otp, email, purpose: 'Registration' },
    })
    if (!v.ok) {
      setBusy(false)
      setError(v.data?.message || 'Invalid or expired OTP')
      return
    }
    const { ok, data } = await apiFetch('/api/insert_new_customer', {
      method: 'POST',
      json: {
        name,
        email,
        phone,
        company_name: company,
        password,
      },
    })
    setBusy(false)
    if (!ok) {
      setError(data?.message || 'Could not create account')
      return
    }
    setOtpOpen(false)
    const loginRes = await login(email, password)
    if (loginRes.ok) {
      await refreshUser()
      navigate('/services', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
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
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              className={forms.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className={forms.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
        <p>This email is already registered. Try signing in instead.</p>
      </Modal>
    </div>
  )
}
