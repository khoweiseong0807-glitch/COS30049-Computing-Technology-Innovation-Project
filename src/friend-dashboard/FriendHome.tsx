import { Link } from 'react-router-dom'
import { YEARLY_TOTALS } from '../data/jpj'
import { formatInt } from '../components/ui'

export default function FriendHome() {
  const latest = YEARLY_TOTALS[YEARLY_TOTALS.length - 1]

  return (
    <>
      <section className="friend-intro">
        <p className="eyebrow">Home</p>
        <h1>Introduction to this dashboard</h1>
        <p>
          This version follows the teammate wireframe: a site name at the top,
          a main menu with three pages, and a selected button that looks
          different so users know where they are.
        </p>
        <p>
          Source dataset: Ministry of Transport (MOT) Malaysia new motor
          vehicle registrations. 2025 total is {formatInt(latest.total)} units
          (+3.8% vs 2024). This is a COS30049 student prototype, not an
          official JPJ product.
        </p>
      </section>
      <section className="friend-kpis">
        {YEARLY_TOTALS.map((row) => (
          <article className="friend-kpi" key={row.year}>
            <span>New registrations, {row.year}</span>
            <strong>{formatInt(row.total)}</strong>
          </article>
        ))}
      </section>
      <div className="friend-actions">
        <Link className="friend-action friend-action-primary" to="/friend/historical">
          Open historical data
        </Link>
        <Link className="friend-action" to="/friend/prediction">
          Open prediction
        </Link>
      </div>
    </>
  )
}
