import { Link, NavLink, Outlet } from 'react-router-dom'
import './friend.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/friend/historical', label: 'Historical Data', end: false },
  { to: '/friend/prediction', label: 'Prediction', end: false },
]

export default function FriendLayout() {
  return (
    <div className="friend-shell">
      <header className="friend-top">
        <div className="friend-brand">
          <Link to="/" className="friend-brand-home">
            <strong>Malaysia Vehicle Registration</strong>
            <small>Teammate wireframe version · COS30049 prototype</small>
          </Link>
          <Link className="friend-back" to="/">
            Back to JPJ Insight
          </Link>
        </div>
        <nav className="friend-nav" aria-label="Main menu">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'on' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="friend-main">
        <Outlet />
      </main>
      <footer className="friend-footer">
        Student prototype based on a teammate wireframe. Not an official JPJ
        website. MOT 2025 figures.
      </footer>
    </div>
  )
}
