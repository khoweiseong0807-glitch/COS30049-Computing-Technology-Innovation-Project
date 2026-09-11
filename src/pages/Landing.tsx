import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Jabatan Pengangkutan Jalan · COS30049</p>
        <h1>Understand your vehicle — clearly and calmly</h1>
        <p className="lede hero-lede">
          Open the dashboard hub, then jump to other pages for charts and
          filters — or check your own vehicle. This is a student prototype, not
          an official JPJ website.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/dashboard">
            Open dashboard
          </Link>
        </div>
      </section>
      <section className="portal-grid">
        <article className="panel portal">
          <span className="letter-lg">For you</span>
          <h2>I own or ride a vehicle</h2>
          <p className="muted">
            Add your plate, see the likely class in plain language, and get a
            simple yearly fuel or electricity picture. Works on a phone.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/register?as=owner">
              Get started
            </Link>
            <Link className="btn ghost" to="/login?as=owner">
              I already have an account
            </Link>
          </div>
        </article>
        <article className="panel portal">
          <span className="letter-lg">For officers</span>
          <h2>I work at JPJ or MOT</h2>
          <p className="muted">
            Open a landing-style dashboard hub, then other pages for charts
            and filters. After that: classify, forecast, energy, and a briefing.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/register?as=officer">
              Start as officer
            </Link>
            <Link className="btn ghost" to="/login?as=officer">
              Officer log in
            </Link>
          </div>
        </article>
        <article className="panel portal">
          <span className="letter-lg">Teammate version</span>
          <h2>Malaysia Vehicle Registration wireframe</h2>
          <p className="muted">
            A separate dashboard built from the teammate ODP: Home,
            Historical Data, and Prediction. Your original JPJ Insight
            dashboard is unchanged.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/friend">
              Open teammate dashboard
            </Link>
          </div>
        </article>
      </section>
    </>
  )
}
