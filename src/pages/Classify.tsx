import { useMemo, useState } from 'react'
import { CLASSES, PRESETS, type FuelId, type UsageId } from '../data/jpj'
import { classifyVehicle, type VehicleFeatures } from '../lib/ml'
import { isOwner } from '../lib/auth'
import { BarRow, CLASS_IDS } from '../components/ui'
import { StepFooter } from '../components/StepFooter'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export default function Classify() {
  const { user } = useAuth()
  const owner = user ? isOwner(user.role) : false
  const { state, saveClassification } = useJourney()
  const [preset, setPreset] = useState(
    state.vehicle?.nickname ?? PRESETS[0].name,
  )
  const [form, setForm] = useState<VehicleFeatures>(() => {
    if (state.vehicle) {
      const { plate: _p, state: _s, nickname: _n, ...features } = state.vehicle
      return features
    }
    const { name: _name, ...features } = PRESETS[0]
    return features
  })
  const result = useMemo(() => classifyVehicle(form), [form])
  const predicted = CLASSES[result.predicted]
  const attrMax = Math.max(
    ...result.attributions.map((a) => Math.abs(a.contribution)),
    0.01,
  )

  const set = <K extends keyof VehicleFeatures>(key: K, value: VehicleFeatures[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const persist = () =>
    saveClassification({
      preset,
      classLabel: predicted.label,
      classMalay: predicted.malay,
      confidence: result.confidence,
      engineCc: form.engineCc,
      fuel: form.fuel,
      seats: form.seats,
    })

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">
          C · {owner ? 'Class' : 'Classify + attribution'}
        </p>
        <h1>
          {owner ? 'Your likely vehicle class' : 'What class would JPJ see?'}
        </h1>
        <p className="lede">
          {owner
            ? `Based on ${state.vehicle?.plate ?? 'your vehicle'}${state.vehicle?.nickname ? ` (${state.vehicle.nickname})` : ''}. This is a helpful estimate, not an official JPJ decision.`
            : 'Enter specs or load a Malaysian example. The scoring model maps wheels, mass, seats, engine, fuel, and usage to a JPJ-style class.'}
        </p>
      </header>

      {!owner && (
      <div className="chips">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={preset === p.name ? 'chip on' : 'chip'}
            onClick={() => {
              const { name, ...features } = p
              setPreset(name)
              setForm(features)
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      )}

      <div className="split">
        <form className="panel form" onSubmit={(e) => e.preventDefault()}>
          <h2>{owner ? 'You can still adjust details' : 'Vehicle features'}</h2>
          <label>
            Engine capacity (cc)
            <input
              type="number"
              min={0}
              max={15000}
              value={form.engineCc}
              onChange={(e) => set('engineCc', Number(e.target.value))}
            />
          </label>
          <label>
            Fuel
            <select
              value={form.fuel}
              onChange={(e) => set('fuel', e.target.value as FuelId)}
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="bev">Battery electric</option>
            </select>
          </label>
          <label>
            Seats
            <input
              type="number"
              min={1}
              max={60}
              value={form.seats}
              onChange={(e) => set('seats', Number(e.target.value))}
            />
          </label>
          <label>
            Unladen mass (kg)
            <input
              type="number"
              min={50}
              max={20000}
              value={form.unladenKg}
              onChange={(e) => set('unladenKg', Number(e.target.value))}
            />
          </label>
          <label>
            Wheels
            <select
              value={form.wheels}
              onChange={(e) =>
                set('wheels', Number(e.target.value) as VehicleFeatures['wheels'])
              }
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={6}>6+</option>
            </select>
          </label>
          <label>
            Usage
            <select
              value={form.usage}
              onChange={(e) => set('usage', e.target.value as UsageId)}
            >
              <option value="private">Private</option>
              <option value="commercial">Commercial</option>
              <option value="public">Public / hire</option>
            </select>
          </label>
        </form>

        <section className="panel">
          <h2>{owner ? 'Most likely class' : 'Model output'}</h2>
          <div className="verdict">
            <span className="pill" style={{ background: predicted.color }}>
              {predicted.label}
            </span>
            <p>
              {predicted.malay}
              {owner
                ? ` · about ${(result.confidence * 100).toFixed(0)}% sure`
                : ` · ${(result.confidence * 100).toFixed(1)}% confidence`}
            </p>
          </div>
          {!owner &&
            CLASS_IDS.map((id) => (
            <BarRow
              key={id}
              label={CLASSES[id].label}
              value={result.scores[id]}
              max={1}
              color={CLASSES[id].color}
              hint={`${(result.scores[id] * 100).toFixed(1)}%`}
            />
          ))}
          <h3>{owner ? 'What stood out' : 'Why this class'}</h3>
          {result.attributions.map((a) => (
            <BarRow
              key={a.feature}
              label={a.feature}
              value={Math.abs(a.contribution)}
              max={attrMax}
              color={a.contribution >= 0 ? '#d4a017' : '#dc4a26'}
              hint={`${a.contribution >= 0 ? '+' : ''}${a.contribution.toFixed(2)}`}
            />
          ))}
        </section>
      </div>
      <StepFooter
        step={owner ? 'u-classify' : 'classify'}
        nextLabel={
          owner ? 'Looks right — estimate my energy' : 'Save this class and continue'
        }
        onContinue={persist}
      />
    </div>
  )
}
