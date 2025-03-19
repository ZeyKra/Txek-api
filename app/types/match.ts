import Surreal, { RecordId, StringRecordId } from "surrealdb"
import type { Round } from "./round"

export type MatchStatus = "created" | "in_progress" | "completed" | "cancelled"

export interface Match {
  id?: string,
  completed_at?: Date,
  created_at?: Date,
  local_player: string[], // IDs des utilisateurs
  local_player_count: number,
  owner: StringRecordId, // ID de l'utilisateur
  player_count: number,
  status: MatchStatus,
  round_count: number,
  winner: string | undefined // ID de l'utilisateur gagnant
}

