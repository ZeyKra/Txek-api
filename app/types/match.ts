import type { Round } from "./round"

export type MatchStatus = "created" | "in_progress" | "completed" | "cancelled"

export interface Match {
  id?: string,
  completed_at?: Date,
  created_at?: Date,
  local_player: string[], // IDs des utilisateurs
  local_player_count: number,
  owner: string, // ID de l'utilisateur
  player_count: number,
  status: MatchStatus,
  round_count: number,
  winner: string | null // ID de l'utilisateur gagnant
}

