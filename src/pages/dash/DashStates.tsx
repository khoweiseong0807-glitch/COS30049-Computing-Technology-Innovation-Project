import { useMemo, useState } from 'react'
import { CLASSES, STATES } from '../../data/jpj'
import { formatInt } from '../../components/ui'

const EAST = new Set(['Sabah', 'Sarawak', 'W.P. Labuan'])

export default function DashStates() {
  const [region, setRegion] = useState<'all' | 'peninsula' | 'east'>('all')
  const [kind, setKind] = useState<'both' | 'motorcar' | 'motorcycle'>('both')
  const rows = useMemo(() => {
    return STATES.filter((s) => {
      if (region === 'east') return EAST.has(s.name)
      if (region === 'peninsula') return !EAST.has(s.name)
      return true
    })
  }, [region])
  const max = Math.max(
    ...rows.map((s) =>
      kind === 'motorcycle' ? s.motorcycle : kind === 'motorcar' ? s.motorcar : s.motorcar + s.motorcycle,
    ),
    1,
  )

  return (
    <div className="dash">
      <header className="page-head">
        <p className="eyebrow">States</p>
        <h1>Motokar and motosikal by state</h1>
        <p className="lede">
          Motokar and motosikal by state. Filter Peninsula or East Malaysia, then
          focus on cars, motorcycles, or both. The state split is illustrative.
        </p>
      </header>
      <form className="dash-toolbar" onSubmit={(e) => e.preventDefault()}>
        <label className="dash-field">
          Region
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as typeof region)}
          >
            <option value="all">All states</option>
            <option value="peninsula">Peninsula</option>
            <option value="east">East Malaysia</option>
          </select>
        </label>
        <label className="dash-field">
          Show
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="both">Cars and motorcycles</option>
            <option value="motorcar">Motorcar only</option>
            <option value="motorcycle">Motorcycle only</option>
          </select>
        </label>
      </form>
      <section className="panel">
        <h2>State bars</h2>
        {rows.map((s) => {
          const t = s.motorcar + s.motorcycle
          const value =
            kind === 'motorcycle' ? s.motorcycle : kind === 'motorcar' ? s.motorcar : t
          return (
            <div key={s.name} className="state-row">
              <span>{s.name}</span>
              {kind === 'both' ? (
                <div className="dual">
                  <i style={{ width: `${(s.motorcar / t) * 100}%` }} />
                  <b style={{ width: `${(s.motorcycle / t) * 100}%` }} />
                </div>
              ) : (
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(value / max) * 100}%`,
                      background:
                        kind === 'motorcycle'
                          ? CLASSES.motorcycle.color
                          : CLASSES.motorcar.color,
                    }}
                  />
                </div>
              )}
              <small>
                {kind === 'both'
                  ? `${formatInt(s.motorcar)} / ${formatInt(s.motorcycle)}`
                  : formatInt(value)}
              </small>
            </div>
          )
        })}
        <p className="legend">
          <span>
            <span className="swatch gold" /> Motokar
          </span>
          <span>
            <span className="swatch blue" /> Motosikal
          </span>
        </p>
      </section>
    </div>
  )
}
