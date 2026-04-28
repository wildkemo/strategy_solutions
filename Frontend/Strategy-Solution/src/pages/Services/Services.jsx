import { useCallback, useRef, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useServicesQuery, useCategoriesQuery } from '../../lib/queries'
import { servicePath } from '../../lib/slug'
import { serviceImageUrl } from '../../lib/services'
import { Footer } from '../../components/Footer'
import { Modal } from '../../components/Modal'
import styles from './Services.module.css'

export default function ServicesPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { data: list = [], isLoading } = useServicesQuery()
  const { data: categories = [] } = useCategoriesQuery()
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [authModal, setAuthModal] = useState(false)
  const cardRef = useRef(null)

  const filteredServices = useMemo(() => {
    if (!selectedCategoryId) return list
    return list.filter((s) => s.categoryId === selectedCategoryId)
  }, [list, selectedCategoryId])

  const onCardMove = useCallback((e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])

  const requestClick = () => {
    if (!isAuthenticated) {
      setAuthModal(true)
      return
    }
    navigate('/request-service')
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1>Our Services</h1>
          <p>
            Discover engagements tailored to your goals—from diagnostic sprints
            to multi-year transformation programs.
          </p>
        </header>

        {categories.length > 0 && (
          <div className={styles.categories}>
            <button
              type="button"
              className={!selectedCategoryId ? styles.chipActive : styles.chip}
              onClick={() => setSelectedCategoryId(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={selectedCategoryId === cat.id ? styles.chipActive : styles.chip}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className={styles.muted}>Loading services…</p>
        ) : (
          <div className={`${styles.grid} animate-slide-up`} ref={cardRef}>
            {filteredServices.length === 0 ? (
              <p className={styles.muted}>
                No services found for this category.
              </p>
            ) : (
              filteredServices.map((s) => {
                const img = serviceImageUrl(s)
                const slug = servicePath(s)
                const desc = (s.description || '').slice(0, 140)
                return (
                  <Link
                    key={s.id}
                    to={`/services/${slug}`}
                    className={styles.card}
                    onMouseMove={onCardMove}
                  >
                    <div
                      className={styles.cardImage}
                      style={
                        img
                          ? { backgroundImage: `url(${img})` }
                          : undefined
                      }
                    />
                    <div className={styles.cardBody}>
                      <h2>{s.title || 'Service'}</h2>
                      <p>{desc}{desc.length >= 140 ? '…' : ''}</p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        <div className={styles.footerCta}>
          <h2>Ready to get started?</h2>
          <p>Tell us about your priorities and we will follow up quickly.</p>
          <button type="button" className={styles.primaryBtn} onClick={requestClick}>
            Request a service
          </button>
        </div>
      </div>

      <Footer />

      <Modal
        open={authModal}
        title="Sign in required"
        onClose={() => setAuthModal(false)}
        actions={
          <>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => setAuthModal(false)}
            >
              Close
            </button>
            <Link to="/login" className={styles.primaryLink} onClick={() => setAuthModal(false)}>
              Sign in
            </Link>
          </>
        }
      >
        <p>Please sign in to submit a service request.</p>
      </Modal>
    </div>
  )
}
