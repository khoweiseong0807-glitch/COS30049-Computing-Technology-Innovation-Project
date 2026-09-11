import { Link } from 'react-router-dom'
import { CLASSES, YEARLY_TOTALS } from '../../data/jpj'
import { CLASS_IDS, formatInt } from '../../components/ui'
import { BarChart, DonutChart, LineChart } from '../../components/Charts'
import { StepFooter } from '../../components/StepFooter'
import { mixForYear, seriesByClass } from '../../lib/dashboard'
import { useDashBase } from './DashLayout'

export default function DashboardHome({ withJourney = false }: { withJourney?: boolean }) {
  const base = useDashBase()
  const mix = mixForYear(2025, 'all')
  const total = YEARLY_TOTALS[2].total
  const typeSeries = seriesByClass('all', ['motorcar', 'motorcycle', 'goods'])
  const mixItems = CLASS_IDS.map((id) => ({
    label: CLASSES[id].label.split(' ')[0],
    value: mix[id],
    color: CLASSES[id].color,
  }))

  return (
    <div className="dash">
      <section className="page-head dash-hero">
        <p className="eyebrow">Dashboard</p>
        <h1>MOT registrations at a glance</h1>
        <p className="lede hero-lede">
          New motor vehicles registered in Malaysia, 2023–2025. Open a chart
          page from the menu to filter types, mix, states, or the 2026–2028
          forecast.
        </p>
      </section>

      <section className="stat-grid">
        <article className="stat">
          <span>New registrations, 2025</span>
          <strong>{formatInt(total)}</strong>
          <em>+3.8% vs 2024</em>
        </article>
        <article className="stat">
          <span>Motorcar</span>
          <strong>{formatInt(mix.motorcar)}</strong>
          <em>52.9% of 2025</em>
        </article>
        <article className="stat">
          <span>Motorcycle</span>
          <strong>{formatInt(mix.motorcycle)}</strong>
          <em>43.2% of 2025</em>
        </article>
        <article className="stat">
          <span>Goods</span>
          <strong>{formatInt(mix.goods)}</strong>
          <em>2.2% of 2025</em>
        </article>
      </section>

      <div className="dash-charts">
        <section className="panel">
          <h2>Vehicle types · 2023–2025</h2>
          <LineChart series={typeSeries} height={280} />
          <p className="legend">
            {typeSeries.map((s) => (
              <span key={s.label}>
                <i className="swatch" style={{ background: s.color }} /> {s.label}
              </span>
            ))}
          </p>
          <Link className="btn ghost" to={`${base}/types`}>
            Open with filters
          </Link>
        </section>
        <section className="panel">
          <h2>2025 mix</h2>
          <BarChart items={mixItems} height={220} />
          <DonutChart items={mixItems} center={formatInt(total)} />
          <p className="muted">Total new units in 2025</p>
          <Link className="btn ghost" to={`${base}/mix`}>
            Open mix page
          </Link>
        </section>
      </div>
      {withJourney && (
        <StepFooter step="overview" nextLabel="Continue to classification" />
      )}
    </div>
  )
}
