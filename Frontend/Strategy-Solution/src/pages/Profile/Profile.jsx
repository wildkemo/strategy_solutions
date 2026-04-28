import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [name, setName] = useState(user?.name || '')
  const [company, setCompany] = useState(
    user?.companyName || user?.company_name || '',
  )
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errOpen, setErrOpen] = useState(false)

  const [deleteStep, setDeleteStep] = useState(null)
  const [deleteOtp, setDeleteOtp] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [devOtpHint, setDevOtpHint] = useState('')

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setCompany(user.companyName || user.company_name || '')
    setPhone(user.phone || '')
  }, [user])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword && newPassword !== confirm) {
      setError('New passwords do not match')
      return
    }
    setBusy(true)

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
    setBusy(false)
    if (ok) {
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
    } else if (status === 403) {
      setErrOpen(true)
    } else {
      setError(apiErrorMessage(data))
    }
  }

  const openDeleteFlow = async () => {
    setError('')
    setDeleteError('')
    setDeleteOtp('')
    setDevOtpHint('')
    setDeleteBusy(true)
    const { ok, data } = await apiFetch('/api/otp/create', {
      method: 'POST',
    })
    setDeleteBusy(false)
    if (!ok) {
      setError(apiErrorMessage(data))
      return
    }
    if (data?.devOnlyOtp) {
      setDevOtpHint(
        `Local dev: use code ${data.devOnlyOtp} (email not sent).`,
      )
    }
    setDeleteStep('otp')
  }

  const goToConfirmDelete = () => {
    if (!/^\d{6}$/.test(deleteOtp.trim())) return
    setDeleteError('')
    setDeleteStep('confirm')
  }

  const finalizeDelete = async () => {
    setDeleteBusy(true)
    setDeleteError('')
    const { ok, data } = await apiFetch('/api/delete_account', {
      method: 'DELETE',
      json: { otp: deleteOtp.trim() },
    })
    setDeleteBusy(false)
    if (ok) {
      await logout()
      setDeleteStep(null)
      setDeleteOtp('')
      navigate('/')
    } else {
      setDeleteStep('otp')
      setDeleteError(apiErrorMessage(data))
    }
  }

  return (
    <div className={`${forms.pageCenter} ${styles.pageWrap}`}>
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
        {deleteError ? <p className={styles.errText}>{deleteError}</p> : null}
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
