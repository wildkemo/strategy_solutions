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
  const [viewOrderId, setViewOrderId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_order', {
        method: 'DELETE',
        json: { id, isAdmin: false },
      })
      if (!ok) throw new Error(data?.message || 'Delete failed')
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      setDeleteId(null)
    },
    onError: (err) => {
      setDeleteError(err.message)
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

  const viewOrder = useMemo(() => {
    if (!viewOrderId) return null
    return orders.find(o => o.id === viewOrderId) || null
  }, [orders, viewOrderId])

  const confirmDelete = async () => {
    if (deleteId == null) return
    setDeleteError('')
    deleteMutation.mutate(deleteId)
  }

  const busy = deleteMutation.isPending

  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>

      <div className={`${styles.inner} animate-slide-up`}>
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
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td data-label="ID">{o.id}</td>
                    <td data-label="Service">{o.service_type}</td>
                    <td data-label="Description">
                      {o.serviceDescription ? (
                        <span title={o.serviceDescription}>
                          {o.serviceDescription.length > 40
                            ? o.serviceDescription.slice(0, 40) + '…'
                            : o.serviceDescription}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td data-label="Status">
                      <span className={`${styles.badge} ${statusClass(o.status)}`}>
                        {o.status || '—'}
                      </span>
                    </td>
                    <td data-label="Date">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => setViewOrderId(o.id)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => {
                          setDeleteId(o.id)
                          setDeleteError('')
                        }}
                      >
                        Delete
                      </button>
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
        open={viewOrderId != null}
        title={`Order #${viewOrder?.id}`}
        onClose={() => setViewOrderId(null)}
        actions={
          <button type="button" className={styles.ghost} onClick={() => setViewOrderId(null)}>
            Close
          </button>
        }
      >
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Service</span>
          <div className={styles.detailValue}>{viewOrder?.service_type}</div>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status</span>
          <div className={`${styles.badge} ${statusClass(viewOrder?.status)}`}>
            {viewOrder?.status}
          </div>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Date</span>
          <div className={styles.detailValue}>
            {viewOrder?.created_at ? new Date(viewOrder.created_at).toLocaleString() : '—'}
          </div>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Description</span>
          <div className={styles.detailValue}>
            {viewOrder?.serviceDescription || 'No description provided.'}
          </div>
        </div>
      </Modal>

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
        {deleteError && (
          <p style={{ color: 'var(--color-error)', marginTop: '1rem', fontSize: '0.9rem' }}>
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  )
}
