import { ROLE_LABEL, isOwner } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import { StepFooter } from '../components/StepFooter'

export default function Welcome() {
  const { user } = useAuth()
  const owner = user ? isOwner(user.role) : false

  if (owner) {
    return (
      <div className="stack">
        <header className="page-head">
          <p className="eyebrow">A · Start</p>
          <h1>Hi{user ? `, ${user.name.split(' ')[0]}` : ''} — let’s look at your vehicle</h1>
          <p className="lede">
            A short, personal check: add the vehicle you drive or ride, see the
            class it most likely belongs to, then get a simple energy picture
            for the year. Nothing here is sent to JPJ.
          </p>
        </header>
        <div className="welcome-cards">
          <article className="welcome-card">
            <span>1 · Vehicle</span>
            <h2>Your plate and specs</h2>
            <p className="muted">Number plate, state, and a few details from the registration card.</p>
          </article>
          <article className="welcome-card">
            <span>2 · Class</span>
            <h2>What type it is</h2>
            <p className="muted">Motorcycle, motorcar, goods, or another JPJ-style class — in plain language.</p>
          </article>
          <article className="welcome-card">
            <span>3 · Energy</span>
            <h2>Fuel or electricity</h2>
            <p className="muted">Based on how far you usually go in a year. You can change the kilometres.</p>
          </article>
          <article className="welcome-card">
            <span>4 · Record</span>
            <h2>A summary to keep</h2>
            <p className="muted">Your own snapshot — not a national report, and not an official document.</p>
          </article>
        </div>
        <StepFooter step="u-welcome" nextLabel="Add my vehicle" />
      </div>
    )
  }

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">A · Start · {user ? ROLE_LABEL[user.role] : 'Officer'}</p>
        <h1>Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}</h1>
        <p className="lede">
          Officer / analyst workspace. Work through mix, classify, predict,
          energy, and a national briefing.
        </p>
      </header>
      <section className="panel">
        <h2>What you will do</h2>
        <ol className="plain-list">
          <li>Read the 2025 JPJ / MOT dashboard with charts and filters.</li>
          <li>Classify example vehicles with feature attribution.</li>
          <li>Inspect the 2026–2028 baseline forecast.</li>
          <li>Estimate fleet energy and issue a briefing.</li>
        </ol>
      </section>
      <StepFooter step="welcome" nextLabel="Open the dashboard" />
    </div>
  )
}
