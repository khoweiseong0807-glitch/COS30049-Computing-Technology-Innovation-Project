import {
  CLASSES,
  REGISTRATIONS_BY_TYPE,
  type VehicleClassId,
} from '../data/jpj'
import { CLASS_IDS } from '../components/ui'

export const DASH_YEARS = [2023, 2024, 2025] as const
export type DashYear = (typeof DASH_YEARS)[number]
export type YearFilter = DashYear | 'all'
export type ClassFilter = 'all' | VehicleClassId
export type IncomeFilter = 'all' | 'b40' | 'm40' | 't20'

/** Prototype shares so the Income filter can split MOT counts. Not official JPJ. */
export const INCOME_SHARE: Record<
  Exclude<IncomeFilter, 'all'>,
  Record<VehicleClassId, number>
> = {
  b40: {
    motorcar: 0.32,
    motorcycle: 0.55,
    goods: 0.25,
    bus: 0.4,
    hire: 0.5,
    other: 0.35,
  },
  m40: {
    motorcar: 0.48,
    motorcycle: 0.35,
    goods: 0.45,
    bus: 0.4,
    hire: 0.35,
    other: 0.4,
  },
  t20: {
    motorcar: 0.2,
    motorcycle: 0.1,
    goods: 0.3,
    bus: 0.2,
    hire: 0.15,
    other: 0.25,
  },
}

export const INCOME_LABEL: Record<IncomeFilter, string> = {
  all: 'All bands',
  b40: 'B40',
  m40: 'M40',
  t20: 'T20',
}

export function classIdsFor(filter: ClassFilter): VehicleClassId[] {
  return filter === 'all' ? CLASS_IDS : [filter]
}

export function scaledCount(
  year: DashYear,
  classId: VehicleClassId,
  income: IncomeFilter,
) {
  const raw = REGISTRATIONS_BY_TYPE[year][classId]
  if (income === 'all') return raw
  return Math.round(raw * INCOME_SHARE[income][classId])
}

export function mixForYear(year: DashYear, income: IncomeFilter) {
  return Object.fromEntries(
    CLASS_IDS.map((id) => [id, scaledCount(year, id, income)]),
  ) as Record<VehicleClassId, number>
}

export function totalForYear(year: DashYear, income: IncomeFilter) {
  return CLASS_IDS.reduce((sum, id) => sum + scaledCount(year, id, income), 0)
}

export function totalForSelection(
  year: DashYear,
  income: IncomeFilter,
  classes: VehicleClassId[],
) {
  return classes.reduce((sum, id) => sum + scaledCount(year, id, income), 0)
}

export function sparklineTotals(
  income: IncomeFilter,
  classes: VehicleClassId[] = CLASS_IDS,
) {
  return DASH_YEARS.map((year) => ({
    year,
    total: totalForSelection(year, income, classes),
  }))
}

export function seriesByClass(income: IncomeFilter, classes: VehicleClassId[]) {
  return classes.map((classId) => ({
    classId,
    label: CLASSES[classId].label,
    color: CLASSES[classId].color,
    points: DASH_YEARS.map((year) => scaledCount(year, classId, income)),
  }))
}

export function displayYear(year: YearFilter): DashYear {
  return year === 'all' ? 2025 : year
}

export function readYear(value: string): YearFilter {
  return value === 'all' ? 'all' : (Number(value) as DashYear)
}
