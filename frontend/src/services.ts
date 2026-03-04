import { generateHistory, generateLiveMetrics, mockLeaderboard } from './data'
import type { EcoActionReport, HistoricalPoint, LeaderboardEntry, LiveMetricsResponse, ZoneName } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`)
  }

  return response.json() as Promise<T>
}

export const metricsService = {
  async getLive(): Promise<LiveMetricsResponse> {
    try {
      return await fetchJson<LiveMetricsResponse>('/api/metrics/live')
    } catch {
      return generateLiveMetrics()
    }
  },

  async getHistory(zone: ZoneName): Promise<HistoricalPoint[]> {
    try {
      const data = await fetchJson<{ history: HistoricalPoint[] }>(`/api/metrics/history?zone=${zone}&range=24h`)
      return data.history
    } catch {
      return generateHistory(zone)
    }
  },
}

export const gamificationService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const data = await fetchJson<{ leaderboard: LeaderboardEntry[] }>('/api/gamification/leaderboard')
      return data.leaderboard
    } catch {
      return mockLeaderboard
    }
  },

  async submitReport(report: EcoActionReport): Promise<{ points: number; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/api/reports/eco-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      })

      if (!response.ok) {
        throw new Error('Submit failed')
      }

      return response.json() as Promise<{ points: number; message: string }>
    } catch {
      const impactPoints = { Low: 20, Medium: 35, High: 50 }
      const points = impactPoints[report.impact]
      return { points, message: `Eco-action registrada con ${points} puntos.` }
    }
  },
}
