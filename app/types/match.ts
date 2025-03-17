import type { Round } from "./round"

export type MatchStatus = "created" | "in_progress" | "completed" | "cancelled"

export interface Match {
  id: string
  players: string[] // IDs des utilisateurs
  status: MatchStatus
  createdAt: Date
  completedAt?: Date
  rounds: Round[]
  winner: string | null // ID de l'utilisateur gagnant
}

