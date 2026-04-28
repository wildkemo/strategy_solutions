import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from '../../components/Modal'
import forms from '../../styles/forms.module.css'
import styles from './Register.module.css'

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
  const [otpOpen, setOtpOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [existsOpen, setExistsOpen] = useState(false)

  const validate = () => {
    if (!name.trim()) {
      setError('Full name is required.')
      return false
    }
    if (!email.trim()) {
      setError('Email is required.')
      return false
    }
    if (!phone.trim()) {
      setError('Phone number is required.')
      return false
    }
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

  const registerMutation = useMutation({
    mutationFn: async () => {
      const signupRes = await apiFetch('/api/signup', {
        method: 'POST',
        json: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          companyName: company.trim() || undefined,
        },
      })

      if (signupRes.status === 409) {
        throw new Error('CONFLICT:' + (signupRes.data?.error || 'Account already exists'))
      }

      if (!signupRes.ok) {
        throw new Error(signupRes.data?.error || signupRes.data?.details?.join(', ') || 'Registration failed')
      }

      const otpRes = await apiFetch('/api/otp/create', {
        method: 'POST'
      })

      if (!otpRes.ok) {
        throw new Error(otpRes.data?.error || 'Could not send OTP. Please try logging in to verify your account.')
      }

      return otpRes
    },
    onSuccess: () => {
      setOtpOpen(true)
    },
    onError: (err) => {
      const msg = err.message
      if (msg.startsWith('CONFLICT:')) {
        setError(msg.replace('CONFLICT:', ''))
        setExistsOpen(true)
      } else {
        setError(msg)
      }
    },
  })

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      const v = await apiFetch('/api/otp/validate', {
        method: 'POST',
        json: { otp },
      })

      if (!v.ok) {
        throw new Error(v.data?.error || v.data?.details?.join(', ') || 'Invalid or expired OTP')
      }
      return v
    },
    onSuccess: async () => {
      setOtpOpen(false)
      await refreshUser()
      navigate('/services', { replace: true })
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    registerMutation.mutate()
  }

  const finalize = () => {
    setError('')
    finalizeMutation.mutate()
  }

  const busy = registerMutation.isPending || finalizeMutation.isPending

  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.surface}>
          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>Client Onboarding</span>
            <h2>Create account</h2>
            <p className={styles.sub}>Join our platform to track service requests and manage your projects.</p>
          </div>

          {error ? <p className={forms.error}>{error}</p> : null}

          <form onSubmit={onSubmit}>
            <div className={styles.sectionLabel}>Identity & Contact</div>
            <div className={styles.grid}>
              <div className={forms.field}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className={forms.input}
                  value={name}
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  className={forms.input}
                  value={email}
                  placeholder="john@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="company">Company Name</label>
                <input
                  id="company"
                  className={forms.input}
                  value={company}
                  placeholder="Acme Corp (Optional)"
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className={forms.input}
                  value={phone}
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.sectionLabel}>Account Security</div>
            <div className={styles.grid}>
              <div className={forms.field}>
                <label htmlFor="reg-pass">Password</label>
                <input
                  id="reg-pass"
                  type="password"
                  className={forms.input}
                  value={password}
                  placeholder="Min. 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="reg-pass2">Confirm Password</label>
                <input
                  id="reg-pass2"
                  type="password"
                  className={forms.input}
                  value={confirm}
                  placeholder="Repeat password"
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formNote}>
              We'll send a one-time verification code to your email to activate your secure workspace.
            </div>

            <button type="submit" className={forms.submit} disabled={busy}>
              {busy ? 'Preparing workspace…' : 'Initialize Account'}
            </button>
          </form>

          <div className={styles.linksRow}>
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>

      <Modal
        open={otpOpen}
        title="Verify email"
        onClose={() => !busy && setOtpOpen(false)}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button type="button" className={styles.secondaryBtn} onClick={() => setOtpOpen(false)} disabled={busy} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="button" className={forms.submit} style={{ width: 'auto', marginTop: 0 }} onClick={finalize} disabled={busy || otp.length < 4}>
              {busy ? 'Verifying…' : 'Confirm & Register'}
            </button>
          </div>
        }
      >
        <p style={{ marginBottom: '1.5rem' }}>A verification code has been sent to <strong>{email}</strong>. Please enter it below to complete your registration.</p>
        {error ? <p className={forms.error}>{error}</p> : null}
        <input
          className={forms.input}
          style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          maxLength={6}
        />
      </Modal>

      <Modal
        open={existsOpen}
        title="Account already exists"
        onClose={() => setExistsOpen(false)}
        actions={
          <Link to="/login" className={forms.submit} style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }} onClick={() => setExistsOpen(false)}>
            Proceed to Login
          </Link>
        }
      >
        <p style={{ marginBottom: '1rem' }}>It looks like an account is already associated with this email address.</p>
      </Modal>
    </div>
  )
}
