import { Button } from '../../../components/Button'
import styles from './CallControls.module.scss'

interface CallControlsProps {
  isLive: boolean
  isConnecting: boolean
  onStart: () => void
  onEnd: () => void
}

/** Start/End buttons for the call, disabled appropriately by call status. */
export function CallControls({ isLive, isConnecting, onStart, onEnd }: CallControlsProps) {
  return (
    <div className={styles.controls}>
      {isLive ? (
        <Button variant="danger" onClick={onEnd}>
          End call
        </Button>
      ) : (
        <Button variant="primary" loading={isConnecting} onClick={onStart}>
          Start call
        </Button>
      )}
    </div>
  )
}
