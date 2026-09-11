import { Link } from 'react-router-dom'
import { nextStep, type StepId } from '../lib/journey'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export function StepFooter({
  step,
  nextLabel,
  disabled,
  onContinue,
}: {
  step: StepId
  nextLabel?: string
  disabled?: boolean
  onContinue?: () => void
}) {
  const { user } = useAuth()
  const { markComplete } = useJourney()
  const next = nextStep(step, user?.role ?? 'jpj')
  return (
    <div className="step-footer">
      <Link
        className="btn"
        to={next.path}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            return
          }
          onContinue?.()
          markComplete(step)
        }}
      >
        {nextLabel ?? `Next: ${next.label}`}
      </Link>
    </div>
  )
}
