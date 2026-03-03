export type ZoneName = 'Library' | 'Cafeteria' | 'Labs' | 'Gardens' | 'Parking'

export interface ZoneMetrics {
  zone: ZoneName
  temperature: number
  humidity: number
  energy: number
  airQuality: number
  status: 'Normal' | 'Attention' | 'Critical'
}

export interface LiveMetricsResponse {
  timestamp: string
  score: number
  zones: ZoneMetrics[]
}

export interface HistoricalPoint {
  timestamp: string
  temperature: number
  energy: number
  humidity: number
}

export interface LeaderboardEntry {
  user: string
  team: string
  points: number
  actions: number
}

export interface Reward {
  id: string
  label: string
  pointsRequired: number
  unlocked: boolean
}

export interface EcoActionReport {
  user: string
  zone: ZoneName
  action: string
  impact: 'Low' | 'Medium' | 'High'
}
