import { Navigate, Outlet } from 'react-router-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { JourneyProvider } from './context/JourneyContext'
import { AppShell, PublicShell } from './components/Shell'
import { homePath, isOwner } from './lib/auth'
import Landing from './pages/Landing'
import DashLayout from './pages/dash/DashLayout'
import DashboardHome from './pages/dash/DashboardHome'
import DashTypes from './pages/dash/DashTypes'
import DashMix from './pages/dash/DashMix'
import DashIncome from './pages/dash/DashIncome'
import DashStates from './pages/dash/DashStates'
import DashOutlook from './pages/dash/DashOutlook'
import DashEnergy from './pages/dash/DashEnergy'
import Login from './pages/Login'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import Classify from './pages/Classify'
import Trends from './pages/Trends'
import Energy from './pages/Energy'
import Report from './pages/Report'
import Done from './pages/Done'
import MyVehicle from './pages/MyVehicle'
import UserRecord from './pages/UserRecord'

function RequireAuth() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <JourneyProvider key={user.email}>
      <Outlet />
    </JourneyProvider>
  )
}

function StaffGate() {
  const { user } = useAuth()
  if (user && isOwner(user.role)) return <Navigate to="/user/welcome" replace />
  return <AppShell />
}

function OwnerGate() {
  const { user } = useAuth()
  if (user && !isOwner(user.role)) return <Navigate to="/app/welcome" replace />
  return <AppShell />
}

function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to={homePath(user.role)} replace />
  return children
}

function dashboardPages(withJourney: boolean) {
  return (
    <>
      <Route index element={<DashboardHome withJourney={withJourney} />} />
      <Route path="types" element={<DashTypes />} />
      <Route path="mix" element={<DashMix />} />
      <Route path="income" element={<DashIncome />} />
      <Route path="states" element={<DashStates />} />
      <Route path="outlook" element={<DashOutlook />} />
      <Route path="energy" element={<DashEnergy />} />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashLayout />}>
          {dashboardPages(false)}
        </Route>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthed>
              <Register />
            </RedirectIfAuthed>
          }
        />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<StaffGate />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="overview" element={<DashLayout />}>
            {dashboardPages(true)}
          </Route>
          <Route path="classify" element={<Classify />} />
          <Route path="trends" element={<Trends />} />
          <Route path="energy" element={<Energy />} />
          <Route path="report" element={<Report />} />
          <Route path="done" element={<Done />} />
        </Route>
        <Route path="/user" element={<OwnerGate />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="vehicle" element={<MyVehicle />} />
          <Route path="classify" element={<Classify />} />
          <Route path="energy" element={<Energy />} />
          <Route path="record" element={<UserRecord />} />
          <Route path="done" element={<Done />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
