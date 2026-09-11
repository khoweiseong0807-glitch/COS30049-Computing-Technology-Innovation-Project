import { useEffect, useMemo, useState } from 'react'
import { CLASSES, STATES } from '../../data/jpj'
import { BarChart, DonutChart, LineChart } from '../../components/Charts'
import { CLASS_IDS, formatInt } from '../../components/ui'
import {
  DASH_YEARS,
  INCOME_LABEL,
  displayYear,
  mixForYear,
  readYear,
  seriesByClass,
  totalForYear,
  type ClassFilter,
  type IncomeFilter,
  type YearFilter,
} from '../../lib/dashboard'

const EAST = new Set(['Sabah', 'Sarawak', 'W.P. Labuan'])

type Region = 'all' | 'peninsula' | 'east'
type Modal = 'line' | 'bar' | 'donut' | 'table' | null

export default function DashCombined() {
  const [year, setYear] = useState<YearFilter>('all')
  const [region, setRegion] = useState<Region>('all')
  const [income, setIncome] = useState<IncomeFilter>('all')
  const [klass, setKlass] = useState<ClassFilter>('all')
  const [modal, setModal] = useState<Modal>(null)

  const selectedYears = year === 'all' ? [...DASH_YEARS] : [year]
  const mixYear = displayYear(year)
  const classes = klass === 'all' ? CLASS_IDS : [klass]
  const fullSeries = seriesByClass(income, classes)
  const series = fullSeries.map((row) => ({
    ...row,
    points: selectedYears.map((item) => row.points[DASH_YEARS.indexOf(item)]),
  }))
  const mix = mixForYear(mixYear, income)
  const mixItems = classes.map((id) => ({
    label: CLASSES[id].label.split(' ')[0],
    value: mix[id],
    color: CLASSES[id].color,
  }))
  const mixTotal = classes.reduce((sum, id) => sum + mix[id], 0)

  const stateRows = useMemo(
    () =>
      STATES.filter((s) => {
        if (region === 'east') return EAST.has(s.name)
        if (region === 'peninsula') return !EAST.has(s.name)
        return true
      }),
    [region],
  )

  const reset = () => {
    setYear('all')
    setRegion('all')
    setIncome('all')
    setKlass('all')
  }

  useEffect(() => {
    if (!modal) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Historical data</p>
        <h1>Charts, filters, and the data table</h1>
        <p className="lede">
          Use the Year box the same way as Location: pick all years, or one
          MOT year. Then set Average income and Vehicle types. Enlarge a chart
          to read it larger, or open the Data table. Income bands are a
          prototype sketch, not official JPJ household-income data.
        </p>
      </header>

      <form className="dash-toolbar" onSubmit={(e) => e.preventDefault()}>
        <label className="dash-field">
          Year
          <select value={year} onChange={(e) => setYear(readYear(e.target.value))}>
            <option value="all">All years</option>
            {DASH_YEARS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          Location
          <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
            <option value="all">All states</option>
            <option value="peninsula">Peninsula</option>
            <option value="east">East Malaysia</option>
          </select>
        </label>
        <label className="dash-field">
          Average income
          <select value={income} onChange={(e) => setIncome(e.target.value as IncomeFilter)}>
            <option value="all">{INCOME_LABEL.all}</option>
            <option value="b40">{INCOME_LABEL.b40}</option>
            <option value="m40">{INCOME_LABEL.m40}</option>
            <option value="t20">{INCOME_LABEL.t20}</option>
          </select>
        </label>
        <label className="dash-field">
          Vehicle types
          <select value={klass} onChange={(e) => setKlass(e.target.value as ClassFilter)}>
            <option value="all">All types</option>
            {CLASS_IDS.map((id) => (
              <option key={id} value={id}>
                {CLASSES[id].label}
              </option>
            ))}
          </select>
        </label>
        <button className="btn ghost dash-toolbar-reset" type="button" onClick={reset}>
          Reset view
        </button>
      </form>

      <div className="dash-fig4-charts">
        <section className="panel">
          <div className="dash-chart-head">
            <h2>Vehicle types · {year === 'all' ? '2023–2025' : year}</h2>
            <button className="dash-enlarge" type="button" onClick={() => setModal('line')}>
              Enlarge
            </button>
          </div>
          <LineChart series={series} years={selectedYears} height={320} />
        </section>
        <div className="dash-fig4-side">
          <section className="panel">
            <div className="dash-chart-head">
              <h2>Mix · {mixYear}</h2>
              <button className="dash-enlarge" type="button" onClick={() => setModal('bar')}>
                Enlarge
              </button>
            </div>
            <BarChart items={mixItems} height={150} />
          </section>
          <section className="panel">
            <div className="dash-chart-head">
              <h2>Share · {mixYear}</h2>
              <button className="dash-enlarge" type="button" onClick={() => setModal('donut')}>
                Enlarge
              </button>
            </div>
            <DonutChart items={mixItems} center={formatInt(mixTotal)} />
          </section>
        </div>
      </div>

      <div className="hero-actions">
        <button className="btn" type="button" onClick={() => setModal('table')}>
          Data table
        </button>
        <p className="muted" style={{ margin: 0, alignSelf: 'center' }}>
          {mixYear} mix total: {formatInt(mixTotal)} · {INCOME_LABEL[income]} ·{' '}
          {stateRows.length} states in this location.
        </p>
      </div>

      {modal && (
        <div
          className="dash-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setModal(null)}
        >
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-chart-head">
              <h2>
                {modal === 'line' &&
                  `Vehicle types · ${year === 'all' ? '2023–2025' : year}`}
                {modal === 'bar' && `Mix · ${mixYear}`}
                {modal === 'donut' && `Share · ${mixYear}`}
                {modal === 'table' && 'Data table'}
              </h2>
              <button className="btn ghost compact" type="button" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
            {modal === 'line' && <LineChart series={series} years={selectedYears} height={320} />}
            {modal === 'bar' && <BarChart items={mixItems} height={280} />}
            {modal === 'donut' && <DonutChart items={mixItems} center={formatInt(mixTotal)} />}
            {modal === 'table' && (
              <>
                <h3>
                  Historical mix · {mixYear} · {INCOME_LABEL[income]}
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Malay</th>
                      <th>Year</th>
                      <th>Units</th>
                      <th>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLASS_IDS.map((id) => (
                      <tr key={id}>
                        <td>{CLASSES[id].label}</td>
                        <td>{CLASSES[id].malay}</td>
                        <td>{mixYear}</td>
                        <td>{formatInt(mix[id])}</td>
                        <td>
                          {((mix[id] / Math.max(totalForYear(mixYear, income), 1)) * 100).toFixed(
                            1,
                          )}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="muted">
                  Year filter: {year === 'all' ? 'all years' : year}. Location
                  filter ({region}) covers {stateRows.length} states.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
