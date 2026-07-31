import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import { AppRoutes } from './routes/AppRoutes'
import { ToastHost } from './features/toast/ToastHost'
import { useSessionRehydration } from './features/auth/hooks/useSessionRehydration'

/** Rehydrates the session, then renders the routed app and the toast host. */
function AppInner() {
  useSessionRehydration()
  return (
    <>
      <AppRoutes />
      <ToastHost />
    </>
  )
}

/** Root component: wires the Redux store and the router. */
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </Provider>
  )
}
