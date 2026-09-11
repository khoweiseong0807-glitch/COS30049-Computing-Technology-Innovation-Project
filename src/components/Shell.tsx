import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ROLE_LABEL, homePath, isOwner } from '../lib/auth'
import { stepsFor, type StepId } from '../lib/journey'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export function PublicShell() {
  const { user } = useAuth()
  return (
    <div className="site public-site">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="mark">JPJ</span>
          <div>
            <strong>JPJ Insight</strong>
            <small>For owners and officers</small>
          </div>
        </Link>
        <div className="top-actions">
          <Link className="btn ghost" to="/dashboard">
            Dashboard
          </Link>
          {user ? (
            <Link className="btn" to={homePath(user.role)}>
              Continue
            </Link>
          ) : (
            <>
              <Link className="btn ghost" to="/login?as=owner">
                Log in
              </Link>
              <Link className="btn" to="/register?as=owner">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        COS30049 prototype · Not an official JPJ website
      </footer>
    </div>
  )
}

export function AppShell() {
  const { user, logout } = useAuth()
  const { state } = useJourney()
  const navigate = useNavigate()
  const location = useLocation()
  const owner = user ? isOwner(user.role) : false
  const steps = user ? stepsFor(user.role) : []
  const firstName = user?.name.split(' ')[0] ?? 'there'

  const signOut = () => {
    logout()
    navigate('/')
  }

  const navLinks = steps.map((step) => {
    const done = state.completed.includes(step.id as StepId)
    const short = 'short' in step ? step.short : step.label
    return (
      <NavLink
        key={step.id}
        to={step.path}
        className={({ isActive }) =>
          `nav ${isActive ? 'on' : ''} ${done ? 'done' : ''}`
        }
      >
        <span className="letter">{step.letter}</span>
        <span className="nav-full">{step.label}</span>
        <span className="nav-short">{short}</span>
      </NavLink>
    )
  })

  if (owner) {
    return (
      <div className="shell owner-shell">
        <header className="owner-top">
          <Link to="/user/welcome" className="brand">
            <span className="mark">JPJ</span>
            <div>
              <strong>My vehicle</strong>
              <small>Hi, {firstName}</small>
            </div>
          </Link>
          <button type="button" className="btn ghost compact" onClick={signOut}>
            Sign out
          </button>
        </header>
        <ol className="stepper owner-progress" aria-label="Your steps">
          {steps.map((step) => {
            const active = location.pathname === step.path
            const done = state.completed.includes(step.id as StepId)
            return (
              <li key={step.id} className={active ? 'active' : done ? 'complete' : ''}>
                <NavLink to={step.path}>
                  {step.letter}
                </NavLink>
              </li>
            )
          })}
        </ol>
        <main className="owner-main">
          <Outlet />
        </main>
        <nav className="owner-tabs" aria-label="Owner menu">
          {navLinks}
        </nav>
      </div>
    )
  }

  return (
    <div className="shell">
      <aside>
        <Link to="/" className="brand">
          <span className="mark">JPJ</span>
          <div>
            <strong>JPJ Insight</strong>
            <small>{user ? ROLE_LABEL[user.role] : 'Prototype'}</small>
          </div>
        </Link>
        <p className="session">
          Signed in as <b>{user?.name}</b>
        </p>
        <nav>{navLinks}</nav>
        <button type="button" className="btn ghost logout" onClick={signOut}>
          Sign out
        </button>
      </aside>
      <main>
        <ol className="stepper" aria-label="Journey">
          {steps.map((step) => {
            const active =
              location.pathname === step.path ||
              location.pathname.startsWith(`${step.path}/`)
            const done = state.completed.includes(step.id as StepId)
            return (
              <li key={step.id} className={active ? 'active' : done ? 'complete' : ''}>
                <NavLink to={step.path}>
                  {step.letter}. {step.label}
                </NavLink>
              </li>
            )
          })}
        </ol>
        <Outlet />
      </main>
    </div>
  )
}
