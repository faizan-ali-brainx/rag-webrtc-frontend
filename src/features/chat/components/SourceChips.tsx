import type { Source } from '../../../types/api'
import styles from './SourceChips.module.scss'

/** A single citation chip; hovering shows the snippet. */
export function SourceChip({ source }: { source: Source }) {
  return (
    <span className={styles.chip} title={source.snippet}>
      {source.filename} #{source.chunkIndex}
    </span>
  )
}

/** The row of citation chips under an assistant message. */
export function SourceChips({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return null
  }
  return (
    <div className={styles.chips}>
      {sources.map((source) => (
        <SourceChip key={`${source.documentId}-${source.chunkIndex}`} source={source} />
      ))}
    </div>
  )
}
