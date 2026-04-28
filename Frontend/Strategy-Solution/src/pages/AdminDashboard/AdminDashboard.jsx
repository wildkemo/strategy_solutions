import { useMemo, useState } from 'react'
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

function SidebarIcon({ type }) {
  const commonProps = {
    className: styles.tabIconSvg,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (type) {
    case 'services':
      return (
        <svg {...commonProps}>
          <path d="M4 7.5h16" />
          <path d="M4 12h16" />
          <path d="M4 16.5h10" />
          <path d="M18 15v4" />
          <path d="M16 17h4" />
        </svg>
      )
    case 'categories':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <rect x="13" y="13" width="7" height="7" rx="2" />
        </svg>
      )
    case 'orders':
      return (
        <svg {...commonProps}>
          <path d="M7 4h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M14 4v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      )
    case 'customers':
      return (
        <svg {...commonProps}>
          <path d="M16 21v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
          <circle cx="9.5" cy="8" r="3.5" />
          <path d="M20 21v-1a4 4 0 0 0-3-3.87" />
          <path d="M15 4.13a3.5 3.5 0 0 1 0 6.74" />
        </svg>
      )
    case 'admins':
      return (
        <svg {...commonProps}>
          <path d="M12 3l7 4v5c0 4.2-2.7 8.08-7 9-4.3-.92-7-4.8-7-9V7l7-4Z" />
          <path d="M9.5 12.5l1.8 1.8 3.2-3.8" />
        </svg>
      )
    default:
      return null
  }
}

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
  const [qCat, setQCat] = useState('')

  const [svcModal, setSvcModal] = useState(null)
  const [deleteConfirmSvcId, setDeleteConfirmSvcId] = useState(null)
  const [svcForm, setSvcForm] = useState({
    id: null,
    title: '',
    description: '',
    categoryId: '',
    features: [{ ...emptyFeature }],
    image: null,
  })

  const [viewOrderId, setViewOrderId] = useState(null)

  const [catModal, setCatModal] = useState(null)
  const [catForm, setCatForm] = useState({ id: null, name: '' })

  const [adminModal, setAdminModal] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', phone: '' })

  const [custOrdersId, setCustOrdersId] = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    window.setTimeout(() => setToast(null), 3200)
  }

  // --- Helpers ---

  const deleteConfirmSvc = useMemo(() => 
    services.find(s => s.id === deleteConfirmSvcId), [services, deleteConfirmSvcId])
  
  const viewOrder = useMemo(() => 
    orders.find(o => o.id === viewOrderId), [orders, viewOrderId])

  const custOrders = useMemo(() => 
    customers.find(c => c.id === custOrdersId), [customers, custOrdersId])

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

  const saveCategoryMutation = useMutation({
    mutationFn: async (form) => {
      const { ok, data } = await apiFetch(form.id ? '/api/update_category' : '/api/add_category', {
        method: form.id ? 'PUT' : 'POST',
        json: form,
      })
      if (!ok) throw new Error(data?.message || 'Save failed')
    },
    onSuccess: () => {
      showToast('Category saved')
      setCatModal(null)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err) => showToast(err.message, false),
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const { ok, data } = await apiFetch('/api/delete_category', {
        method: 'DELETE',
        json: { id },
      })
      if (!ok) throw new Error(data?.message || 'Delete failed')
    },
    onSuccess: () => {
      showToast('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
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
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
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
      setAdminForm({ name: '', email: '', password: '', phone: '' })
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

  const openNewCategory = () => {
    setCatForm({ id: null, name: '' })
    setCatModal('edit')
  }

  const openEditCategory = (c) => {
    setCatForm({ id: c.id, name: c.name })
    setCatModal('edit')
  }

  const saveService = () => saveServiceMutation.mutate(svcForm)
  const deleteService = (id) => deleteServiceMutation.mutate(id)
  const saveCategory = () => saveCategoryMutation.mutate(catForm)
  const deleteCategory = (id) => deleteCategoryMutation.mutate(id)
  const updateOrderStatus = (id, status) => updateOrderStatusMutation.mutate({ id, status })
  const deleteOrder = (id) => deleteOrderMutation.mutate(id)
  const deleteCustomer = (id) => deleteCustomerMutation.mutate(id)
  const addAdmin = () => addAdminMutation.mutate(adminForm)

  const filterSvc = services.filter((s) =>
    [s.title, s.category?.name, s.description].some((x) =>
      (x || '').toLowerCase().includes(qSvc.toLowerCase()),
    ),
  )

  const filterCat = categories.filter((c) =>
    (c.name || '').toLowerCase().includes(qCat.toLowerCase()),
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

  const navItems = [
    {
      id: 'services',
      label: 'Services',
      count: services.length,
    },
    {
      id: 'categories',
      label: 'Categories',
      count: categories.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      count: orders.length,
    },
    {
      id: 'customers',
      label: 'Customers',
      count: customers.length,
    },
    {
      id: 'admins',
      label: 'Admins',
      count: admins.length,
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {toast ? (
        <div className={toast.ok ? styles.toastOk : styles.toastErr} role="status">
          {toast.msg}
        </div>
      ) : null}

      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <span className={styles.sidebarEyebrow}>Strategy Solutions</span>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <p className={styles.sidebarSubtitle}>Manage services, orders, and team access.</p>
        </div>

        <div className={styles.tabs}>
          {navItems.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? styles.tabOn : styles.tab}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.tabIconWrap}>
                <SidebarIcon type={t.id} />
              </span>
              <span className={styles.tabLabel}>{t.label}</span>
              <span className={styles.tabCount}>{t.count}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.head}>
          <h1>
            {tab === 'services' && 'Service Management'}
            {tab === 'categories' && 'Categories'}
            {tab === 'orders' && 'Orders'}
            {tab === 'customers' && 'Customers'}
            {tab === 'admins' && 'Admins'}
          </h1>
        </div>

        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Orders</span>
            <span className={styles.kpiValue}>{orders.length}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Active Services</span>
            <span className={styles.kpiValue}>{services.length}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Customers</span>
            <span className={styles.kpiValue}>{customers.length}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Categories</span>
            <span className={styles.kpiValue}>{categories.length}</span>
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
            {filterSvc.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateIcon}>📋</span>
                <p>No services found.</p>
              </div>
            ) : (
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
                        <td data-label="ID">{s.id}</td>
                        <td data-label="Title">{s.title}</td>
                        <td data-label="Category">{s.category?.name || '—'}</td>
                        <td>
                          <button type="button" className={styles.rowBtn} onClick={() => openEditService(s)}>
                            Edit
                          </button>
                          <button type="button" className={styles.rowBtnDanger} onClick={() => setDeleteConfirmSvcId(s.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {tab === 'categories' ? (
          <section className={styles.section}>
            <div className={styles.bar}>
              <div className={styles.searchPill}>
                <input
                  placeholder="Search categories…"
                  value={qCat}
                  onChange={(e) => setQCat(e.target.value)}
                />
              </div>
              <button type="button" className={styles.addBtn} onClick={openNewCategory}>
                Add category
              </button>
            </div>
            {filterCat.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateIcon}>🗂️</span>
                <p>No categories found.</p>
              </div>
            ) : (
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterCat.map((c) => (
                      <tr key={c.id}>
                        <td data-label="ID">{c.id}</td>
                        <td data-label="Name">{c.name}</td>
                        <td>
                          <button type="button" className={styles.rowBtn} onClick={() => openEditCategory(c)}>
                            Edit
                          </button>
                          <button type="button" className={styles.rowBtnDanger} onClick={() => deleteCategory(c.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            {filterOrd.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateIcon}>📦</span>
                <p>No orders found.</p>
              </div>
            ) : (
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
                        <td data-label="ID">{o.id}</td>
                        <td data-label="Customer">{o.email}</td>
                        <td data-label="Service">{o.service_type}</td>
                        <td data-label="Status">
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
                        <td data-label="Date">{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.rowBtn}
                            onClick={() => setViewOrderId(o.id)}
                          >
                            Details
                          </button>
                          <button type="button" className={styles.rowBtnDanger} onClick={() => deleteOrder(o.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            {filterCust.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateIcon}>👥</span>
                <p>No customers found.</p>
              </div>
            ) : (
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterCust.map((c) => (
                      <tr key={c.id}>
                        <td data-label="ID">{c.id}</td>
                        <td data-label="Name">{c.name}</td>
                        <td data-label="Email">{c.email}</td>
                        <td data-label="Company">{c.company_name}</td>
                        <td data-label="Status">
                          <span className={c.isActivated ? styles.badgeSuccess : styles.badgeMuted}>
                            {c.isActivated ? 'Active' : 'Unverified'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.rowBtn}
                            onClick={() => setCustOrdersId(c.id)}
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
            )}
          </section>
        ) : null}

        {tab === 'admins' ? (
          <section className={styles.section}>
            <div className={styles.bar}>
              <button type="button" className={styles.addBtn} onClick={() => setAdminModal(true)}>
                Add admin
              </button>
            </div>
            {admins.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateIcon}>🛡️</span>
                <p>No admins found.</p>
              </div>
            ) : (
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a.id}>
                        <td data-label="ID">{a.id}</td>
                        <td data-label="Name">{a.name}</td>
                        <td data-label="Email">{a.email}</td>
                        <td data-label="Phone">{a.phone || '—'}</td>
                        <td data-label="Status">
                          <span className={a.isActivated ? styles.badgeSuccess : styles.badgeMuted}>
                            {a.isActivated ? 'Active' : 'Unverified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {/* Modals */}
        <Modal
          open={!!deleteConfirmSvcId}
          title="Confirm Deletion"
          onClose={() => setDeleteConfirmSvcId(null)}
          actions={
            <>
              <button type="button" className={styles.rowBtn} onClick={() => setDeleteConfirmSvcId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.rowBtnDanger}
                onClick={() => {
                  deleteService(deleteConfirmSvcId)
                  setDeleteConfirmSvcId(null)
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

        <Modal
          open={viewOrderId != null}
          title={`Order Details #${viewOrder?.id}`}
          onClose={() => setViewOrderId(null)}
          actions={
            <button type="button" className={styles.rowBtn} onClick={() => setViewOrderId(null)}>
              Close
            </button>
          }
        >
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Customer Email</span>
            <div className={styles.detailValue}>{viewOrder?.email}</div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Service Type</span>
            <div className={styles.detailValue}>{viewOrder?.service_type}</div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <div className={styles.detailValue}>{viewOrder?.status || 'Pending'}</div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Submitted Date</span>
            <div className={styles.detailValue}>
              {viewOrder?.created_at ? new Date(viewOrder.created_at).toLocaleString() : '—'}
            </div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Service Description</span>
            <div className={styles.detailValue}>
              {viewOrder?.serviceDescription || 'No description provided.'}
            </div>
          </div>
        </Modal>

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
          open={catModal === 'edit'}
          title={catForm.id ? 'Edit category' : 'Add category'}
          onClose={() => setCatModal(null)}
          actions={
            <>
              <button type="button" className={styles.rowBtn} onClick={() => setCatModal(null)}>
                Cancel
              </button>
              <button type="button" className={styles.addBtn} onClick={saveCategory}>
                Save
              </button>
            </>
          }
        >
          <div className={styles.formGrid}>
            <label className={styles.full}>
              Name
              <input
                value={catForm.name}
                onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
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
            <label>
              Phone
              <input
                type="tel"
                value={adminForm.phone}
                onChange={(e) => setAdminForm((f) => ({ ...f, phone: e.target.value }))}
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

        <Modal open={!!custOrdersId} title={`Orders — ${custOrders?.email || ''}`} onClose={() => setCustOrdersId(null)}>
          <p className={styles.muted}>
            Cross-reference with the Orders tab for full workflow. Customer snapshot:{' '}
            {custOrders?.name}.
          </p>
          <button type="button" className={styles.addBtn} onClick={() => {
            setTab('orders')
            setCustOrdersId(null)
          }}>
            Go to orders
          </button>
        </Modal>
      </main>
    </div>
  )
}
