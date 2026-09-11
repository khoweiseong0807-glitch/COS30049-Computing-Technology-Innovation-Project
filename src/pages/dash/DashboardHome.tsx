import { Link } from 'react-router-dom'
import { CLASSES, YEARLY_TOTALS } from '../../data/jpj'
import { CLASS_IDS, formatInt } from '../../components/ui'
import { BarChart, DonutChart, LineChart } from '../../components/Charts'
import { StepFooter } from '../../components/StepFooter'
import { mixForYear, seriesByClass } from '../../lib/dashboard'
import { useDashBase } from './DashLayout'

const PAGES = [
  {
    path: 'types',
    kicker: 'Line chart',
    title: 'Vehicle types over time',
    copy: 'Multi-line chart of motorcar, motorcycle, and goods. Filter by year and category.',
  },
  {
    path: 'mix',
    kicker: 'Bar + donut',
    title: 'Registration mix',
    copy: 'See the share as bars and a donut. Filter by year and search a class.',
  },
  {
    path: 'income',
    kicker: 'Income filter',
    title: 'Income bands',
    copy: 'Split MOT counts by B40, M40, and T20 as a prototype sketch.',
  },
  {
    path: 'states',
    kicker: 'State bars',
    title: 'States',
    copy: 'Motokar vs motosikal by state. Filter Peninsula or East Malaysia.',
  },
  {
    path: 'outlook',
    kicker: 'Forecast',
    title: 'Outlook',
    copy: 'Baseline 2026–2028 forecast from the 2023–2025 totals.',
  },
  {
    path: 'energy',
    kicker: 'Energy',
    title: 'Energy sketch',
    copy: 'Litres, kWh, and CO₂ envelope for the new-vehicle mix.',
  },
]

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
      <section className="hero dash-hero">
        <p className="eyebrow">Dashboard · Malaysian vehicle registration</p>
        <h1>See the numbers and the charts</h1>
        <p className="lede hero-lede">
          Line chart, bars, and donut for MOT 2025. Use the gold buttons for
          more chart pages and filters.
        </p>
        <div className="hero-actions">
          <Link className="btn" to={`${base}/types`}>
            Open vehicle types
          </Link>
          <Link className="btn ghost" to={`${base}/mix`}>
            Open mix
          </Link>
        </div>
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

      <section className="portal-grid dash-hub">
        {PAGES.map((page) => (
          <article key={page.path} className="panel portal">
            <span className="letter-lg">{page.kicker}</span>
            <h2>{page.title}</h2>
            <p className="muted">{page.copy}</p>
            <div className="hero-actions">
              <Link className="btn" to={`${base}/${page.path}`}>
                Open this page
              </Link>
            </div>
          </article>
        ))}
      </section>
      {withJourney && (
        <StepFooter step="overview" nextLabel="Continue to classification" />
      )}
    </div>
  )
}
