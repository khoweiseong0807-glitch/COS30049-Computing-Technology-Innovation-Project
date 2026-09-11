import {
  CLASSES,
  ENERGY_RATES,
  REGISTRATIONS_BY_TYPE,
  YEARLY_TOTALS,
  type FuelId,
  type UsageId,
  type VehicleClassId,
} from '../data/jpj'

export interface VehicleFeatures {
  engineCc: number
  fuel: FuelId
  seats: number
  unladenKg: number
  wheels: 2 | 3 | 4 | 6
  usage: UsageId
  year: number
}

export interface Attribution {
  feature: string
  contribution: number
}

export interface ClassificationResult {
  predicted: VehicleClassId
  confidence: number
  scores: Record<VehicleClassId, number>
  attributions: Attribution[]
}

const CLASS_IDS = Object.keys(CLASSES) as VehicleClassId[]

function softmax(raw: Record<VehicleClassId, number>) {
  const max = Math.max(...CLASS_IDS.map((k) => raw[k]))
  const exps = Object.fromEntries(
    CLASS_IDS.map((k) => [k, Math.exp(raw[k] - max)]),
  ) as Record<VehicleClassId, number>
  const sum = CLASS_IDS.reduce((s, k) => s + exps[k], 0)
  return Object.fromEntries(CLASS_IDS.map((k) => [k, exps[k] / sum])) as Record<
    VehicleClassId,
    number
  >
}

/**
 * Interpretable scoring model (weighted decision stumps).
 * Trained conceptually on JPJ class boundaries: wheels, mass, seats, usage.
 */
export function classifyVehicle(f: VehicleFeatures): ClassificationResult {
  const scores: Record<VehicleClassId, number> = {
    motorcycle: 0.4,
    motorcar: 0.8,
    goods: -0.2,
    bus: -0.6,
    hire: -0.3,
    other: -0.8,
  }

  const attrib: Record<string, Partial<Record<VehicleClassId, number>>> = {}
  const bump = (feature: string, cls: VehicleClassId, amount: number) => {
    scores[cls] += amount
    attrib[feature] ??= {}
    attrib[feature][cls] = (attrib[feature][cls] ?? 0) + amount
  }

  if (f.wheels === 2) {
    bump('Wheels (2)', 'motorcycle', 4.6)
    bump('Wheels (2)', 'motorcar', -2.4)
  } else if (f.wheels === 6) {
    bump('Wheels (6+)', 'goods', 1.8)
    bump('Wheels (6+)', 'bus', 1.4)
    bump('Wheels (6+)', 'motorcycle', -2.0)
  } else {
    bump('Wheels (4)', 'motorcar', 1.1)
    bump('Wheels (4)', 'motorcycle', -2.2)
  }

  if (f.unladenKg < 250) bump('Unladen mass', 'motorcycle', 2.8)
  else if (f.unladenKg < 1800) bump('Unladen mass', 'motorcar', 1.3)
  else if (f.unladenKg < 4500) bump('Unladen mass', 'goods', 2.2)
  else bump('Unladen mass', 'bus', 1.6)

  if (f.seats <= 2) bump('Seats', 'motorcycle', 1.6)
  else if (f.seats <= 8) bump('Seats', 'motorcar', 1.2)
  else if (f.seats >= 16) bump('Seats', 'bus', 3.4)
  else bump('Seats', 'bus', 1.1)

  if (f.engineCc > 0 && f.engineCc <= 250) bump('Engine capacity', 'motorcycle', 1.8)
  else if (f.engineCc >= 3000) bump('Engine capacity', 'goods', 0.9)

  if (f.usage === 'commercial') {
    bump('Usage (commercial)', 'goods', 2.6)
    bump('Usage (commercial)', 'motorcar', -0.8)
  } else if (f.usage === 'public') {
    if (f.seats >= 16) bump('Usage (public)', 'bus', 2.8)
    else bump('Usage (public)', 'hire', 2.9)
  } else {
    bump('Usage (private)', 'motorcar', 0.7)
    bump('Usage (private)', 'motorcycle', 0.4)
  }

  if (f.fuel === 'diesel' && f.unladenKg > 2000) bump('Diesel + mass', 'goods', 1.1)
  if (f.fuel === 'bev' && f.wheels === 4) bump('Battery electric', 'motorcar', 0.8)

  const probs = softmax(scores)
  const predicted = CLASS_IDS.reduce((a, b) => (probs[a] >= probs[b] ? a : b))
  const confidence = probs[predicted]

  const attributions: Attribution[] = Object.entries(attrib)
    .map(([feature, byClass]) => ({
      feature,
      contribution: byClass[predicted] ?? 0,
    }))
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))

  return { predicted, confidence, scores: probs, attributions }
}

