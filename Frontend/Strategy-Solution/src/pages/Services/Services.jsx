import { useCallback, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useServicesQuery, useCategoriesQuery } from '../../lib/queries'
import { servicePath } from '../../lib/slug'
import { serviceImageUrl } from '../../lib/services'
import { Footer } from '../../components/Footer'
import styles from './Services.module.css'

export default function ServicesPage() {
  const { data: list = [], isLoading } = useServicesQuery()
  const { data: categories = [] } = useCategoriesQuery()
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
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

  return (
    <div className={styles.page}>
      {/* Decorative Background Orbs */}
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>

      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.textGradient}>Our Services</h1>
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
          <div className={`${styles.grid} ${styles.staggerIn}`} ref={cardRef}>
            {filteredServices.length === 0 ? (
              <p className={styles.muted}>
                No services found for this category.
              </p>
            ) : (
              filteredServices.map((s, idx) => {
                const img = serviceImageUrl(s)
                const slug = servicePath(s)
                const desc = (s.description || '').slice(0, 110)
                return (
                  <Link
                    key={s.id}
                    to={`/services/${slug}`}
                    className={styles.card}
                    onMouseMove={onCardMove}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className={styles.cardImageWrap}>
                      <div
                        className={styles.cardImage}
                        style={
                          img
                            ? { backgroundImage: `url(${img})` }
                            : undefined
                        }
                      />
                      <div className={styles.cardOverlay}></div>
                    </div>
                    <div className={styles.cardBody}>
                      <h2>{s.title || 'Service'}</h2>
                      <p>{desc}{desc.length >= 110 ? '…' : ''}</p>
                      <span className={styles.cardLink}>
                        Learn more <span className={styles.cardArrow}>→</span>
                      </span>
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
          <Link to="/contact" className={styles.primaryBtn}>
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
