import { DASH_YEARS } from '../lib/dashboard'
import { formatInt } from './ui'

type LineSeries = {
  label: string
  color: string
  points: number[]
}

export function LineChart({
  series,
  height = 240,
  years = DASH_YEARS,
}: {
  series: LineSeries[]
  height?: number
  years?: readonly number[]
}) {
  const width = 640
  const pad = { top: 18, right: 16, bottom: 36, left: 58 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const max = Math.max(...series.flatMap((s) => s.points), 1)
  const x = (i: number) =>
    years.length <= 1 ? pad.left + innerW / 2 : pad.left + (i / (years.length - 1)) * innerW
  const y = (v: number) => pad.top + innerH - (v / max) * innerH

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img">
      {[0, 0.5, 1].map((t) => {
        const v = max * (1 - t)
        const yy = pad.top + innerH * t
        return (
          <g key={t}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yy}
              y2={yy}
              className="chart-grid"
            />
            <text x={pad.left - 8} y={yy + 4} className="chart-axis" textAnchor="end">
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : formatInt(v)}
            </text>
          </g>
        )
      })}
      {years.map((year, i) => (
        <text key={year} x={x(i)} y={height - 10} className="chart-axis" textAnchor="middle">
          {year}
        </text>
      ))}
      {series.map((s) => {
        const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ')
        return (
          <g key={s.label}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="3" />
            {s.points.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(p)} r="4.5" fill={s.color} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export function BarChart({
  items,
  height = 200,
}: {
  items: { label: string; value: number; color: string }[]
  height?: number
}) {
  const width = 420
  const pad = { top: 28, right: 8, bottom: 42, left: 8 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const max = Math.max(...items.map((i) => i.value), 1)
  const gap = 10
  const barW = (innerW - gap * (items.length - 1)) / Math.max(items.length, 1)

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img">
      {items.map((item, i) => {
        const h = (item.value / max) * innerH
        const x = pad.left + i * (barW + gap)
        const y = pad.top + innerH - h
        return (
          <g key={`${item.label}-${i}`}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 2)} fill={item.color} rx="4" />
            <text
              x={x + barW / 2}
              y={Math.max(y - 6, 14)}
              className="chart-axis"
              textAnchor="middle"
            >
              {item.value >= 1000 ? `${(item.value / 1000).toFixed(0)}k` : formatInt(item.value)}
            </text>
            <text
              x={x + barW / 2}
              y={height - 16}
              className="chart-axis"
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function DonutChart({
  items,
  center,
}: {
  items: { label: string; value: number; color: string }[]
  center?: string
}) {
  const size = 220
  const r = 72
  const c = 2 * Math.PI * r
  const total = items.reduce((s, i) => s + i.value, 0) || 1
  let offset = 0
  return (
    <svg className="chart-svg donut" viewBox={`0 0 ${size} ${size}`} role="img">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {items.map((item) => {
          const len = (item.value / total) * c
          const dash = `${len} ${c - len}`
          const el = (
            <circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth="28"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          )
          offset += len
          return el
        })}
      </g>
      {center && (
        <text x={size / 2} y={size / 2 + 5} className="chart-axis" textAnchor="middle">
          {center}
        </text>
      )}
    </svg>
  )
}
