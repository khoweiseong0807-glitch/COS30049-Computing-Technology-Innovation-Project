import { useState } from 'react'
import { CLASSES } from '../../data/jpj'
import { fleetEnergySketch } from '../../lib/ml'
import { formatInt } from '../../components/ui'
import { BarChart } from '../../components/Charts'
import { DASH_YEARS, type DashYear } from '../../lib/dashboard'

export default function DashEnergy() {
  const [year, setYear] = useState<DashYear>(2025)
  const [metric, setMetric] = useState<'millionLitres' | 'gwh' | 'ktCo2'>(
    'millionLitres',
  )
  const rows = fleetEnergySketch(year)
  const items = rows.map((row) => ({
    label: `${CLASSES[row.classId].label.split(' ')[0]} ${row.fuel}`,
    value: row[metric],
    color: CLASSES[row.classId].color,
  }))
  const metricLabel =
    metric === 'millionLitres' ? 'Million litres' : metric === 'gwh' ? 'GWh' : 'kt CO₂'

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Energy</p>
        <h1>Energy sketch for the new-vehicle mix</h1>
        <p className="lede">
          Count × default kilometres × intensity. Filter the year and which
          energy measure to plot.
        </p>
      </header>
      <form className="panel form dash-filters" onSubmit={(e) => e.preventDefault()}>
        <label>
          Year
          <select value={year} onChange={(e) => setYear(Number(e.target.value) as DashYear)}>
            {DASH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label>
          Chart measure
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as typeof metric)}
          >
            <option value="millionLitres">Million litres</option>
            <option value="gwh">GWh</option>
            <option value="ktCo2">kt CO₂</option>
          </select>
        </label>
      </form>
      <section className="panel">
        <h2>{metricLabel} · {year}</h2>
        <BarChart
          items={items.map((item) => ({
            ...item,
            label: item.label.slice(0, 10),
          }))}
          height={260}
        />
      </section>
      <section className="panel">
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Vehicles</th>
              <th>Million L</th>
              <th>GWh</th>
              <th>kt CO₂</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.classId}-${row.fuel}`}>
                <td>
                  {CLASSES[row.classId].label} · {row.fuel}
                </td>
                <td>{formatInt(row.vehicles)}</td>
                <td>{row.millionLitres.toFixed(1)}</td>
                <td>{row.gwh.toFixed(1)}</td>
                <td>{row.ktCo2.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
