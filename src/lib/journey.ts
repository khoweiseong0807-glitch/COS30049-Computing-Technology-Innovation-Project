import type { Role } from './auth'
import { isOwner } from './auth'
import type { FuelId, UsageId } from '../data/jpj'

export const OFFICER_STEPS = [
  { id: 'welcome', path: '/app/welcome', letter: 'A', label: 'Start' },
  { id: 'overview', path: '/app/overview', letter: 'B', label: 'Dashboard' },
  { id: 'classify', path: '/app/classify', letter: 'C', label: 'Classify' },
  { id: 'trends', path: '/app/trends', letter: 'D', label: 'Predict' },
  { id: 'energy', path: '/app/energy', letter: 'E', label: 'Energy' },
  { id: 'report', path: '/app/report', letter: 'F', label: 'Report' },
  { id: 'done', path: '/app/done', letter: 'G', label: 'Finish' },
] as const

export const OWNER_STEPS = [
  { id: 'u-welcome', path: '/user/welcome', letter: 'A', label: 'Start', short: 'Start' },
  { id: 'u-vehicle', path: '/user/vehicle', letter: 'B', label: 'My vehicle', short: 'Vehicle' },
  { id: 'u-classify', path: '/user/classify', letter: 'C', label: 'Class', short: 'Class' },
  { id: 'u-energy', path: '/user/energy', letter: 'D', label: 'Energy', short: 'Energy' },
  { id: 'u-record', path: '/user/record', letter: 'E', label: 'My record', short: 'Record' },
  { id: 'u-done', path: '/user/done', letter: 'F', label: 'Finish', short: 'Done' },
] as const

export type OfficerStepId = (typeof OFFICER_STEPS)[number]['id']
export type OwnerStepId = (typeof OWNER_STEPS)[number]['id']
export type StepId = OfficerStepId | OwnerStepId

export function stepsFor(role: Role) {
  return isOwner(role) ? OWNER_STEPS : OFFICER_STEPS
}

export interface SavedVehicle {
  plate: string
  state: string
  nickname: string
  engineCc: number
  fuel: FuelId
  seats: number
  unladenKg: number
  wheels: 2 | 3 | 4 | 6
  usage: UsageId
  year: number
}

export interface SavedClassification {
  preset: string
  classLabel: string
  classMalay: string
  confidence: number
  engineCc: number
  fuel: string
  seats: number
}

export interface SavedEnergy {
  classLabel: string
  fuel: string
  km: number
  annualLitres: number
  annualKwh: number
  co2Kg: number
}

export interface JourneyState {
  completed: StepId[]
  vehicle: SavedVehicle | null
  classification: SavedClassification | null
  energy: SavedEnergy | null
}

function key(email: string) {
  return `jpj-insight-journey:${email}`
}

const empty = (): JourneyState => ({
  completed: [],
  vehicle: null,
  classification: null,
  energy: null,
})

export function loadJourney(email: string): JourneyState {
  const raw = localStorage.getItem(key(email))
  if (!raw) return empty()
  return { ...empty(), ...(JSON.parse(raw) as JourneyState) }
}

export function saveJourney(email: string, state: JourneyState) {
  localStorage.setItem(key(email), JSON.stringify(state))
}

export function nextStep(id: StepId, role: Role) {
  const list = stepsFor(role)
  const i = list.findIndex((s) => s.id === id)
  return list[Math.min(Math.max(i, 0) + 1, list.length - 1)]
}
