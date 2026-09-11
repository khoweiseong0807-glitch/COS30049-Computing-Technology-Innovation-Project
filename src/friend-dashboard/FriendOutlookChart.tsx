import { formatInt } from '../components/ui'

export function FriendOutlookChart({
  years,
  points,
  color = '#1e3a5f',
  height = 240,
}: {
  years: number[]
  points: number[]
  color?: string
  height?: number
}) {
  const width = 720
  const pad = { top: 18, right: 16, bottom: 36, left: 58 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const max = Math.max(...points, 1)
  const x = (i: number) => pad.left + (i / Math.max(years.length - 1, 1)) * innerW
  const y = (v: number) => pad.top + innerH - (v / max) * innerH
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ')

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
      <path d={d} fill="none" stroke={color} strokeWidth="3" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p)} r="4.5" fill={i > 2 ? '#d97706' : color} />
      ))}
    </svg>
  )
}
