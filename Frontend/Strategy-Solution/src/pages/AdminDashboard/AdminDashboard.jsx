import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import { parseServiceFeatures } from '../../lib/services'
import {
  useServicesQuery,
  useAllOrdersQuery,
  useAllCustomersQuery,
  useAdminsQuery,
  useCategoriesQuery,
} from '../../lib/queries'
import { Modal } from '../../components/Modal'
import styles from './AdminDashboard.module.css'

const emptyFeature = { name: '', description: '' }

export default function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('services')
  const [toast, setToast] = useState(null)

  // --- Queries ---
  const { data: services = [] } = useServicesQuery()
  const { data: categories = [] } = useCategoriesQuery()
  const { data: orders = [] } = useAllOrdersQuery()
  const { data: customers = [] } = useAllCustomersQuery()
  const { data: admins = [] } = useAdminsQuery()

  const [qSvc, setQSvc] = useState('')
  const [qOrd, setQOrd] = useState('')
  const [qCust, setQCust] = useState('')

  const [svcModal, setSvcModal] = useState(null)
  const [deleteConfirmSvc, setDeleteConfirmSvc] = useState(null)
  const [svcForm, setSvcForm] = useState({
    id: null,
    title: '',
    description: '',
    categoryId: '',
    features: [{ ...emptyFeature }],
    image: null,
  })

  const [adminModal, setAdminModal] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' })

  const [custOrders, setCustOrders] = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    window.setTimeout(() => setToast(null), 3200)
  }

  // --- Helpers ---

  const removeFeature = (index) => {
    setSvcForm((f) => {
      const next = f.features.filter((_, i) => i !== index)
      return { ...f, features: next.length ? next : [{ ...emptyFeature }] }
    })
  }

  // --- Mutations ---

  const saveServiceMutation = useMutation({
    mutationFn: async (form) => {
      const fd = new FormData()
      if (form.id) fd.append('id', String(form.id))
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('categoryId', form.categoryId)
      fd.append(
        'features',
        JSON.stringify(
          form.features
            .filter((f) => f.name || f.description)
            .map((f) => ({ name: f.name, description: f.description })),
        ),
      )
      if (form.image) fd.append('image', form.image)

      const method = form.id ? 'PUT' : 'POST'
      const path = form.id ? '/api/update_services' : '/api/add_service'
      const res = await fetch(path, { method, credentials: 'include', body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Save failed')
      }
    },
    onSuccess: () => {
      showToast('Service saved')
      setSvcModal(null)
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_services', {
        method: 'DELETE',
        json: { id },
      })
      if (!ok) throw new Error(data?.message || 'Delete failed')
    },
    onSuccess: () => {
      showToast('Service deleted')
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { ok, data } = await apiFetch('/api/update_order_status', {
        method: 'PUT',
        json: { id, status },
      })
      if (!ok) throw new Error(data?.message || 'Update failed')
    },
    onSuccess: () => {
      showToast('Status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_order', {
        method: 'DELETE',
        json: { id, isAdmin: true },
      })
      if (!ok) throw new Error(data?.message || 'Delete failed')
    },
    onSuccess: () => {
      showToast('Order deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_user', {
        method: 'DELETE',
        json: { id },
      })
      if (!ok) throw new Error(data?.message || 'Delete failed')
    },
    onSuccess: () => {
      showToast('Customer deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const addAdminMutation = useMutation({
    mutationFn: async (form) => {
      const { ok, data } = await apiFetch('/api/add_admin', {
        method: 'POST',
        json: form,
      })
      if (!ok) throw new Error(data?.message || 'Could not create admin')
    },
    onSuccess: () => {
      showToast('Admin created')
      setAdminModal(false)
      setAdminForm({ name: '', email: '', password: '' })
      queryClient.invalidateQueries({ queryKey: ['admin-admins'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const openNewService = () => {
    setSvcForm({
      id: null,
      title: '',
      description: '',
      categoryId: '',
      features: [{ ...emptyFeature }],
      image: null,
    })
    setSvcModal('edit')
  }

  const openEditService = (s) => {
    const feats = parseServiceFeatures(s.features)
    const normalized = feats.length
      ? feats.map((f) =>
          typeof f === 'string'
            ? { name: '', description: f }
            : { name: f.name || '', description: f.description || '' },
        )
      : [{ ...emptyFeature }]
    setSvcForm({
      id: s.id,
      title: s.title || '',
      description: s.description || '',
      categoryId: String(s.categoryId || ''),
      features: normalized,
      image: null,
    })
    setSvcModal('edit')
  }

  const saveService = () => saveServiceMutation.mutate(svcForm)
  const deleteService = (id) => deleteServiceMutation.mutate(id)
  const updateOrderStatus = (id, status) => updateOrderStatusMutation.mutate({ id, status })
  const deleteOrder = (id) => deleteOrderMutation.mutate(id)
  const deleteCustomer = (id) => deleteCustomerMutation.mutate(id)
  const addAdmin = () => addAdminMutation.mutate(adminForm)

  const filterSvc = services.filter((s) =>
    [s.title, s.category?.name, s.description].some((x) =>
      (x || '').toLowerCase().includes(qSvc.toLowerCase()),
    ),
  )

  const filterOrd = orders.filter((o) =>
    [o.id, o.email, o.service_type, o.status].some((x) =>
      String(x || '')
        .toLowerCase()
        .includes(qOrd.toLowerCase()),
    ),
  )

  const filterCust = customers.filter((c) =>
    [c.name, c.email, c.company_name].some((x) =>
      (x || '').toLowerCase().includes(qCust.toLowerCase()),
    ),
  )

  return (
    <div className={styles.page}>
      {toast ? (
        <div className={toast.ok ? styles.toastOk : styles.toastErr} role="status">
          {toast.msg}
        </div>
      ) : null}

      <div className={styles.head}>
        <h1>Admin dashboard</h1>
        <div className={styles.tabs}>
          {['services', 'orders', 'customers', 'admins'].map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? styles.tabOn : styles.tab}
              onClick={() => setTab(t)}
            >
              {t === 'services'
                ? 'Service management'
                : t === 'orders'
                  ? 'Orders'
                  : t === 'customers'
                    ? 'Customers'
                    : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'services' ? (
        <section className={styles.section}>
          <div className={styles.bar}>
            <div className={styles.searchPill}>
              <input
                placeholder="Search services…"
                value={qSvc}
                onChange={(e) => setQSvc(e.target.value)}
              />
            </div>
            <button type="button" className={styles.addBtn} onClick={openNewService}>
              Add service
            </button>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterSvc.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.category?.name || '—'}</td>
                    <td>
                      <button type="button" className={styles.rowBtn} onClick={() => openEditService(s)}>
                        Edit
                      </button>
                      <button type="button" className={styles.rowBtnDanger} onClick={() => setDeleteConfirmSvc(s)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Service Delete Confirmation */}
      <Modal
        open={!!deleteConfirmSvc}
        title="Confirm Deletion"
        onClose={() => setDeleteConfirmSvc(null)}
        actions={
          <>
            <button type="button" className={styles.rowBtn} onClick={() => setDeleteConfirmSvc(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.rowBtnDanger}
              onClick={() => {
                deleteService(deleteConfirmSvc.id)
                setDeleteConfirmSvc(null)
              }}
            >
              Confirm Delete
            </button>
          </>
        }
      >
        <p className={styles.muted}>
          Are you sure you want to delete <strong>{deleteConfirmSvc?.title}</strong>? This action is permanent.
        </p>
      </Modal>

      {tab === 'orders' ? (
        <section className={styles.section}>
          <div className={styles.bar}>
            <div className={styles.searchPill}>
              <input
                placeholder="Search orders…"
                value={qOrd}
                onChange={(e) => setQOrd(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterOrd.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.email}</td>
                    <td>{o.service_type}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={o.status || 'Pending'}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      >
                        {['Pending', 'Active', 'Done', 'Rejected'].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</td>
                    <td>
                      <button type="button" className={styles.rowBtnDanger} onClick={() => deleteOrder(o.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'customers' ? (
        <section className={styles.section}>
          <div className={styles.bar}>
            <div className={styles.searchPill}>
              <input
                placeholder="Search customers…"
                value={qCust}
                onChange={(e) => setQCust(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterCust.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.company_name}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.rowBtn}
                        onClick={() => setCustOrders(c)}
                      >
                        Orders
                      </button>
                      <button type="button" className={styles.rowBtnDanger} onClick={() => deleteCustomer(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'admins' ? (
        <section className={styles.section}>
          <div className={styles.bar}>
            <button type="button" className={styles.addBtn} onClick={() => setAdminModal(true)}>
              Add admin
            </button>
          </div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <Modal
        open={svcModal === 'edit'}
        wide
        title={svcForm.id ? 'Edit service' : 'Add service'}
        onClose={() => setSvcModal(null)}
        actions={
          <>
            <button type="button" className={styles.rowBtn} onClick={() => setSvcModal(null)}>
              Cancel
            </button>
            <button type="button" className={styles.addBtn} onClick={saveService}>
              Save
            </button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <label>
            Title
            <input
              value={svcForm.title}
              onChange={(e) => setSvcForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label>
            Category
            <select
              value={svcForm.categoryId}
              onChange={(e) => setSvcForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.full}>
            Description
            <textarea
              rows={3}
              value={svcForm.description}
              onChange={(e) => setSvcForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <label className={styles.full}>
            Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSvcForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
              }
            />
          </label>
          <div className={styles.full}>
            <strong>Features</strong>
            {svcForm.features.map((feat, i) => (
              <div key={i} className={styles.featureRow}>
                <input
                  placeholder="Name"
                  value={feat.name}
                  onChange={(e) => {
                    const next = [...svcForm.features]
                    next[i] = { ...next[i], name: e.target.value }
                    setSvcForm((f) => ({ ...f, features: next }))
                  }}
                />
                <input
                  placeholder="Description"
                  value={feat.description}
                  onChange={(e) => {
                    const next = [...svcForm.features]
                    next[i] = { ...next[i], description: e.target.value }
                    setSvcForm((f) => ({ ...f, features: next }))
                  }}
                />
                <button
                  type="button"
                  className={styles.removeFeatureBtn}
                  onClick={() => removeFeature(i)}
                  title="Remove feature"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.rowBtn}
              onClick={() =>
                setSvcForm((f) => ({
                  ...f,
                  features: [...f.features, { ...emptyFeature }],
                }))
              }
            >
              + Add feature
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={adminModal}
        title="New admin"
        onClose={() => setAdminModal(false)}
        actions={
          <>
            <button type="button" className={styles.rowBtn} onClick={() => setAdminModal(false)}>
              Cancel
            </button>
            <button type="button" className={styles.addBtn} onClick={addAdmin}>
              Create
            </button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <label>
            Name
            <input
              value={adminForm.name}
              onChange={(e) => setAdminForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={adminForm.email}
              onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className={styles.full}>
            Password
            <input
              type="password"
              value={adminForm.password}
              onChange={(e) => setAdminForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>
        </div>
      </Modal>

      <Modal open={!!custOrders} title={`Orders — ${custOrders?.email || ''}`} onClose={() => setCustOrders(null)}>
        <p className={styles.muted}>
          Cross-reference with the Orders tab for full workflow. Customer snapshot:{' '}
          {custOrders?.name}.
        </p>
        <button type="button" className={styles.addBtn} onClick={() => setTab('orders')}>
          Go to orders
        </button>
      </Modal>
    </div>
  )
}
