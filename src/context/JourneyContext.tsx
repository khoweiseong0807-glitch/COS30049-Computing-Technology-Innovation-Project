import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  loadJourney,
  saveJourney,
  type JourneyState,
  type SavedClassification,
  type SavedEnergy,
  type SavedVehicle,
  type StepId,
} from '../lib/journey'

interface JourneyValue {
  state: JourneyState
  markComplete: (id: StepId) => void
  saveVehicle: (item: SavedVehicle) => void
  saveClassification: (item: SavedClassification) => void
  saveEnergy: (item: SavedEnergy) => void
  reset: () => void
}

const JourneyContext = createContext<JourneyValue | null>(null)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<JourneyState>(() =>
    user
      ? loadJourney(user.email)
      : { completed: [], vehicle: null, classification: null, energy: null },
  )

  const persist = (updater: (prev: JourneyState) => JourneyState) => {
    setState((prev) => {
      const next = updater(prev)
      if (user) saveJourney(user.email, next)
      return next
    })
  }

  const value = useMemo<JourneyValue>(
    () => ({
      state,
      markComplete: (id) =>
        persist((prev) =>
          prev.completed.includes(id)
            ? prev
            : { ...prev, completed: [...prev.completed, id] },
        ),
      saveVehicle: (item) => persist((prev) => ({ ...prev, vehicle: item })),
      saveClassification: (item) =>
        persist((prev) => ({ ...prev, classification: item })),
      saveEnergy: (item) => persist((prev) => ({ ...prev, energy: item })),
      reset: () =>
        persist(() => ({
          completed: [],
          vehicle: null,
          classification: null,
          energy: null,
        })),
    }),
    [state, user],
  )

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  )
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider')
  return ctx
}
