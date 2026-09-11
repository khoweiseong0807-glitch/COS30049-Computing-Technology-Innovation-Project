import { useMemo, useState, type FormEvent } from 'react'
import { YEARLY_TOTALS } from '../../data/jpj'
import { BarChart } from '../../components/Charts'
import { formatInt } from '../../components/ui'
import { forecastTotals } from '../../lib/ml'

const BAR_COLORS = ['#2563eb', '#dc4a26', '#d4a017']

function scaleFrom(income: string, population: string) {
  const pop = Number(population) || 33_500_000
  const inc = Number(income) || 5000
  return Math.max(0.55, Math.min(1.75, 0.6 * (pop / 33_500_000) + 0.4 * (inc / 5000)))
}

export default function DashPrediction() {
  const [income, setIncome] = useState('5000')
  const [population, setPopulation] = useState('33500000')
  const [applied, setApplied] = useState<{ income: string; population: string } | null>(
    null,
  )
  const [modal, setModal] = useState<'chart' | 'table' | null>(null)

  const predicted = useMemo(() => {
    const nextScale = applied ? scaleFrom(applied.income, applied.population) : 1
    return forecastTotals().map((row) => ({
      year: row.year,
      units: Math.round(row.predicted * nextScale),
    }))
  }, [applied])
  const scale = applied ? scaleFrom(applied.income, applied.population) : 1
  const bars = predicted.map((row, i) => ({
    label: String(row.year),
    value: row.units,
    color: BAR_COLORS[i] ?? '#d4a017',
  }))

  const predict = (event: FormEvent) => {
    event.preventDefault()
    setApplied({ income, population })
  }

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Prediction</p>
        <h1>2026–2028 registration forecast</h1>
        <p className="lede">
          Enter average monthly income (RM) and population, then press Predict.
          The bars scale the MOT trend baseline for 2026, 2027, and 2028. This
          is a prototype sketch, not a causal forecast.
        </p>
      </header>

      <div className="dash-predict-layout">
        <form className="dash-toolbar dash-toolbar-stack" onSubmit={predict}>
          <h2>Prediction criteria</h2>
          <label className="dash-field">
            Average income (RM / month)
            <input
              type="number"
              min={1000}
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </label>
          <label className="dash-field">
            Population
            <input
              type="number"
              min={1000000}
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
            />
          </label>
          <button className="btn dash-predict-btn" type="submit">
            Predict
          </button>
        </form>

        <section className="panel">
          <div className="dash-chart-head">
            <h2>Predicted new registrations</h2>
            <button
              className="dash-enlarge"
              type="button"
              onClick={() => applied && setModal('chart')}
              disabled={!applied}
            >
              Enlarge
            </button>
          </div>
          {applied ? (
            <>
              <BarChart items={bars} height={260} />
              <p className="legend">
                {bars.map((bar) => (
                  <span key={bar.label}>
                    <i className="swatch" style={{ background: bar.color }} /> {bar.label}
                  </span>
                ))}
              </p>
              <p className="muted">
                Scale vs baseline: {scale.toFixed(2)}×. Predicted 2028:{' '}
                {formatInt(predicted.at(-1)?.units ?? 0)} units.
              </p>
            </>
          ) : (
            <p className="muted dash-predict-empty">
              Press Predict to draw the 2026, 2027, and 2028 bars.
            </p>
          )}
        </section>
      </div>

      <div className="hero-actions">
        <button
          className="btn ghost"
          type="button"
          onClick={() => applied && setModal('table')}
          disabled={!applied}
        >
          Data table
        </button>
      </div>

      {modal && applied && (
        <div
          className="dash-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setModal(null)}
        >
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-chart-head">
              <h2>{modal === 'chart' ? 'Enlarged prediction chart' : 'Data table'}</h2>
              <button className="btn ghost compact" type="button" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
            {modal === 'chart' && <BarChart items={bars} height={320} />}
            {modal === 'table' && (
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Kind</th>
                    <th>Units</th>
                    <th>Income input</th>
                    <th>Population input</th>
                  </tr>
                </thead>
                <tbody>
                  {YEARLY_TOTALS.map((y) => (
                    <tr key={y.year}>
                      <td>{y.year}</td>
                      <td>Actual MOT</td>
                      <td>{formatInt(y.total)}</td>
                      <td>—</td>
                      <td>—</td>
                    </tr>
                  ))}
                  {predicted.map((y) => (
                    <tr key={y.year}>
                      <td>{y.year}</td>
                      <td>Predicted</td>
                      <td>{formatInt(y.units)}</td>
                      <td>RM {formatInt(Number(applied.income) || 0)}</td>
                      <td>{formatInt(Number(applied.population) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
