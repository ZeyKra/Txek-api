import { StringRecordId } from "surrealdb"

export type MatchStatus = "created" | "in_progress" | "completed" | "cancelled"
  
export interface Match {
  id?: string,
  completed_at?: Date,
  created_at?: Date,
  players: string[] // IDs des utilisateurs
  status: MatchStatus,
  round_max: number,
  winner?: string | undefined // ID de l'utilisateur gagnant
}

