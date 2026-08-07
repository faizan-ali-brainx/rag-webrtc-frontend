import { useEffect, useRef } from 'react'
import type { TranscriptEntry } from '../call.types'
import { TranscriptItem } from './TranscriptItem'
import { LookupIndicator } from './LookupIndicator'
import styles from './TranscriptPanel.module.scss'

interface TranscriptPanelProps {
  transcript: TranscriptEntry[]
  isLookingUp: boolean
}

/** Scrollable transcript list; shows a lookup indicator and auto-scrolls to bottom. */
export function TranscriptPanel({ transcript, isLookingUp }: TranscriptPanelProps) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript.length, isLookingUp])

  return (
    <div className={styles.panel}>
      {transcript.map((entry) => (
        <TranscriptItem key={entry.id} entry={entry} />
      ))}
      {isLookingUp ? <LookupIndicator /> : null}
      <div ref={endRef} />
    </div>
  )
}
