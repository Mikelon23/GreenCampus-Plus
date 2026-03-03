import type { HistoricalPoint, LeaderboardEntry, LiveMetricsResponse, Reward, ZoneName } from './types'

const zones: ZoneName[] = ['Library', 'Cafeteria', 'Labs', 'Gardens', 'Parking']

const zoneSeeds: Record<ZoneName, { temp: number; humidity: number; energy: number; air: number }> = {
  Library: { temp: 21, humidity: 45, energy: 52, air: 35 },
  Cafeteria: { temp: 25, humidity: 55, energy: 78, air: 62 },
  Labs: { temp: 23, humidity: 48, energy: 69, air: 41 },
  Gardens: { temp: 20, humidity: 58, energy: 24, air: 18 },
  Parking: { temp: 27, humidity: 44, energy: 33, air: 57 },
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const scoreStatus = (energy: number, air: number): 'Normal' | 'Attention' | 'Critical' => {
  const risk = energy * 0.6 + air * 0.4
  if (risk > 72) return 'Critical'
  if (risk > 50) return 'Attention'
  return 'Normal'
}

export const generateLiveMetrics = (seed = Date.now()): LiveMetricsResponse => {
  const random = (mod: number) => Math.sin(seed / mod)

  const response: LiveMetricsResponse = {
    timestamp: new Date(seed).toISOString(),
    score: 0,
    zones: zones.map((zone, index) => {
      const base = zoneSeeds[zone]
      const temperature = clamp(base.temp + random(3400 + index * 180) * 2.4, 17, 34)
      const humidity = clamp(base.humidity + random(4100 + index * 240) * 7, 30, 80)
      const energy = clamp(base.energy + random(2300 + index * 120) * 11, 10, 100)
      const airQuality = clamp(base.air + random(3700 + index * 210) * 9, 5, 100)

      return {
        zone,
        temperature: Number(temperature.toFixed(1)),
        humidity: Number(humidity.toFixed(1)),
        energy: Number(energy.toFixed(1)),
        airQuality: Number(airQuality.toFixed(1)),
        status: scoreStatus(energy, airQuality),
      }
    }),
  }

  const avgEnergy = response.zones.reduce((acc, zone) => acc + zone.energy, 0) / response.zones.length
  const avgAir = response.zones.reduce((acc, zone) => acc + zone.airQuality, 0) / response.zones.length
  response.score = Math.round(clamp(100 - (avgEnergy * 0.45 + avgAir * 0.35), 0, 100))

  return response
}

export const generateHistory = (zone: ZoneName, points = 24): HistoricalPoint[] => {
  const now = Date.now()
  const zoneShift = zones.indexOf(zone) * 0.9

  return Array.from({ length: points }, (_, i) => {
    const hourOffset = points - i
    const timestamp = new Date(now - hourOffset * 60 * 60 * 1000)
    const cycle = Math.sin((i / points) * Math.PI * 2 + zoneShift)

    return {
      timestamp: timestamp.toISOString(),
      temperature: Number((22 + cycle * 5 + zoneShift).toFixed(1)),
      energy: Number((58 + cycle * 20 + zoneShift * 8).toFixed(1)),
      humidity: Number((46 + Math.cos((i / points) * Math.PI * 2 + zoneShift) * 12).toFixed(1)),
    }
  })
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { user: 'Ana V.', team: 'EcoMinds', points: 1280, actions: 42 },
  { user: 'Miguel T.', team: 'GreenLabs', points: 1175, actions: 38 },
  { user: 'Kevin R.', team: 'EcoMinds', points: 1030, actions: 31 },
  { user: 'Luisa C.', team: 'SolarCrew', points: 980, actions: 27 },
  { user: 'Jorge M.', team: 'SolarCrew', points: 905, actions: 25 },
]

export const mockRewards: Reward[] = [
  { id: 'r1', label: 'Eco-Reporter Bronze', pointsRequired: 300, unlocked: true },
  { id: 'r2', label: 'Campus Guardian Silver', pointsRequired: 700, unlocked: true },
  { id: 'r3', label: 'Green Champion Gold', pointsRequired: 1200, unlocked: false },
]
