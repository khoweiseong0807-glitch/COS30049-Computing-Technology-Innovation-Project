import { CLASSES, type VehicleClassId } from '../data/jpj'

export const CLASS_IDS = Object.keys(CLASSES) as VehicleClassId[]

export function formatInt(n: number) {
  return new Intl.NumberFormat('en-MY').format(Math.round(n))
}

export function BarRow({
  label,
  value,
  max,
  color,
  hint,
}: {
  label: string
  value: number
  max: number
  color: string
  hint?: string
}) {
  const pct = max === 0 ? 0 : (value / max) * 100
  return (
    <div className="bar-row">
      <div className="bar-meta">
        <span>{label}</span>
        <strong>{hint ?? formatInt(value)}</strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
