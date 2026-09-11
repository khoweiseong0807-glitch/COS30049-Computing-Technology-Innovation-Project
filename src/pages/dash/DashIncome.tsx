import { useState } from 'react'
import { CLASSES } from '../../data/jpj'
import { CLASS_IDS, formatInt } from '../../components/ui'
import { BarChart } from '../../components/Charts'
import {
  DASH_YEARS,
  INCOME_LABEL,
  mixForYear,
  type DashYear,
  type IncomeFilter,
} from '../../lib/dashboard'

export default function DashIncome() {
  const [year, setYear] = useState<DashYear>(2025)
  const [income, setIncome] = useState<IncomeFilter>('all')
  const mix = mixForYear(year, income)
  const total = CLASS_IDS.reduce((s, id) => s + mix[id], 0)
  const items = CLASS_IDS.slice(0, 4).map((id) => ({
    label: CLASSES[id].label.split(' ')[0],
    value: mix[id],
    color: CLASSES[id].color,
  }))
  const bands: IncomeFilter[] = ['b40', 'm40', 't20']

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Income</p>
        <h1>Income band filter</h1>
        <p className="lede">
          B40 / M40 / T20 splits MOT class counts as a sketch so you can compare
          bands. This is not official household-income data from JPJ.
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
          Income
          <select
            value={income}
            onChange={(e) => setIncome(e.target.value as IncomeFilter)}
          >
            <option value="all">All bands</option>
            <option value="b40">B40</option>
            <option value="m40">M40</option>
            <option value="t20">T20</option>
          </select>
        </label>
      </form>
      <section className="panel">
        <h2>
          {year} · {INCOME_LABEL[income]} · {formatInt(total)} units
        </h2>
        <BarChart items={items} height={240} />
      </section>
      <section className="panel">
        <h2>Compare bands · motorcar vs motorcycle</h2>
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th>Motorcar</th>
              <th>Motorcycle</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band) => {
              const row = mixForYear(year, band)
              return (
                <tr key={band}>
                  <td>{INCOME_LABEL[band]}</td>
                  <td>{formatInt(row.motorcar)}</td>
                  <td>{formatInt(row.motorcycle)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
