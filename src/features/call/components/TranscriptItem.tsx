import type { TranscriptEntry } from '../call.types'
import styles from './TranscriptItem.module.scss'

/** A single transcript line, styled by speaker role. */
export function TranscriptItem({ entry }: { entry: TranscriptEntry }) {
  return (
    <div className={`${styles.row} ${styles[entry.role]}`}>
      <p className={styles.bubble}>{entry.text}</p>
    </div>
  )
}
