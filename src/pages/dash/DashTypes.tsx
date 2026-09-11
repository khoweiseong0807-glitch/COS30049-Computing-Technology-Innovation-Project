import { useState } from 'react'
import { CLASSES } from '../../data/jpj'
import { CLASS_IDS, formatInt } from '../../components/ui'
import { LineChart } from '../../components/Charts'
import {
  DASH_YEARS,
  classIdsFor,
  readYear,
  seriesByClass,
  type ClassFilter,
  type YearFilter,
} from '../../lib/dashboard'

export default function DashTypes() {
  const [year, setYear] = useState<YearFilter>('all')
  const [category, setCategory] = useState<ClassFilter>('all')
  const classes = classIdsFor(category)
  const series = seriesByClass(
    'all',
    category === 'all' ? ['motorcar', 'motorcycle', 'goods'] : classes,
  )
  const focus = year === 'all' ? null : year

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Vehicle types</p>
        <h1>Registration of vehicle types</h1>
        <p className="lede">
          New MOT registrations from 2023 to 2025. Choose a category to isolate
          one class on the line chart.
        </p>
      </header>
      <form className="dash-toolbar" onSubmit={(e) => e.preventDefault()}>
        <label className="dash-field">
          Year highlight
          <select value={year} onChange={(e) => setYear(readYear(e.target.value))}>
            <option value="all">Show all years</option>
            {DASH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          Vehicle category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ClassFilter)}
          >
            <option value="all">Motorcar, motorcycle, goods</option>
            {CLASS_IDS.map((id) => (
              <option key={id} value={id}>
                {CLASSES[id].label}
              </option>
            ))}
          </select>
        </label>
      </form>
      <section className="panel">
        <h2>Count by year</h2>
        <LineChart series={series} height={280} />
        <p className="legend">
          {series.map((s) => (
            <span key={s.label}>
              <i className="swatch" style={{ background: s.color }} /> {s.label}
            </span>
          ))}
        </p>
        {focus && (
          <ul className="result-list">
            {series.map((s) => {
              const i = DASH_YEARS.indexOf(focus)
              return (
                <li key={s.label}>
                  <span>{s.label} · {focus}</span>
                  <strong>{formatInt(s.points[i])}</strong>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
