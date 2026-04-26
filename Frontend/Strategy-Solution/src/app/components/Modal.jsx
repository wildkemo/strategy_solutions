import styles from './Modal.module.css'

export function Modal({ open, title, children, onClose, actions, wide }) {
  if (!open) return null
  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`${styles.card} ${wide ? styles.wide : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        <div className={styles.body}>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>
  )
}
