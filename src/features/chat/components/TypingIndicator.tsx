import styles from './TypingIndicator.module.scss'

/** Animated three-dot bubble shown while the assistant is generating a reply. */
export function TypingIndicator() {
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
