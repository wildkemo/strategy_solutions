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
  const [companyName, setCompanyName] = useState(user?.companyName || '')
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
    setCompanyName(user.companyName || '')
    setPhone(user.phone || '')
  }, [user])

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (newPassword && newPassword !== confirm) {
        throw new Error('New passwords do not match')
      }
      const body = { name, currentPassword }
      if (!isAdmin) {
        body.company_name = companyName // API expects company_name
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
      if (!isAdmin && (companyName || phone)) parts.push('profile details')
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
    <div className={styles.pageWrap}>
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>
      <div className={styles.shell}>
        <div className={styles.mainCard}>
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <h1>Settings</h1>
              <div className={styles.badgeRow}>
                <span className={styles.badge + ' ' + styles.roleBadge}>
                  {user?.role?.toLowerCase() || 'Customer'}
                </span>
                <span className={`${styles.badge} ${styles.statusBadge} ${!user?.isActivated ? styles.unverified : ''}`}>
                  {user?.isActivated ? '✓ Verified' : 'Unverified'}
                </span>
              </div>
            </div>
            {isAdmin && (
              <Link to="/admin_dashboard">
                <button className={forms.submit} style={{ width: 'auto', marginTop: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                  Admin Dashboard
                </button>
              </Link>
            )}
          </header>

          {error ? <p className={forms.error}>{error}</p> : null}

          <form onSubmit={onSubmit}>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>Account Information</div>
              <div className={styles.fieldGrid}>
                <div className={forms.field}>
                  <label htmlFor="p-name">Full Name</label>
                  <input
                    id="p-name"
                    className={forms.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={forms.field}>
                  <label>Email address</label>
                  <input className={forms.input} value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                {!isAdmin && (
                  <>
                    <div className={forms.field}>
                      <label htmlFor="p-company">Company</label>
                      <input
                        id="p-company"
                        className={forms.input}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div className={forms.field}>
                      <label htmlFor="p-phone">Phone Number</label>
                      <input
                        id="p-phone"
                        className={forms.input}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionTitle}>Security</div>
              <div className={styles.fieldGrid}>
                <div className={`${forms.field} ${styles.fullWidth}`}>
                  <label htmlFor="p-current">Current Password</label>
                  <input
                    id="p-current"
                    type="password"
                    className={forms.input}
                    value={currentPassword}
                    placeholder="Enter current password to save changes"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className={forms.field}>
                  <label htmlFor="p-new">New Password (optional)</label>
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
                  <label htmlFor="p-new2">Confirm New Password</label>
                  <input
                    id="p-new2"
                    type="password"
                    className={forms.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className={styles.securityNote}>
                Passwords must be at least 6 characters. If you only want to update your profile details, leave the "New Password" fields empty.
              </div>
            </section>

            <div className={styles.actions}>
              <button type="submit" className={forms.submit} disabled={busy} style={{ width: 'auto', padding: '1rem 2.5rem' }}>
                {busy ? 'Saving changes…' : 'Update Profile'}
              </button>
            </div>
          </form>

          <section className={styles.dangerSection}>
            <h2 className={styles.dangerHeader}>Delete Account</h2>
            <p className={styles.dangerDesc}>
              Permanently remove your account and all associated data. This action cannot be undone and will immediately log you out.
            </p>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={openDeleteFlow}
              disabled={deleteBusy}
            >
              {deleteBusy ? 'Processing…' : 'Delete My Account'}
            </button>
          </section>
        </div>
      </div>

      <Modal open={successOpen} title="Profile Updated" onClose={() => setSuccessOpen(false)}>
        <p>{successMsg}</p>
      </Modal>

      <Modal
        open={errOpen}
        title="Incorrect Password"
        onClose={() => setErrOpen(false)}
      >
        <p>The current password you entered did not match our records. Please verify and try again.</p>
      </Modal>

      <Modal
        open={deleteStep === 'otp'}
        title="Verification Required"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
            <button type="button" onClick={() => setDeleteStep(null)} disabled={deleteBusy} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="button" className={forms.submit} style={{ width: 'auto', marginTop: 0, background: 'var(--color-error)' }} onClick={goToConfirmDelete} disabled={deleteBusy || !/^\d{6}$/.test(deleteOtp.trim())}>
              Verify Identity
            </button>
          </div>
        }
      >
        <p style={{ marginBottom: '1.5rem' }}>We've sent a 6-digit code to your email. Enter it below to proceed with account deletion.</p>
        {devOtpHint && <p style={{ padding: '0.75rem', background: 'var(--color-bg-muted)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{devOtpHint}</p>}
        {error && <p className={forms.error}>{error}</p>}
        <input
          className={forms.input}
          value={deleteOtp}
          onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
        />
      </Modal>

      <Modal
        open={deleteStep === 'confirm'}
        title="Final Confirmation"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
            <button type="button" onClick={() => setDeleteStep(null)} disabled={deleteBusy} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>
              No, Keep Account
            </button>
            <button type="button" className={styles.dangerBtn} style={{ width: 'auto' }} onClick={finalizeDelete} disabled={deleteBusy}>
              {deleteBusy ? 'Deleting…' : 'Yes, Delete Permanently'}
            </button>
          </div>
        }
      >
        <p>Are you absolutely sure? This will permanently wipe your account history, orders, and personal data from our systems.</p>
      </Modal>
    </div>
  )
}
