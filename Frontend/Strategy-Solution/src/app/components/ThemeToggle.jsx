import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
    >
      {dark ? (
        <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            fill="currentColor"
            d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zM4.22 5.64l1.42 1.42 1.41-1.41L5.64 4.22 4.22 5.64zm12.13 12.13 1.42 1.42 1.41-1.41-1.41-1.41-1.42 1.4zM4.22 18.36l1.41-1.41 1.42 1.42-1.42 1.41-1.41-1.42zm12.13-12.13-1.41-1.41-1.42 1.42 1.41 1.41 1.42-1.42z"
          />
        </svg>
      ) : (
        <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            fill="currentColor"
            d="M9.37 5.51A7 7 0 0 0 12 19a7 7 0 0 0 5.51-11.37 6 6 0 1 1-8.14-8.14 7 7 0 0 0 .63 10.02z"
          />
        </svg>
      )}
    </button>
  )
}
