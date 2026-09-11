import { YEARLY_TOTALS } from '../data/jpj'
import { forecastTotals } from '../lib/ml'
import { ROLE_LABEL } from '../lib/auth'
import { formatInt } from '../components/ui'
import { StepFooter } from '../components/StepFooter'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export default function Report() {
  const { user } = useAuth()
  const { state } = useJourney()
  const forecast = forecastTotals()
  const total2025 = YEARLY_TOTALS[2].total
  const total2028 = forecast[2]?.predicted ?? 0
  const { classification, energy } = state

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">F · Briefing</p>
        <h1>Session report</h1>
        <p className="lede">
          Prepared for {user?.name} ({user ? ROLE_LABEL[user.role] : 'guest'}).
          This closes the analysis path before you sign out.
        </p>
      </header>

      <section className="stat-grid">
        <article className="stat">
          <span>2025 new registrations</span>
          <strong>{formatInt(total2025)}</strong>
        </article>
        <article className="stat">
          <span>2028 baseline forecast</span>
          <strong>{formatInt(total2028)}</strong>
        </article>
        <article className="stat">
          <span>Classified example</span>
          <strong>{classification?.classLabel ?? 'Not saved'}</strong>
          <em>
            {classification
              ? `${classification.preset} · ${(classification.confidence * 100).toFixed(0)}%`
              : 'Go back to Classify if you want this filled'}
          </em>
        </article>
        <article className="stat">
          <span>Energy example</span>
          <strong>
            {energy
              ? energy.fuel === 'bev'
                ? `${formatInt(energy.annualKwh)} kWh`
                : `${formatInt(energy.annualLitres)} L`
              : 'Not saved'}
          </strong>
          <em>
            {energy
              ? `${energy.classLabel} · ${formatInt(energy.km)} km · ${formatInt(energy.co2Kg)} kg CO₂`
              : 'Go back to Energy if you want this filled'}
          </em>
        </article>
      </section>

      <section className="panel">
        <h2>Findings in this prototype</h2>
        <ul className="plain-list">
          <li>
            Motokar and motosikal dominate JPJ new registrations, so any national
            response has to treat two-wheelers as first-class, not residual.
          </li>
          <li>
            Classification is explainable: wheels, mass, seats and usage are the
            strongest attributions in the scoring model.
          </li>
          <li>
            The 2026–2028 line is a trend baseline for staffing and energy
            envelopes, not a policy claim.
          </li>
          <li>
            Energy estimates convert class × fuel × kilometres into litres or
            kWh so MOT and planners can compare ICE and BEV loads.
          </li>
        </ul>
      </section>
      <StepFooter step="report" nextLabel="Finish the journey" />
    </div>
  )
}
