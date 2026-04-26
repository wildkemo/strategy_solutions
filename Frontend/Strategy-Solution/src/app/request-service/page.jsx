import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from '../components/Modal'
import forms from '../shared/forms.module.css'

export default function RequestServicePage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [serviceType, setServiceType] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [otpModal, setOtpModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [otpErr, setOtpErr] = useState('')

  const signInModal = !loading && !isAuthenticated

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await apiFetch('/api/get_services')
      if (cancelled) return
      const list = Array.isArray(data) ? data : data?.services || []
      setOptions(list)
      if (list[0]?.title) setServiceType(list[0].title)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    setError('')
    setBusy(true)
    const { ok, data } = await apiFetch('/api/request_service', {
      method: 'POST',
      json: { service_type: serviceType, service_description: description },
    })
    setBusy(false)
    if (ok && (data?.request_id != null || data?.status === 'otp_sent')) {
      setOrderId(data.request_id ?? data.order_id)
      setOtpModal(true)
    } else {
      setError(data?.message || 'Could not submit request')
    }
  }

  const verify = async () => {
    setBusy(true)
    setOtpErr('')
    const { ok, data } = await apiFetch('/api/verify_otp', {
      method: 'POST',
      json: { otp, order_id: orderId },
    })
    setBusy(false)
    if (ok) {
      setOtpModal(false)
      setSuccessModal(true)
      setOtp('')
    } else {
      setOtpErr(data?.message || 'Invalid OTP')
    }
  }

  return (
    <div className={forms.pageCenter}>
      <div className={forms.card}>
        <h1>Request a service</h1>
        <p className={forms.sub}>Describe what you need—we will follow up shortly.</p>
        {error ? <p className={forms.error}>{error}</p> : null}
        <form onSubmit={submit}>
          <div className={forms.field}>
            <label htmlFor="svc-type">Service type</label>
            <select
              id="svc-type"
              className={forms.select}
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              {options.length === 0 ? (
                <option value="General inquiry">General inquiry</option>
              ) : (
                options.map((s) => (
                  <option key={s.id} value={s.title || `Service ${s.id}`}>
                    {s.title || `Service ${s.id}`}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={forms.field}>
            <label htmlFor="svc-desc">Description</label>
            <textarea
              id="svc-desc"
              className={forms.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Goals, timeline, constraints…"
            />
          </div>
          <button type="submit" className={forms.submit} disabled={busy || !isAuthenticated}>
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </div>

      <Modal
        open={signInModal}
        title="Sign in required"
        onClose={() => navigate('/services')}
        actions={
          <>
            <button type="button" className={forms.submit} style={{ width: 'auto' }} onClick={() => navigate('/services')}>
              View services
            </button>
            <Link to="/login" className={forms.submit} style={{ width: 'auto', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
              Sign in
            </Link>
          </>
        }
      >
        <p>You need an account to request a service.</p>
      </Modal>

      <Modal
        open={otpModal}
        title="Verify OTP"
        onClose={() => !busy && setOtpModal(false)}
        actions={
          <>
            <button type="button" className={forms.submit} style={{ width: 'auto' }} onClick={() => setOtpModal(false)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className={forms.submit} style={{ width: 'auto' }} onClick={verify} disabled={busy || otp.length < 4}>
              Verify
            </button>
          </>
        }
      >
        <p>Enter the code we sent to your email.</p>
        {otpErr ? <p className={forms.error}>{otpErr}</p> : null}
        <input className={forms.input} style={{ marginTop: '0.75rem' }} value={otp} onChange={(e) => setOtp(e.target.value)} />
      </Modal>

      <Modal
        open={successModal}
        title="Request received"
        onClose={() => {
          setSuccessModal(false)
          navigate('/my-orders')
        }}
        actions={
          <button
            type="button"
            className={forms.submit}
            onClick={() => {
              setSuccessModal(false)
              navigate('/my-orders')
            }}
          >
            View orders
          </button>
        }
      >
        <p>Your request was verified. You can track it under My Orders.</p>
      </Modal>
    </div>
  )
}
