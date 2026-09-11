import { useState } from 'react'
import { PRESETS, type FuelId, type UsageId } from '../data/jpj'
import { StepFooter } from '../components/StepFooter'
import { useJourney } from '../context/JourneyContext'
import type { SavedVehicle } from '../lib/journey'

const STATES = [
  'Selangor',
  'W.P. Kuala Lumpur',
  'Johor',
  'Pulau Pinang',
  'Perak',
  'Kedah',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Perlis',
  'Sabah',
  'Sarawak',
  'W.P. Putrajaya',
  'W.P. Labuan',
]

export default function MyVehicle() {
  const { state, saveVehicle } = useJourney()
  const [form, setForm] = useState<SavedVehicle>(
    () =>
      state.vehicle ?? {
        plate: 'WXY 3842',
        state: 'Selangor',
        nickname: 'Honda RS150',
        engineCc: 150,
        fuel: 'petrol',
        seats: 2,
        unladenKg: 118,
        wheels: 2,
        usage: 'private',
        year: 2023,
      },
  )

  const set = <K extends keyof SavedVehicle>(key: K, value: SavedVehicle[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">B · My vehicle</p>
        <h1>Your vehicle</h1>
        <p className="lede">
          Use a nearby example, or type your own plate and details. This stays
          on your phone or computer only — it is not an official JPJ filing.
        </p>
      </header>
      <p className="hint">Quick fill from a typical Malaysian vehicle</p>
      <div className="chips">
        {PRESETS.slice(0, 4).map((p) => (
          <button
            key={p.name}
            type="button"
            className="chip"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                nickname: p.name,
                engineCc: p.engineCc,
                fuel: p.fuel,
                seats: p.seats,
                unladenKg: p.unladenKg,
                wheels: p.wheels,
                usage: p.usage,
                year: p.year,
              }))
            }
          >
            {p.name}
          </button>
        ))}
      </div>
      <form className="panel form form-grid" onSubmit={(e) => e.preventDefault()}>
        <label>
          Plate number
          <input
            required
            autoComplete="off"
            placeholder="WXY 3842"
            value={form.plate}
            onChange={(e) => set('plate', e.target.value.toUpperCase())}
          />
        </label>
        <label>
          Registered in
          <select value={form.state} onChange={(e) => set('state', e.target.value)}>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="span-2">
          Nickname (optional)
          <input
            placeholder="e.g. Family car, office van"
            value={form.nickname}
            onChange={(e) => set('nickname', e.target.value)}
          />
        </label>
        <label>
          Engine (cc)
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={form.engineCc}
            onChange={(e) => set('engineCc', Number(e.target.value))}
          />
        </label>
        <label>
          Year
          <input
            type="number"
            min={1980}
            max={2026}
            inputMode="numeric"
            value={form.year}
            onChange={(e) => set('year', Number(e.target.value))}
          />
        </label>
        <label>
          Fuel
          <select value={form.fuel} onChange={(e) => set('fuel', e.target.value as FuelId)}>
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
            inputMode="numeric"
            value={form.seats}
            onChange={(e) => set('seats', Number(e.target.value))}
          />
        </label>
        <label>
          Weight without load (kg)
          <input
            type="number"
            min={50}
            inputMode="numeric"
            value={form.unladenKg}
            onChange={(e) => set('unladenKg', Number(e.target.value))}
          />
        </label>
        <label>
          Wheels
          <select
            value={form.wheels}
            onChange={(e) =>
              set('wheels', Number(e.target.value) as SavedVehicle['wheels'])
            }
          >
            <option value={2}>2 — motorcycle / scooter</option>
            <option value={3}>3</option>
            <option value={4}>4 — car / van / lorry</option>
            <option value={6}>6 or more</option>
          </select>
        </label>
        <label className="span-2">
          How you use it
          <select
            value={form.usage}
            onChange={(e) => set('usage', e.target.value as UsageId)}
          >
            <option value="private">Private / family</option>
            <option value="commercial">Work / commercial</option>
            <option value="public">Public / hire</option>
          </select>
        </label>
      </form>
      <StepFooter
        step="u-vehicle"
        nextLabel="Save and see my class"
        onContinue={() => saveVehicle(form)}
      />
    </div>
  )
}
