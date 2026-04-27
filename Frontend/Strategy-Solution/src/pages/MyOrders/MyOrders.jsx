import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserOrdersQuery } from '../../lib/queries'
import { apiFetch } from '../../lib/api'
import { Footer } from '../../components/Footer'
import { Modal } from '../../components/Modal'
import styles from './MyOrders.module.css'

function statusClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('done') || s.includes('complete')) return styles.badgeBlue
  if (s.includes('reject')) return styles.badgeRed
  if (s.includes('pending')) return styles.badgeYellow
  if (s.includes('active')) return styles.badgeGreen
  return styles.badgeMuted
}

export default function MyOrdersPage() {
  const queryClient = useQueryClient()
  const { data: orders = [], isLoading } = useUserOrdersQuery()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_order', {
        method: 'DELETE',
        json: { id, isAdmin: false },
      })
      if (!ok) throw new Error(data?.message || data?.error || 'Delete failed')
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
      setDeleteId(null)
    },
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        String(o.id).includes(q) ||
        (o.service_type || '').toLowerCase().includes(q) ||
        (o.status || '').toLowerCase().includes(q),
    )
  }, [orders, search])

  const confirmDelete = async () => {
    if (deleteId == null) return
    deleteMutation.mutate(deleteId)
  }

  const busy = deleteMutation.isPending

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>My orders</h1>
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search by id, service, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders"
          />
        </div>

        {isLoading ? (
          <p className={styles.muted}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>You have no orders yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.service_type}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(o.status)}`}>
                        {o.status || '—'}
                      </span>
                    </td>
                    <td>{o.otp ? 'OTP pending' : '—'}</td>
                    <td>
                      {o.created_at
                        ? new Date(o.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      {o.status === 'Pending' ? (
                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() => setDeleteId(o.id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer variant="minimal" />

      <Modal
        open={deleteId != null}
        title="Delete order?"
        onClose={() => !busy && setDeleteId(null)}
        actions={
          <>
            <button type="button" className={styles.ghost} onClick={() => setDeleteId(null)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className={styles.danger} onClick={confirmDelete} disabled={busy}>
              {busy ? '…' : 'Delete'}
            </button>
          </>
        }
      >
        <p>This removes the order if it is still pending.</p>
      </Modal>
    </div>
  )
}
