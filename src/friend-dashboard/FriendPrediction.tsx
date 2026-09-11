import { useMemo, useState } from 'react'
import { YEARLY_TOTALS } from '../data/jpj'
import { formatInt } from '../components/ui'
import { forecastTotals } from '../lib/ml'
import { FriendOutlookChart } from './FriendOutlookChart'

export default function FriendPrediction() {
  const [income, setIncome] = useState('5000')
  const [population, setPopulation] = useState('33500000')
  const [modal, setModal] = useState<'chart' | 'table' | null>(null)

  const base = forecastTotals()
  const scale = useMemo(() => {
    const pop = Number(population) || 33_500_000
    const inc = Number(income) || 5000
    const popFactor = pop / 33_500_000
    const incomeFactor = inc / 5000
    return Math.max(0.55, Math.min(1.75, 0.6 * popFactor + 0.4 * incomeFactor))
  }, [income, population])

  const predicted = base.map((row) => ({
    year: row.year,
    units: Math.round(row.predicted * scale),
  }))
  const years = [...YEARLY_TOTALS.map((y) => y.year), ...predicted.map((p) => p.year)]
  const points = [...YEARLY_TOTALS.map((y) => y.total), ...predicted.map((p) => p.units)]

  return (
    <>
      <section className="friend-intro">
        <p className="eyebrow">Prediction</p>
        <h1>Prediction criteria</h1>
        <p>
          Enter an average-income sketch (RM / month) and a population figure.
          The 2026–2028 line is the MOT 2023–2025 baseline forecast, scaled by
          those two inputs. This is a prototype, not a causal forecast.
        </p>
      </section>

      <form className="friend-card friend-criteria" onSubmit={(e) => e.preventDefault()}>
        <label>
          Average income
          <input
            type="number"
            min={1000}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </label>
        <label>
          Population
          <input
            type="number"
            min={1000000}
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
          />
        </label>
      </form>

      <section className="friend-card">
        <div className="friend-chart-head">
          <h2>National outlook scaled by your inputs</h2>
          <button className="friend-enlarge" type="button" onClick={() => setModal('chart')}>
            Enlarge
          </button>
        </div>
          <FriendOutlookChart years={years} points={points} height={240} />
        <p className="muted">
          Scale vs baseline: {scale.toFixed(2)}×. Predicted 2028:{' '}
          {formatInt(predicted.at(-1)?.units ?? 0)} units.
        </p>
      </section>

      <div className="friend-actions" style={{ marginTop: '0.9rem' }}>
        <button className="friend-action" type="button" onClick={() => setModal('table')}>
          Data table
        </button>
      </div>

      {modal && (
        <div className="friend-overlay" role="dialog" aria-modal="true">
          <div className="friend-modal">
            <div className="friend-modal-head">
              <h2>{modal === 'chart' ? 'Enlarged outlook chart' : 'Prediction table'}</h2>
              <button className="friend-close" type="button" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
            {modal === 'chart' && (
              <FriendOutlookChart years={years} points={points} height={320} />
            )}
            {modal === 'table' && (
              <table className="friend-table">
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
                      <td>RM {formatInt(Number(income) || 0)}</td>
                      <td>{formatInt(Number(population) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  )
}
