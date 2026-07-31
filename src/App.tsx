import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import { AppRoutes } from './routes/AppRoutes'
import { ToastHost } from './features/toast/ToastHost'
import { useSessionRehydration } from './features/auth/hooks/useSessionRehydration'
import { useApplyTheme } from './features/theme/useApplyTheme'

/** Rehydrates the session, applies the theme, then renders the app. */
function AppInner() {
  useSessionRehydration()
  useApplyTheme()
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
