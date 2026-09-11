import { useState } from 'react'
import { CLASSES, ENERGY_RATES, type FuelId, type VehicleClassId } from '../data/jpj'
import { estimateEnergy, fleetEnergySketch } from '../lib/ml'
import { isOwner } from '../lib/auth'
import { CLASS_IDS, formatInt } from '../components/ui'
import { StepFooter } from '../components/StepFooter'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

function classIdFromLabel(label: string | undefined): VehicleClassId {
  const found = (Object.entries(CLASSES) as [VehicleClassId, (typeof CLASSES)[VehicleClassId]][]).find(
    ([, v]) => v.label === label,
  )
  return found?.[0] ?? 'motorcar'
}

export default function Energy() {
  const { user } = useAuth()
  const owner = user ? isOwner(user.role) : false
  const { state, saveEnergy } = useJourney()
  const startClass = classIdFromLabel(state.classification?.classLabel)
  const startFuel = (state.vehicle?.fuel ??
    (state.classification?.fuel as FuelId) ??
    'petrol') as FuelId
  const [cls, setCls] = useState<VehicleClassId>(startClass)
  const [fuel, setFuel] = useState<FuelId>(startFuel)
  const [km, setKm] = useState(ENERGY_RATES[startClass].defaultKm)
  const one = estimateEnergy(cls, fuel, km)
  const fleet = fleetEnergySketch(2025)

  const persist = () =>
    saveEnergy({
      classLabel: CLASSES[cls].label,
      fuel,
      km,
      annualLitres: one.annualLitres,
      annualKwh: one.annualKwh,
      co2Kg: one.co2Kg,
    })

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">
          {owner ? 'D · Energy' : 'E · Energy consumption'}
        </p>
        <h1>
          {owner ? 'A simple yearly energy picture' : 'From class mix to litres and kWh'}
        </h1>
        <p className="lede">
          {owner
            ? 'Change how far you usually go in a year. We estimate fuel or electricity from that — a guide only, not a bill.'
            : 'Intensity by JPJ class and fuel, times annual kilometres. Save one vehicle estimate into your briefing.'}
        </p>
      </header>

      <div className="split">
        <form className="panel form" onSubmit={(e) => e.preventDefault()}>
          <h2>{owner ? 'How far do you go?' : 'One vehicle'}</h2>
          <label>
            Class
            <select
              value={cls}
              onChange={(e) => {
                const next = e.target.value as VehicleClassId
                setCls(next)
                setKm(ENERGY_RATES[next].defaultKm)
              }}
            >
              {CLASS_IDS.map((id) => (
                <option key={id} value={id}>
                  {CLASSES[id].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fuel
            <select value={fuel} onChange={(e) => setFuel(e.target.value as FuelId)}>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="bev">Battery electric</option>
            </select>
          </label>
          <label>
            Kilometres in a year
            <input
              type="number"
              min={500}
              max={120000}
              step={500}
              inputMode="numeric"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
            />
            {owner && (
              <span className="hint">
                A typical private car is around 15,000 km. A motorcycle is often less.
              </span>
            )}
          </label>
        </form>
        <section className="stat-grid compact">
          <article className="stat">
            <span>{owner ? 'Typical use' : 'Intensity'}</span>
            <strong>
              {fuel === 'bev'
                ? `${one.kwhPer100.toFixed(1)} kWh/100 km`
                : `${one.litresPer100.toFixed(1)} L/100 km`}
            </strong>
          </article>
          <article className="stat">
            <span>{owner ? 'About this much a year' : 'Annual energy'}</span>
            <strong>
              {fuel === 'bev'
                ? `${formatInt(one.annualKwh)} kWh`
                : `${formatInt(one.annualLitres)} L`}
            </strong>
          </article>
          <article className="stat">
            <span>{owner ? 'Rough CO₂' : 'Approx. CO₂'}</span>
            <strong>{formatInt(one.co2Kg)} kg</strong>
            <em>{owner ? 'A sketch, not a laboratory figure' : 'grid factor 0.55 kg/kWh for BEV'}</em>
          </article>
          {!owner && (
          <article className="stat">
            <span>Energy</span>
            <strong>{formatInt(one.energyMj)} MJ</strong>
          </article>
          )}
        </section>
      </div>

      {!owner && (
      <section className="panel">
        <h2>2025 new-fleet energy envelope</h2>
        <p className="muted">
          Count × default km × intensity. Motorcycle petrol still dominates litres.
        </p>
        <table>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Vehicles</th>
              <th>Million litres</th>
              <th>GWh</th>
              <th>kt CO₂</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((row) => (
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
      )}
      <StepFooter
        step={owner ? 'u-energy' : 'energy'}
        nextLabel={
          owner
            ? 'Save and open my summary'
            : 'Save energy estimate and open report'
        }
        onContinue={persist}
      />
    </div>
  )
}
