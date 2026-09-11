import { YEARLY_TOTALS, CLASSES } from '../../data/jpj'
import { forecastByClass, forecastTotals } from '../../lib/ml'
import { formatInt } from '../../components/ui'
import { LineChart } from '../../components/Charts'

export default function DashOutlook() {
  const forecast = forecastTotals()
  const byClass = forecastByClass()
  const totals = [
    ...YEARLY_TOTALS.map((y) => y.total),
    ...forecast.map((f) => f.predicted),
  ]

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">Outlook</p>
        <h1>Where registrations are heading</h1>
        <p className="lede">
          Linear regression on 2023–2025 MOT totals. A prototype baseline — not
          a causal forecast.
        </p>
      </header>
      <section className="panel">
        <h2>National new registrations</h2>
        <LineChart
          height={260}
          series={[
            {
              label: 'History + outlook',
              color: CLASSES.motorcar.color,
              points: totals.slice(0, 3),
            },
          ]}
        />
        <div className="year-bars">
          {YEARLY_TOTALS.map((y) => (
            <div key={y.year} className="year-col">
              <div
                className="year-fill actual"
                style={{ height: `${(y.total / Math.max(...totals)) * 160}px` }}
              />
              <strong>{(y.total / 1_000_000).toFixed(2)}M</strong>
              <span>{y.year}</span>
            </div>
          ))}
          {forecast.map((y) => (
            <div key={y.year} className="year-col">
              <div
                className="year-fill forecast"
                style={{ height: `${(y.predicted / Math.max(...totals)) * 160}px` }}
              />
              <strong>{(y.predicted / 1_000_000).toFixed(2)}M</strong>
              <span>{y.year}*</span>
            </div>
          ))}
        </div>
        <p className="muted">* Predicted · ordinary least squares on three annual points.</p>
      </section>
      <section className="panel">
        <h2>Class-level outlook to 2028</h2>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>2025</th>
              <th>2026*</th>
              <th>2027*</th>
              <th>2028*</th>
            </tr>
          </thead>
          <tbody>
            {byClass.map((row) => (
              <tr key={row.classId}>
                <td>{row.classId}</td>
                <td>{formatInt(row.history[2])}</td>
                {row.future.map((n, i) => (
                  <td key={i}>{formatInt(n)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
