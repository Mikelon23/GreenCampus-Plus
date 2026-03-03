import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { mockRewards } from './data'
import { gamificationService, metricsService } from './services'
import type { EcoActionReport, HistoricalPoint, LeaderboardEntry, LiveMetricsResponse, Reward, ZoneMetrics, ZoneName } from './types'

type View = 'dashboard' | 'gamification' | 'reports'

const zoneList: ZoneName[] = ['Library', 'Cafeteria', 'Labs', 'Gardens', 'Parking']

const statusClass: Record<ZoneMetrics['status'], string> = {
  Normal: 'status normal',
  Attention: 'status attention',
  Critical: 'status critical',
}

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [selectedZone, setSelectedZone] = useState<ZoneName>('Library')
  const [liveMetrics, setLiveMetrics] = useState<LiveMetricsResponse | null>(null)
  const [history, setHistory] = useState<HistoricalPoint[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rewards, setRewards] = useState<Reward[]>(mockRewards)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportMessage, setReportMessage] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        setError(null)
        const [live, trend, ranking] = await Promise.all([
          metricsService.getLive(),
          metricsService.getHistory(selectedZone),
          gamificationService.getLeaderboard(),
        ])

        if (!active) return

        setLiveMetrics(live)
        setHistory(trend)
        setLeaderboard(ranking)
      } catch {
        if (active) {
          setError('No se pudo cargar la información del campus.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadData()
    const poll = setInterval(() => {
      void metricsService.getLive().then((live) => {
        if (active) {
          setLiveMetrics(live)
        }
      })
    }, 5000)

    return () => {
      active = false
      clearInterval(poll)
    }
  }, [selectedZone])

  const campusAverages = useMemo(() => {
    if (!liveMetrics) {
      return { temperature: 0, humidity: 0, energy: 0, airQuality: 0 }
    }

    const count = liveMetrics.zones.length
    return {
      temperature: Number((liveMetrics.zones.reduce((acc, zone) => acc + zone.temperature, 0) / count).toFixed(1)),
      humidity: Number((liveMetrics.zones.reduce((acc, zone) => acc + zone.humidity, 0) / count).toFixed(1)),
      energy: Number((liveMetrics.zones.reduce((acc, zone) => acc + zone.energy, 0) / count).toFixed(1)),
      airQuality: Number((liveMetrics.zones.reduce((acc, zone) => acc + zone.airQuality, 0) / count).toFixed(1)),
    }
  }, [liveMetrics])

  const handleReportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const report: EcoActionReport = {
      user: String(formData.get('user')),
      zone: formData.get('zone') as ZoneName,
      action: String(formData.get('action')),
      impact: formData.get('impact') as EcoActionReport['impact'],
    }

    const result = await gamificationService.submitReport(report)
    setReportMessage(result.message)

    setRewards((prevRewards) =>
      prevRewards.map((reward) => {
        const currentPoints = leaderboard[0]?.points ?? 0
        return { ...reward, unlocked: reward.unlocked || currentPoints + result.points >= reward.pointsRequired }
      }),
    )

    event.currentTarget.reset()
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>GreenCampus+</h1>
        <p>Smart Sustainable Campus</p>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={view === 'gamification' ? 'active' : ''} onClick={() => setView('gamification')}>Gamification</button>
          <button className={view === 'reports' ? 'active' : ''} onClick={() => setView('reports')}>Eco Reports</button>
        </nav>
      </aside>

      <main className="content">
        <header className="header">
          <div>
            <h2>{view === 'dashboard' ? 'Campus Dashboard' : view === 'gamification' ? 'Student Participation' : 'Eco-Action Reporting'}</h2>
            <p>Actualización automática cada 5 segundos · objetivo NFR: &lt;2s de refresco desde backend.</p>
          </div>
          <label>
            Zone:
            <select value={selectedZone} onChange={(event) => setSelectedZone(event.target.value as ZoneName)}>
              {zoneList.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
        </header>

        {loading && <p className="state">Cargando datos del campus...</p>}
        {error && <p className="state error">{error}</p>}

        {!loading && !error && view === 'dashboard' && liveMetrics && (
          <section className="dashboard-grid">
            <KpiCard title="Global Sustainability Score" value={`${liveMetrics.score}/100`} hint="Basado en energía + calidad de aire" />
            <KpiCard title="Average Temperature" value={`${campusAverages.temperature}°C`} hint="Meta: 20°C - 24°C" />
            <KpiCard title="Average Humidity" value={`${campusAverages.humidity}%`} hint="Meta: 40% - 60%" />
            <KpiCard title="Energy Usage" value={`${campusAverages.energy}%`} hint="Reducir horas pico" />

            <article className="panel wide">
              <h3>24h trend · {selectedZone}</h3>
              <SimpleTrendChart data={history} />
            </article>

            <article className="panel wide">
              <h3>Zone diagnostics</h3>
              <table>
                <thead>
                  <tr>
                    <th>Zone</th>
                    <th>Temp</th>
                    <th>Humidity</th>
                    <th>Energy</th>
                    <th>Air</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveMetrics.zones.map((zone) => (
                    <tr key={zone.zone}>
                      <td>{zone.zone}</td>
                      <td>{zone.temperature}°C</td>
                      <td>{zone.humidity}%</td>
                      <td>{zone.energy}%</td>
                      <td>{zone.airQuality}%</td>
                      <td><span className={statusClass[zone.status]}>{zone.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        )}

        {!loading && !error && view === 'gamification' && (
          <section className="gamification-grid">
            <article className="panel">
              <h3>Leaderboard</h3>
              <ol className="leaderboard">
                {leaderboard.map((entry) => (
                  <li key={entry.user}>
                    <strong>{entry.user}</strong>
                    <span>{entry.team}</span>
                    <span>{entry.actions} actions</span>
                    <span>{entry.points} pts</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="panel">
              <h3>Rewards progression</h3>
              <ul className="rewards">
                {rewards.map((reward) => (
                  <li key={reward.id} className={reward.unlocked ? 'unlocked' : 'locked'}>
                    <div>
                      <strong>{reward.label}</strong>
                      <small>{reward.pointsRequired} pts</small>
                    </div>
                    <span>{reward.unlocked ? 'Unlocked' : 'Locked'}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {!loading && !error && view === 'reports' && (
          <section className="reports-grid">
            <article className="panel">
              <h3>Submit Eco-Action</h3>
              <form onSubmit={handleReportSubmit}>
                <label>
                  Reporter
                  <input name="user" required placeholder="Your name" />
                </label>
                <label>
                  Zone
                  <select name="zone" defaultValue={selectedZone}>
                    {zoneList.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Action description
                  <textarea name="action" required placeholder="Example: lights left on in room 204" rows={4} />
                </label>
                <label>
                  Estimated impact
                  <select name="impact" defaultValue="Medium">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
                <button type="submit">Send report</button>
              </form>
              {reportMessage && <p className="state success">{reportMessage}</p>}
            </article>

            <article className="panel">
              <h3>Suggested campaign actions</h3>
              <ul>
                <li>Reduce peak-hour lab energy by scheduling batch workloads.</li>
                <li>Activate cafeteria ventilation automation from 12:00 to 15:00.</li>
                <li>Launch "Bike-to-Campus Week" to reduce parking CO₂ impact.</li>
                <li>Use classroom reminders to reduce unnecessary lighting usage.</li>
              </ul>
            </article>
          </section>
        )}
      </main>
    </div>
  )
}

function KpiCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <article className="panel kpi">
      <h3>{title}</h3>
      <p className="kpi-value">{value}</p>
      <small>{hint}</small>
    </article>
  )
}

function SimpleTrendChart({ data }: { data: HistoricalPoint[] }) {
  if (!data.length) {
    return <p className="state">Sin datos históricos.</p>
  }

  const width = 760
  const height = 250
  const padding = 30

  const maxTemp = Math.max(...data.map((point) => point.temperature))
  const minTemp = Math.min(...data.map((point) => point.temperature))
  const maxEnergy = Math.max(...data.map((point) => point.energy))
  const minEnergy = Math.min(...data.map((point) => point.energy))

  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - padding * 2)
  const normalize = (value: number, min: number, max: number) => {
    if (max === min) return height / 2
    return height - padding - ((value - min) / (max - min)) * (height - padding * 2)
  }

  const tempPath = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${normalize(point.temperature, minTemp, maxTemp)}`)
    .join(' ')
  const energyPath = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${normalize(point.energy, minEnergy, maxEnergy)}`)
    .join(' ')

  return (
    <div className="chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="24-hour temperature and energy chart">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="axis" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="axis" />
        <path d={tempPath} className="line temp" />
        <path d={energyPath} className="line energy" />
      </svg>
      <div className="legend">
        <span><i className="dot temp" /> Temperature</span>
        <span><i className="dot energy" /> Energy</span>
      </div>
    </div>
  )
}

export default App
