import { NavLink, Outlet, useLocation } from 'react-router-dom'

export function useDashBase() {
  const { pathname } = useLocation()
  return pathname.startsWith('/app') ? '/app/overview' : '/dashboard'
}

function links(base: string) {
  return [
    { to: '/', label: 'Home', end: true },
    { to: `${base}/combined`, label: 'Historical' },
    { to: `${base}/types`, label: 'Vehicle types' },
    { to: `${base}/mix`, label: 'Mix' },
    { to: `${base}/states`, label: 'States' },
    { to: `${base}/prediction`, label: 'Prediction' },
  ]
}

export default function DashLayout() {
  const base = useDashBase()
  return (
    <div className="dash-wrap">
      <nav className="dash-nav" aria-label="Dashboard pages">
        {links(base).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `dash-nav-link ${isActive ? 'on' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
