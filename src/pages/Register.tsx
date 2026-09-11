import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homePath, type Role } from '../lib/auth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const asOfficer = params.get('as') === 'officer'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(asOfficer ? 'jpj' : 'owner')
  const [error, setError] = useState('')

  useEffect(() => {
    setRole(asOfficer ? 'jpj' : 'owner')
  }, [asOfficer])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    try {
      const user = register(name.trim(), email.trim(), password, role)
      navigate(homePath(user.role))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register.')
    }
  }

  return (
    <section className="auth-wrap">
      <form className="panel auth-card form" onSubmit={onSubmit}>
        <p className="eyebrow">{asOfficer ? 'Officer workspace' : 'Vehicle owner'}</p>
        <h1>{asOfficer ? 'Create an officer account' : 'Create your account'}</h1>
        <p className="muted">
          {asOfficer
            ? 'Choose an officer or analyst role for the national workspace.'
            : 'A few details so we can keep your vehicle snapshot on this device. You can use a demo login if you prefer.'}
        </p>
        {error && <p className="error">{error}</p>}
        <label>
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={asOfficer ? 'Aina Rahman' : 'Hafiz Tan'}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
        <label>
          I am a
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="owner">Vehicle owner (public user)</option>
            <option value="jpj">JPJ officer</option>
            <option value="mot">MOT analyst</option>
            <option value="student">COS30049 student</option>
          </select>
        </label>
        <button className="btn" type="submit">
          {asOfficer ? 'Register and start' : 'Create account'}
        </button>
        <p className="muted">
          Already registered?{' '}
          <Link to={asOfficer ? '/login?as=officer' : '/login?as=owner'}>
            Log in
          </Link>
        </p>
      </form>
    </section>
  )
}
