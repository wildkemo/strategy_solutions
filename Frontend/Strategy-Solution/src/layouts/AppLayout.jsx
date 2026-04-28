import { Outlet } from 'react-router-dom'
import { ActivationBanner } from '../components/ActivationBanner'
import { Navbar } from '../components/Navbar'
import { SessionRefresher } from '../components/SessionRefresher'

export function AppLayout() {
  return (
    <>
      <SessionRefresher />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        <Outlet />
      </main>
      <ActivationBanner />
    </>
  )
}
