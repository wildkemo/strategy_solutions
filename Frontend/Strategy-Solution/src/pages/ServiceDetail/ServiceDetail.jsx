import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { useServicesQuery } from '../../lib/queries'
import { apiFetch } from '../../lib/api'
import { parseServiceFeatures, serviceImageUrl } from '../../lib/services'
import { parseServiceIdFromSlug, servicePath } from '../../lib/slug'
import { Footer } from '../../components/Footer'
import { Modal } from '../../components/Modal'
import styles from './ServiceDetail.module.css'

const FEATURE_ICONS = [
  <svg key="a" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>,
]

function normalizeFeature(f, i) {
  if (typeof f === 'string') return { name: `Feature ${i + 1}`, description: f }
  return {
    name: f.name || f.title || `Feature ${i + 1}`,
    description: f.description || f.desc || '',
  }
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const { data: list = [], isLoading } = useServicesQuery()
  const [signInModal, setSignInModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [error, setError] = useState('')

  const service = useMemo(() => {
    const id = parseServiceIdFromSlug(slug)
    return (
      list.find((s) => s.id === id) ||
      list.find((s) => servicePath(s) === slug) ||
      null
    )
  }, [list, slug])

  const features = useMemo(() => {
    if (!service) return []
    return parseServiceFeatures(service.features).map(normalizeFeature)
  }, [service])

  const img = service ? serviceImageUrl(service) : null

  const requestMutation = useMutation({
    mutationFn: async () => {
      const { ok, data } = await apiFetch('/api/request_service', {
        method: 'POST',
        json: {
          service_type: service.id,
          service_description: `Request for: ${service.title || 'service'}`,
        },
      })
      if (!ok) throw new Error(data?.message || 'Could not start request')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      setSuccessModal(true)
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const startRequest = () => {
    if (!isAuthenticated) {
      setSignInModal(true)
      return
    }
    if (!service) return
    setError('')
    requestMutation.mutate()
  }

  const busy = requestMutation.isPending

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.center}>Loading…</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>
          <p>Service not found.</p>
          <Link to="/services">Back to services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>

      <div className={styles.inner}>
        <article className={`${styles.heroCard} animate-slide-up`}>
          <div
            className={styles.heroImage}
            style={img ? { backgroundImage: `url(${img})` } : undefined}
          />
          <div className={styles.heroText}>
            {service.category?.name && (
              <span className={styles.categoryBadge}>{service.category.name}</span>
            )}
            <h1 className={styles.textGradient}>{service.title}</h1>
            <p className={styles.desc}>{service.description}</p>
          </div>
        </article>

        {features.length > 0 ? (
          <section className={styles.features}>
            <h2 className={styles.sectionTitle}>Key features</h2>
            <div className={`${styles.featureGrid} ${styles.staggerIn}`}>
              {features.map((f, i) => (
                <div key={`${f.name}-${i}`} className={styles.featureCard} style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className={styles.fIconWrap}>
                    <div className={styles.fIconGlow}></div>
                    <div className={styles.fIcon}>{FEATURE_ICONS[i % FEATURE_ICONS.length]}</div>
                  </div>
                  <h3>{f.name}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className={`${styles.actions} animate-slide-up`} style={{ animationDelay: '0.4s' }}>
          <Link to="/services" className={styles.secondaryBtn}>
            View all services
          </Link>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={startRequest}
            disabled={busy}
          >
            {busy ? 'Requesting…' : 'Request this service'}
          </button>
        </div>
        {error ? (
          <p className={styles.err}>{error}</p>
        ) : null}
      </div>

      <Footer />

      <Modal
        open={signInModal}
        title="Sign in required"
        onClose={() => setSignInModal(false)}
        actions={
          <>
            <button type="button" className={styles.ghostBtn} onClick={() => setSignInModal(false)}>
              Close
            </button>
            <Link to="/login" className={styles.linkBtn} onClick={() => setSignInModal(false)}>
              Sign in
            </Link>
          </>
        }
      >
        <p>Please sign in to request this service.</p>
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
            className={styles.primaryBtn}
            onClick={() => {
              setSuccessModal(false)
              navigate('/my-orders')
            }}
          >
            View orders
          </button>
        }
      >
        <p>Your request was submitted successfully. You can track it under My Orders.</p>
      </Modal>
    </div>
  )
}
