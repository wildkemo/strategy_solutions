import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { parseServiceFeatures } from '../../lib/services'
import { Modal } from '../../components/Modal'
import styles from './AdminDashboard.module.css'

const emptyFeature = { name: '', description: '' }

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('services')
  const [toast, setToast] = useState(null)

  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [admins, setAdmins] = useState([])

  const [qSvc, setQSvc] = useState('')
  const [qOrd, setQOrd] = useState('')
  const [qCust, setQCust] = useState('')

  const [svcModal, setSvcModal] = useState(null)
  const [svcForm, setSvcForm] = useState({
    id: null,
    title: '',
    description: '',
    category: '',
    icon: '',
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

  const loadServices = useCallback(async () => {
    const { ok, data } = await apiFetch('/api/get_services')
    if (ok && Array.isArray(data)) setServices(data)
    else if (ok && data?.services) setServices(data.services)
  }, [])

  const loadOrders = useCallback(async () => {
    const { ok, data } = await apiFetch('/api/get_all_orders')
    if (ok && Array.isArray(data)) setOrders(data)
    else if (ok && data?.orders) setOrders(data.orders)
  }, [])

  const loadCustomers = useCallback(async () => {
    const { ok, data } = await apiFetch('/api/get_all_users')
    if (ok && Array.isArray(data)) setCustomers(data)
    else if (ok && data?.users) setCustomers(data.users)
  }, [])

  const loadAdmins = useCallback(async () => {
    const { ok, data } = await apiFetch('/api/get_admins')
    if (ok && Array.isArray(data)) setAdmins(data)
    else if (ok && data?.admins) setAdmins(data.admins)
  }, [])

  useEffect(() => {
    loadServices()
    loadOrders()
    loadCustomers()
    loadAdmins()
  }, [loadServices, loadOrders, loadCustomers, loadAdmins])

  const openNewService = () => {
    setSvcForm({
      id: null,
      title: '',
      description: '',
      category: '',
      icon: '',
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
      category: s.category || '',
      icon: s.icon || '',
      features: normalized,
      image: null,
    })
    setSvcModal('edit')
  }

  const saveService = async () => {
    const fd = new FormData()
    if (svcForm.id) fd.append('id', String(svcForm.id))
    fd.append('title', svcForm.title)
    fd.append('description', svcForm.description)
    fd.append('category', svcForm.category)
    fd.append('icon', svcForm.icon)
    fd.append(
      'features',
      JSON.stringify(
        svcForm.features
          .filter((f) => f.name || f.description)
          .map((f) => ({ name: f.name, description: f.description })),
      ),
    )
    if (svcForm.image) fd.append('image', svcForm.image)

    const method = svcForm.id ? 'PUT' : 'POST'
    const path = svcForm.id ? '/api/update_services' : '/api/add_service'
    const res = await fetch(path, { method, credentials: 'include', body: fd })
    const text = await res.text()
    const errPayload = (() => {
      try {
        return text ? JSON.parse(text) : null
      } catch {
        return null
      }
    })()
    if (res.ok) {
      showToast('Service saved')
      setSvcModal(null)
      loadServices()
    } else {
      showToast(errPayload?.message || 'Save failed', false)
    }
  }

  const deleteService = async (id) => {
    const { ok } = await apiFetch('/api/delete_services', {
      method: 'DELETE',
      json: { id },
    })
    if (ok) {
      showToast('Service deleted')
      loadServices()
    } else showToast('Delete failed', false)
  }

  const updateOrderStatus = async (id, status) => {
    const { ok } = await apiFetch('/api/update_order_status', {
      method: 'PUT',
      json: { id, status },
    })
    if (ok) {
      showToast('Status updated')
      loadOrders()
    } else showToast('Update failed', false)
  }

  const deleteOrder = async (id) => {
    const { ok } = await apiFetch('/api/delete_order', {
      method: 'DELETE',
      json: { id, isAdmin: true },
    })
    if (ok) {
      showToast('Order deleted')
      loadOrders()
    } else showToast('Delete failed', false)
  }

  const deleteCustomer = async (id) => {
    const { ok } = await apiFetch('/api/delete_user', {
      method: 'DELETE',
      json: { id },
    })
    if (ok) {
      showToast('Customer deleted')
      loadCustomers()
    } else showToast('Delete failed', false)
  }

  const addAdmin = async () => {
    const { ok } = await apiFetch('/api/add_admin', {
      method: 'POST',
      json: adminForm,
    })
    if (ok) {
      showToast('Admin created')
      setAdminModal(false)
      setAdminForm({ name: '', email: '', password: '' })
      loadAdmins()
    } else showToast('Could not create admin', false)
  }

  const filterSvc = services.filter((s) =>
    [s.title, s.category, s.description].some((x) =>
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
                    <td>{s.category}</td>
                    <td>
                      <button type="button" className={styles.rowBtn} onClick={() => openEditService(s)}>
                        Edit
                      </button>
                      <button type="button" className={styles.rowBtnDanger} onClick={() => deleteService(s.id)}>
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
            <input
              value={svcForm.category}
              onChange={(e) => setSvcForm((f) => ({ ...f, category: e.target.value }))}
            />
          </label>
          <label className={styles.full}>
            Description
            <textarea
              rows={3}
              value={svcForm.description}
              onChange={(e) => setSvcForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <label>
            Icon label
            <input
              value={svcForm.icon}
              onChange={(e) => setSvcForm((f) => ({ ...f, icon: e.target.value }))}
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
