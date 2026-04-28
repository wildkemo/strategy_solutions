import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from '../../components/Modal'
import forms from '../../styles/forms.module.css'
import styles from './Profile.module.css'

function apiErrorMessage(data) {
  if (!data) return 'Something went wrong'
  if (typeof data.message === 'string') return data.message
  if (typeof data.error === 'string') return data.error
  if (Array.isArray(data.details)) return data.details.join(', ')
  return 'Something went wrong'
}

export default function ProfilePage() {
  const { user, refreshUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState(user?.name || '')
  const [company, setCompany] = useState(
    user?.companyName || user?.company_name || '',
  )
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errOpen, setErrOpen] = useState(false)

  const [deleteStep, setDeleteStep] = useState(null)
  const [deleteOtp, setDeleteOtp] = useState('')
  const [devOtpHint, setDevOtpHint] = useState('')

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setCompany(user.companyName || user.company_name || '')
    setPhone(user.phone || '')
  }, [user])

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (newPassword && newPassword !== confirm) {
        throw new Error('New passwords do not match')
      }
      const body = { name, currentPassword }
      if (!isAdmin) {
        body.company_name = company
        body.phone = phone
      }
      if (newPassword) body.password = newPassword

      const { ok, data, status } = await apiFetch('/api/update_user_info', {
        method: 'PATCH',
        json: body,
      })
      if (!ok) {
        if (status === 403) throw new Error('AUTH_ERR:Incorrect password')
        throw new Error(apiErrorMessage(data))
      }
      return data
    },
    onSuccess: async () => {
      await refreshUser()
      const parts = []
      if (name) parts.push('name')
      if (!isAdmin && (company || phone)) parts.push('profile details')
      if (newPassword) parts.push('password')
      setSuccessMsg(
        parts.length
          ? `Updated: ${parts.join(', ')}.`
          : 'Your profile was updated.',
      )
      setSuccessOpen(true)
      setNewPassword('')
      setConfirm('')
      setCurrentPassword('')
    },
    onError: (err) => {
      if (err.message === 'AUTH_ERR:Incorrect password') {
        setErrOpen(true)
      } else {
        setError(err.message)
      }
    },
  })

  const createOtpMutation = useMutation({
    mutationFn: async () => {
      const { ok, data } = await apiFetch('/api/otp/create', {
        method: 'POST',
      })
      if (!ok) throw new Error(apiErrorMessage(data))
      return data
    },
    onSuccess: (data) => {
      if (data?.devOnlyOtp) {
        setDevOtpHint(`Local dev: use code ${data.devOnlyOtp} (email not sent).`)
      } else {
        setDevOtpHint('')
      }
      setDeleteStep('otp')
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { ok, data } = await apiFetch('/api/delete_account', {
        method: 'DELETE',
        json: { otp: deleteOtp.trim() },
      })
      if (!ok) throw new Error(apiErrorMessage(data))
      return data
    },
    onSuccess: async () => {
      queryClient.clear()
      await logout()
      setDeleteStep(null)
      setDeleteOtp('')
      navigate('/')
    },
    onError: (err) => {
      setDeleteStep('otp')
      setError(err.message)
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    updateMutation.mutate()
  }

  const openDeleteFlow = () => {
    setError('')
    setDeleteOtp('')
    setDevOtpHint('')
    createOtpMutation.mutate()
  }

  const goToConfirmDelete = () => {
    if (!/^\d{6}$/.test(deleteOtp.trim())) return
    setError('')
    setDeleteStep('confirm')
  }

  const finalizeDelete = () => {
    setError('')
    deleteMutation.mutate()
  }

  const busy = updateMutation.isPending
  const deleteBusy = createOtpMutation.isPending || deleteMutation.isPending

  return (
    <div className={`${forms.pageCenter} ${styles.pageWrap}`}>
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>
      <div className={`${forms.card} ${styles.card}`}>
        <h1>Your profile</h1>
        <p className={forms.sub}>Keep your account details up to date.</p>
        {error ? <p className={forms.error}>{error}</p> : null}
        {isAdmin ? (
          <Link to="/admin_dashboard" className={styles.adminDash}>
            Go to Admin Dashboard
          </Link>
        ) : null}

        <form onSubmit={onSubmit}>
          <div className={styles.sectionHeader}>Account Details</div>
          <div className={forms.field}>
            <label>Email Status</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>{user?.email}</span>
              {user?.isActivated ? (
                <span className={styles.badgeVerified}>Verified</span>
              ) : (
                <span className={styles.badgeUnverified}>Unverified</span>
              )}
            </div>
          </div>
          <div className={forms.field}>
            <label htmlFor="p-name">Name</label>
            <input
              id="p-name"
              className={forms.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {!isAdmin ? (
            <>
              <div className={forms.field}>
                <label htmlFor="p-company">Company</label>
                <input
                  id="p-company"
                  className={forms.input}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className={forms.field}>
                <label htmlFor="p-phone">Phone</label>
                <input
                  id="p-phone"
                  className={forms.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          ) : null}
          
          <div className={styles.sectionHeader}>Security</div>
          <div className={forms.field}>
            <label htmlFor="p-current">Current password</label>
            <input
              id="p-current"
              type="password"
              className={forms.input}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="p-new">New password (optional)</label>
            <input
              id="p-new"
              type="password"
              className={forms.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className={forms.field}>
            <label htmlFor="p-new2">Confirm new password</label>
            <input
              id="p-new2"
              type="password"
              className={forms.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className={forms.submit} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerText}>
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={openDeleteFlow}
            disabled={deleteBusy}
          >
            {deleteBusy ? 'Sending code…' : 'Delete Account'}
          </button>
        </div>
      </div>

      <Modal open={successOpen} title="Saved" onClose={() => setSuccessOpen(false)}>
        <p>{successMsg}</p>
      </Modal>

      <Modal
        open={errOpen}
        title="Incorrect password"
        onClose={() => setErrOpen(false)}
      >
        <p>Your current password did not match. Try again.</p>
      </Modal>

      <Modal
        open={deleteStep === 'otp'}
        title="Delete account"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => setDeleteStep(null)}
              disabled={deleteBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={goToConfirmDelete}
              disabled={deleteBusy || !/^\d{6}$/.test(deleteOtp.trim())}
            >
              Continue
            </button>
          </>
        }
      >
        <p>
          We sent a 6-digit code to your email. Enter it below to continue.
        </p>
        {devOtpHint ? (
          <p className={styles.devHint}>{devOtpHint}</p>
        ) : null}
        {error ? <p className={styles.errText}>{error}</p> : null}
        <input
          className={styles.otpInput}
          value={deleteOtp}
          onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      </Modal>

      <Modal
        open={deleteStep === 'confirm'}
        title="Confirm deletion"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => setDeleteStep(null)}
              disabled={deleteBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={finalizeDelete}
              disabled={deleteBusy}
            >
              {deleteBusy ? 'Deleting…' : 'Permanently delete'}
            </button>
          </>
        }
      >
        <p>
          This will remove your account and associated data. This cannot be
          undone.
        </p>
      </Modal>
    </div>
  )
}
