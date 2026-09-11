import { useNavigate } from 'react-router-dom'
import { homePath, isOwner } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import { useJourney } from '../context/JourneyContext'

export default function Done() {
  const { user, logout } = useAuth()
  const { markComplete, reset } = useJourney()
  const navigate = useNavigate()
  const owner = user ? isOwner(user.role) : false
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <div className="stack">
      <header className="page-head">
        <p className="eyebrow">{owner ? 'F' : 'G'} · Finish</p>
        <h1>
          {owner
            ? `Thank you${firstName ? `, ${firstName}` : ''}`
            : 'Journey complete'}
        </h1>
        <p className="lede">
          {owner
            ? 'Your vehicle snapshot is saved on this device for the prototype. You can run it again any time, or sign out.'
            : `${user?.name}, you finished the officer path from login to the end.`}
        </p>
      </header>
      <section className="panel">
        <h2>{owner ? 'What would you like next?' : 'What you can do next'}</h2>
        <div className="hero-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              reset()
              navigate(user ? homePath(user.role) : '/')
            }}
          >
            {owner ? 'Start over with another vehicle' : 'Run this journey again'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              markComplete(owner ? 'u-done' : 'done')
              logout()
              navigate('/')
            }}
          >
            {owner ? 'Sign out' : 'Sign out and return home'}
          </button>
        </div>
      </section>
    </div>
  )
}