export function forecastTotals(horizon = 3) {
  const xs = YEARLY_TOTALS.map((_, i) => i)
  const ys = YEARLY_TOTALS.map((r) => r.total)
  const n = xs.length
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n
  const slope =
    xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0) /
    xs.reduce((s, x) => s + (x - meanX) ** 2, 0)
  const intercept = meanY - slope * meanX
  const lastYear = YEARLY_TOTALS[YEARLY_TOTALS.length - 1].year
  return Array.from({ length: horizon }, (_, i) => {
    const x = n + i
    return {
      year: lastYear + i + 1,
      predicted: Math.round(intercept + slope * x),
      method: 'linear regression on 2023–2025 totals',
    }
  })
}

export function forecastByClass(horizon = 3) {
  const years = [2023, 2024, 2025]
  return CLASS_IDS.map((cls) => {
    const ys = years.map((y) => REGISTRATIONS_BY_TYPE[y][cls])
    const n = years.length
    const meanX = 1
    const xs = [0, 1, 2]
    const meanY = ys.reduce((a, b) => a + b, 0) / n
    const slope =
      xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0) /
      xs.reduce((s, x) => s + (x - meanX) ** 2, 0)
    const intercept = meanY - slope * meanX
    const future = Array.from({ length: horizon }, (_, i) =>
      Math.max(0, Math.round(intercept + slope * (n + i))),
    )
    return { classId: cls, history: ys, future }
  })
}

export function estimateEnergy(
  cls: VehicleClassId,
  fuel: FuelId,
  annualKm: number,
) {
  const rates = ENERGY_RATES[cls]
  const litres =
    fuel === 'bev'
      ? 0
      : fuel === 'diesel'
        ? rates.dieselL
        : fuel === 'hybrid'
          ? rates.hybridL
          : rates.petrolL
  const kwh = fuel === 'bev' ? rates.bevKwh : 0
  const annualLitres = (litres * annualKm) / 100
  const annualKwh = (kwh * annualKm) / 100
  const petrolMj = annualLitres * 34.2
  const dieselMj = annualLitres * 38.6
  const kwhMj = annualKwh * 3.6
  const energyMj =
    fuel === 'bev' ? kwhMj : fuel === 'diesel' ? dieselMj : petrolMj
  return {
    litresPer100: litres,
    kwhPer100: kwh,
    annualLitres,
    annualKwh,
    energyMj,
    co2Kg:
      fuel === 'bev'
        ? annualKwh * 0.55
        : fuel === 'diesel'
          ? annualLitres * 2.68
          : annualLitres * 2.31,
  }
}

export function fleetEnergySketch(year: 2023 | 2024 | 2025) {
  const counts = REGISTRATIONS_BY_TYPE[year]
  const mix: Array<{ classId: VehicleClassId; fuel: FuelId; share: number }> = [
    { classId: 'motorcycle', fuel: 'petrol', share: 0.98 },
    { classId: 'motorcar', fuel: 'petrol', share: 0.86 },
    { classId: 'motorcar', fuel: 'hybrid', share: 0.08 },
    { classId: 'motorcar', fuel: 'bev', share: 0.036 },
    { classId: 'goods', fuel: 'diesel', share: 0.92 },
    { classId: 'bus', fuel: 'diesel', share: 0.97 },
    { classId: 'hire', fuel: 'petrol', share: 0.9 },
    { classId: 'other', fuel: 'diesel', share: 0.8 },
  ]

  return mix.map((row) => {
    const n = Math.round(counts[row.classId] * row.share)
    const e = estimateEnergy(row.classId, row.fuel, ENERGY_RATES[row.classId].defaultKm)
    return {
      ...row,
      vehicles: n,
      gwh: (e.annualKwh * n) / 1_000_000,
      millionLitres: (e.annualLitres * n) / 1_000_000,
      ktCo2: (e.co2Kg * n) / 1_000_000,
    }
  })
}
