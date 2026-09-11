import { useMemo, useState } from 'react'
import { CLASSES, STATES } from '../data/jpj'
import { BarChart, DonutChart, LineChart } from '../components/Charts'
import { CLASS_IDS, formatInt } from '../components/ui'
import {
  DASH_YEARS,
  type ClassFilter,
  type DashYear,
  type IncomeFilter,
  mixForYear,
  seriesByClass,
  totalForYear,
} from '../lib/dashboard'

const EAST = new Set(['Sabah', 'Sarawak', 'W.P. Labuan'])

export default function FriendHistorical() {
  const [income, setIncome] = useState<IncomeFilter>('all')
  const [region, setRegion] = useState<'all' | 'peninsula' | 'east'>('all')
  const [year, setYear] = useState<DashYear>(2025)
  const [klass, setKlass] = useState<ClassFilter>('all')
  const [modal, setModal] = useState<'chart1' | 'chart2' | 'chart3' | 'table' | null>(
    null,
  )

  const classes = klass === 'all' ? CLASS_IDS : [klass]
  const series = seriesByClass(income, classes)
  const mix = mixForYear(year, income)
  const mixItems = classes.map((id) => ({
    label: CLASSES[id].label.split(' ')[0],
    value: mix[id],
    color: CLASSES[id].color,
  }))
  const total = classes.reduce((sum, id) => sum + mix[id], 0)
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
    setIncome('all')
    setRegion('all')
    setYear(2025)
    setKlass('all')
  }

  return (
    <>
      <section className="friend-intro">
        <p className="eyebrow">Historical Data</p>
        <h1>Charts, filters, and the data table</h1>
        <p>
          Use the dropdowns to slice MOT counts by income band, location, year,
          and vehicle type. Enlarge a chart to read it bigger, or open the data
          table. Income bands are a prototype sketch, not official JPJ
          household-income data. The state split is illustrative.
        </p>
      </section>

      <form className="friend-card friend-filters" onSubmit={(e) => e.preventDefault()}>
        <label>
          Average income
          <select value={income} onChange={(e) => setIncome(e.target.value as IncomeFilter)}>
            <option value="all">All bands</option>
            <option value="b40">B40</option>
            <option value="m40">M40</option>
            <option value="t20">T20</option>
          </select>
        </label>
        <label>
          Location
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as typeof region)}
          >
            <option value="all">All states</option>
            <option value="peninsula">Peninsula</option>
            <option value="east">East Malaysia</option>
          </select>
        </label>
        <label>
          Years
          <select value={year} onChange={(e) => setYear(Number(e.target.value) as DashYear)}>
            {DASH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label>
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
        <button className="friend-reset" type="button" onClick={reset}>
          Reset view
        </button>
      </form>

      <div className="friend-charts">
        <section className="friend-card">
          <div className="friend-chart-head">
            <h2>Vehicle types · 2023–2025</h2>
            <button className="friend-enlarge" type="button" onClick={() => setModal('chart1')}>
              Enlarge
            </button>
          </div>
          <LineChart series={series} height={200} />
        </section>
        <section className="friend-card">
          <div className="friend-chart-head">
            <h2>Mix · {year}</h2>
            <button className="friend-enlarge" type="button" onClick={() => setModal('chart2')}>
              Enlarge
            </button>
          </div>
          <BarChart items={mixItems} height={200} />
        </section>
        <section className="friend-card">
          <div className="friend-chart-head">
            <h2>Share · {year}</h2>
            <button className="friend-enlarge" type="button" onClick={() => setModal('chart3')}>
              Enlarge
            </button>
          </div>
          <DonutChart items={mixItems} center={formatInt(total)} />
        </section>
      </div>

      <div className="friend-actions">
        <button className="friend-action" type="button" onClick={() => setModal('table')}>
          Data table
        </button>
        <span className="muted">
          {year} total for this view: {formatInt(totalForYear(year, income))}
        </span>
      </div>

      {modal && (
        <div className="friend-overlay" role="dialog" aria-modal="true">
          <div className="friend-modal">
            <div className="friend-modal-head">
              <h2>
                {modal === 'chart1' && 'Vehicle types · 2023–2025'}
                {modal === 'chart2' && `Mix · ${year}`}
                {modal === 'chart3' && `Share · ${year}`}
                {modal === 'table' && 'Data table'}
              </h2>
              <button className="friend-close" type="button" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
            {modal === 'chart1' && <LineChart series={series} height={320} />}
            {modal === 'chart2' && <BarChart items={mixItems} height={280} />}
            {modal === 'chart3' && <DonutChart items={mixItems} center={formatInt(total)} />}
            {modal === 'table' && (
              <table className="friend-table">
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
                      <td>{year}</td>
                      <td>{formatInt(mix[id])}</td>
                      <td>{((mix[id] / Math.max(totalForYear(year, income), 1)) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {modal === 'table' && (
              <p className="muted">
                Location filter ({region}) applies to the state sketch on this
                page. Showing {stateRows.length} states in that region.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
