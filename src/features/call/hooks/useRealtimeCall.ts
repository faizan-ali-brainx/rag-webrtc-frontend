import { useCallback, useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchRealtimeToken } from '../../../api/realtime.api'
import { showToast } from '../../toast/toastSlice'
import { REALTIME_CONNECT_FAILED } from '../call.constants'
import { createPeerConnection, negotiateSdp, teardownCall } from '../utils/webrtc.util'
import { attachRealtimeEvents } from './useRealtimeEvents'
import { callConnecting, callEnded, callErrored, callLive } from '../callSlice'
import type { CallConnection } from '../call.types'
import type { AppDispatch } from '../../../app/store'

/** Opens a peer connection, wires event handling, and negotiates the SDP. */
async function connect(dispatch: AppDispatch): Promise<CallConnection> {
  const session = await fetchRealtimeToken()
  const connection = await createPeerConnection()
  attachRealtimeEvents(connection.dataChannel, dispatch)
  await negotiateSdp(connection.pc, session.value, session.callsUrl)
  return connection
}

/** Selects the slice of call state the page needs to render. */
function useCallState() {
  return {
    status: useAppSelector((state) => state.call.status),
    transcript: useAppSelector((state) => state.call.transcript),
    isLookingUp: useAppSelector((state) => state.call.isLookingUp),
    error: useAppSelector((state) => state.call.error),
  }
}

/** Returns a callback that starts the call, dispatching status/error updates. */
function useStartCall(
  dispatch: AppDispatch,
  connectionRef: MutableRefObject<CallConnection | null>,
) {
  return useCallback(async () => {
    dispatch(callConnecting())
    try {
      connectionRef.current = await connect(dispatch)
      dispatch(callLive())
    } catch (err) {
      const message = err instanceof Error ? err.message : REALTIME_CONNECT_FAILED
      dispatch(callErrored(message))
      dispatch(showToast('error', message))
    }
  }, [dispatch, connectionRef])
}

/** Returns a callback that tears down the call and resets state to idle. */
function useEndCall(
  dispatch: AppDispatch,
  connectionRef: MutableRefObject<CallConnection | null>,
) {
  return useCallback(() => {
    teardownCall(connectionRef.current)
    connectionRef.current = null
    dispatch(callEnded())
  }, [dispatch, connectionRef])
}

/** Ensures the mic and peer connection are always released on unmount. */
function useCallCleanup(connectionRef: MutableRefObject<CallConnection | null>) {
  useEffect(() => {
    return () => {
      teardownCall(connectionRef.current)
      connectionRef.current = null
    }
  }, [connectionRef])
}

/** Controller hook for the call page: owns the WebRTC lifecycle and its state. */
export function useRealtimeCall() {
  const dispatch = useAppDispatch()
  const connectionRef = useRef<CallConnection | null>(null)
  const state = useCallState()
  const startCall = useStartCall(dispatch, connectionRef)
  const endCall = useEndCall(dispatch, connectionRef)
  useCallCleanup(connectionRef)

  return { ...state, startCall, endCall }
}
