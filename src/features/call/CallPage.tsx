import { CallControls } from './components/CallControls'
import { CallStatusBadge } from './components/CallStatusBadge'
import { TranscriptPanel } from './components/TranscriptPanel'
import { useRealtimeCall } from './hooks/useRealtimeCall'
import styles from './CallPage.module.scss'

/** Call page (view): talk to your documents over a live WebRTC voice call. */
export function CallPage() {
  const { status, transcript, isLookingUp, startCall, endCall } = useRealtimeCall()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Call</h1>
        <CallStatusBadge status={status} />
      </header>
      <TranscriptPanel transcript={transcript} isLookingUp={isLookingUp} />
      <CallControls
        isLive={status === 'live'}
        isConnecting={status === 'connecting'}
        onStart={startCall}
        onEnd={endCall}
      />
    </div>
  )
}
