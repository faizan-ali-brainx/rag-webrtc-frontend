import styles from './LookupIndicator.module.scss'

/** Animated three-dot bubble shown while a document lookup is in flight. */
export function LookupIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  )
}
