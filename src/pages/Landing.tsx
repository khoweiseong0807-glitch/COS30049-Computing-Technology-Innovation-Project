import { Link } from 'react-router-dom'
import { YEARLY_TOTALS } from '../data/jpj'
import { formatInt } from '../components/ui'

function photo(name: string) {
  return `${import.meta.env.BASE_URL}home/${name}`
}

export default function Landing() {
  const y2023 = YEARLY_TOTALS[0]
  const y2024 = YEARLY_TOTALS[1]
  const y2025 = YEARLY_TOTALS[2]

  return (
    <div className="home">
      <section className="home-hero">
        <img
          className="home-hero-photo"
          src={photo('road.jpg')}
          alt="Cars on Jalan Kuching, a Malaysian federal highway in Kuala Lumpur"
        />
        <div className="home-hero-copy">
          <p className="eyebrow">Ministry of Transport Malaysia · COS30049</p>
          <h1>This dashboard is about new vehicle registrations</h1>
          <p className="lede hero-lede">
            Official Ministry of Transport counts for 2023, 2024 and 2025.
            This is a student prototype for COS30049 — not an official JPJ
            website.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/dashboard">
              Open dashboard
            </Link>
            <Link className="btn ghost" to="/dashboard/combined">
              Open historical data
            </Link>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat">
          <span>New registrations, 2023</span>
          <strong>{formatInt(y2023.total)}</strong>
        </article>
        <article className="stat">
          <span>New registrations, 2024</span>
          <strong>{formatInt(y2024.total)}</strong>
        </article>
        <article className="stat">
          <span>New registrations, 2025</span>
          <strong>{formatInt(y2025.total)}</strong>
          <em>+3.8% vs 2024</em>
        </article>
        <article className="stat">
          <span>What grew</span>
          <strong>96,104</strong>
          <em>extra units from 2023 to 2025</em>
        </article>
      </section>

      <article className="home-story">
        <img
          src={photo('cars.jpg')}
          alt="Motorcars on the MRR2 highway in Kuala Lumpur"
        />
        <div className="home-story-copy">
          <p className="letter-lg">Motokar</p>
          <h2>Motorcars are just over half of the mix</h2>
          <p className="muted">
            In 2025, 861,515 new motorcars were registered. That is 52.9% of
            all new vehicles. The line on the dashboard goes up from 790,100
            in 2023, so cars — not only total traffic — are still growing.
          </p>
        </div>
      </article>

      <article className="home-story home-story-flip">
        <img
          src={photo('motorcycle.jpg')}
          alt="A motorcycle on a Malaysian city street"
        />
        <div className="home-story-copy">
          <p className="letter-lg">Motosikal</p>
          <h2>Motorcycles are the other large group</h2>
          <p className="muted">
            Motorcycles were 704,251 in 2025, or 43.2%. Together with
            motorcars they make about 96% of new registrations. The remaining
            share is goods vehicles, buses, hire cars, and other classes.
          </p>
        </div>
      </article>

      <article className="home-story">
        <img
          src={photo('goods.jpg')}
          alt="A goods lorry on a Malaysian highway"
        />
        <div className="home-story-copy">
          <p className="letter-lg">Other classes</p>
          <h2>Goods, bus, hire, and other are small but counted</h2>
          <p className="muted">
            Goods vehicles were 35,414 in 2025. Buses 1,221. Hire and taxi
            5,998. Other 20,990. The dashboard also sketches states and a
            2026–2028 prediction. Those extra views are prototypes, not extra
            official MOT tables.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/dashboard">
              Open dashboard
            </Link>
            <Link className="btn ghost" to="/dashboard/prediction">
              Open prediction
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
