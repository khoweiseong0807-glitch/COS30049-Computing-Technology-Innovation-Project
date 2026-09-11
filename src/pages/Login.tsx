import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { homePath } from '../lib/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const asOwner = params.get('as') !== 'officer'
  const [email, setEmail] = useState(
    asOwner ? 'user@jpjinsight.my' : 'analyst@jpj.gov.my',
  )
  const [password, setPassword] = useState(asOwner ? 'myvehicle' : 'jpjinsight')
  const [error, setError] = useState('')

  useEffect(() => {
    setEmail(asOwner ? 'user@jpjinsight.my' : 'analyst@jpj.gov.my')
    setPassword(asOwner ? 'myvehicle' : 'jpjinsight')
  }, [asOwner])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    try {
      const user = login(email.trim(), password)
      navigate(homePath(user.role))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.')
    }
  }

  return (
    <section className="auth-wrap">
      <form className="panel auth-card form" onSubmit={onSubmit}>
        <p className="eyebrow">{asOwner ? 'Vehicle owner' : 'Officer workspace'}</p>
        <h1>{asOwner ? 'Welcome back' : 'Log in'}</h1>
        <p className="muted">
          {asOwner ? (
            <>
              Demo account: <code>user@jpjinsight.my</code> / <code>myvehicle</code>
            </>
          ) : (
            <>
              Officer demo: <code>analyst@jpj.gov.my</code> / <code>jpjinsight</code>
            </>
          )}
        </p>
        <p className="muted">
          {asOwner ? (
            <Link to="/login?as=officer">Switch to officer login</Link>
          ) : (
            <Link to="/login?as=owner">Switch to owner login</Link>
          )}
        </p>
        {error && <p className="error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="btn" type="submit">
          {asOwner ? 'Continue' : 'Enter JPJ Insight'}
        </button>
        <p className="muted">
          New here?{' '}
          <Link to={asOwner ? '/register?as=owner' : '/register?as=officer'}>
            Create an account
          </Link>
        </p>
      </form>
    </section>
  )
}
