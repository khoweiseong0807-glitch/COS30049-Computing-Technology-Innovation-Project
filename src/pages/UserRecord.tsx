import { CLASSES, REGISTRATIONS_BY_TYPE, YEARLY_TOTALS } from '../data/jpj'
import { formatInt } from '../components/ui'
import { StepFooter } from '../components/StepFooter'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export default function UserRecord() {
  const { user } = useAuth()
  const { state } = useJourney()
  const total = YEARLY_TOTALS[2].total
  const mix = REGISTRATIONS_BY_TYPE[2025]
  const classKey = Object.entries(CLASSES).find(
    ([, v]) => v.label === state.classification?.classLabel,
  )?.[0] as keyof typeof mix | undefined
  const classCount = classKey ? mix[classKey] : 0
  const firstName = user?.name.split(' ')[0] ?? 'You'

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">E · My record</p>
        <h1>{firstName}’s vehicle snapshot</h1>
        <p className="lede">
          A private summary of what you entered. This is not an official JPJ
          document and is not shared with officers in this prototype.
        </p>
      </header>
      <section className="stat-grid">
        <article className="stat">
          <span>Plate</span>
          <strong>{state.vehicle?.plate ?? 'Not saved yet'}</strong>
          <em>{state.vehicle?.state ?? 'Add your vehicle first'}</em>
        </article>
        <article className="stat">
          <span>Likely class</span>
          <strong>{state.classification?.classLabel ?? 'Not classified yet'}</strong>
          <em>
            {state.classification
              ? `${state.classification.classMalay} · about ${(state.classification.confidence * 100).toFixed(0)}% sure`
              : 'Open Class to see the estimate'}
          </em>
        </article>
        <article className="stat">
          <span>Yearly energy</span>
          <strong>
            {state.energy
              ? state.energy.fuel === 'bev'
                ? `${formatInt(state.energy.annualKwh)} kWh`
                : `${formatInt(state.energy.annualLitres)} L`
              : 'Not saved yet'}
          </strong>
          <em>
            {state.energy
              ? `${formatInt(state.energy.km)} km a year · about ${formatInt(state.energy.co2Kg)} kg CO₂`
              : 'Open Energy to add kilometres'}
          </em>
        </article>
        <article className="stat">
          <span>How common in 2025</span>
          <strong>
            {classKey ? `${((classCount / total) * 100).toFixed(1)}%` : '—'}
          </strong>
          <em>
            {classKey
              ? `${formatInt(classCount)} new ${state.classification?.classMalay} of ${formatInt(total)} new vehicles`
              : 'Classify first to compare'}
          </em>
        </article>
      </section>
      <StepFooter step="u-record" nextLabel="I’m done" />
    </div>
  )
}
