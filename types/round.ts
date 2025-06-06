export type RoundStatus = "created" | "in_progress" | "completed" 

export interface Round {
  id?: string
  created_at: Date
  round_index: number
  status: RoundStatus
  winner?: string | undefined // ID du joueur gagnant le round
  [key: string]: any;
}

