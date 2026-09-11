import { useMemo, useState } from 'react'
import { CLASSES } from '../../data/jpj'
import { CLASS_IDS, formatInt } from '../../components/ui'
import { BarChart, DonutChart } from '../../components/Charts'
import {
  DASH_YEARS,
  displayYear,
  mixForYear,
  readYear,
  type YearFilter,
} from '../../lib/dashboard'

export default function DashMix() {
  const [year, setYear] = useState<YearFilter>(2025)
  const [query, setQuery] = useState('')
  const viewYear = displayYear(year)
  const mix = mixForYear(viewYear, 'all')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CLASS_IDS.filter((id) => {
      if (!q) return true
      const c = CLASSES[id]
      return c.label.toLowerCase().includes(q) || c.malay.toLowerCase().includes(q)
    }).map((id) => ({
      id,
      count: mix[id],
    }))
  }, [mix, query])
  const total = rows.reduce((sum, row) => sum + row.count, 0)
  const items = rows.map((row) => ({
    label: CLASSES[row.id].label.split(' ')[0],
    value: row.count,
    color: CLASSES[row.id].color,
  }))

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Mix</p>
        <h1>Registration mix</h1>
        <p className="lede">
          Share of each vehicle class in a single MOT year. Search by English or
          Malay name.
        </p>
      </header>
      <form className="dash-toolbar" onSubmit={(e) => e.preventDefault()}>
        <label className="dash-field">
          Year
          <select value={year} onChange={(e) => setYear(readYear(e.target.value))}>
            {DASH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field dash-field-grow">
          Search class
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Motosikal, goods…"
          />
        </label>
      </form>
      <div className="split">
        <section className="panel">
          <h2>Bar chart · {viewYear}</h2>
          <BarChart items={items} height={240} />
        </section>
        <section className="panel">
          <h2>Donut · share</h2>
          <DonutChart items={items} center={formatInt(total)} />
          <p className="muted">Total new units in {viewYear}</p>
        </section>
      </div>
      <section className="panel">
        <h2>Result</h2>
        <ul className="result-list">
          {rows.map((row) => (
            <li key={row.id}>
              <span>
                {CLASSES[row.id].label} · {CLASSES[row.id].malay}
              </span>
              <strong>
                {formatInt(row.count)} ({total ? ((row.count / total) * 100).toFixed(1) : '0.0'}%)
              </strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
