import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import styles from './ActivationBanner.module.css'

export function ActivationBanner() {
  const { user, refreshUser } = useAuth()
  const [step, setStep] = useState('initial') // 'initial' | 'otp'
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [devOtpHint, setDevOtpHint] = useState('')

  useEffect(() => {
    setStep('initial')
    setOtp('')
    setError('')
    setMessage('')
    setDevOtpHint('')
  }, [user?.id])

  // Only show if user is logged in but not activated
  if (!user || user.isActivated) return null

  const handleSendOtp = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const { ok, data } = await apiFetch('/api/otp/create', { method: 'POST' })
      if (!ok) throw new Error(data?.error || 'Failed to send verification code')
      setDevOtpHint(data?.devOnlyOtp ? `Local dev OTP: ${data.devOnlyOtp}` : '')
      setMessage(`A verification code was sent to ${user.email}.`)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.trim().length < 4) return

    setLoading(true)
    setError('')
    setMessage('')
    try {
      const { ok, data } = await apiFetch('/api/otp/validate', {
        method: 'POST',
        json: { otp: otp.trim() }
      })

      if (!ok) throw new Error(data?.error || 'Invalid verification code')

      setMessage('Account verified successfully.')
      await refreshUser()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.banner} role="dialog" aria-modal="true" aria-labelledby="activation-banner-title">
        <div className={styles.content}>
          <div className={styles.text}>
            <span className={styles.eyebrow}>Action Required</span>
            <h4 id="activation-banner-title">Activate your account</h4>
            <p>Please verify your email address before continuing to use the platform.</p>
          </div>
          {step === 'initial' && (
            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}
        </div>

        {step === 'otp' && (
          <form className={styles.otpFlow} onSubmit={handleVerifyOtp}>
            <p className={styles.helpText}>
              Enter the 6-digit code sent to <strong>{user.email}</strong>
            </p>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading || otp.trim().length < 4}
              >
                {loading ? 'Verifying...' : 'Activate'}
              </button>
            </div>
            <div className={styles.secondaryActions}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={handleSendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {message && <p className={styles.message}>{message}</p>}
        {devOtpHint && <p className={styles.devHint}>{devOtpHint}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}
