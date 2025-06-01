export interface RoundRelation {
  local_player: string[]
}

export interface Round {
  id?: string
  created_at: Date
  round_index: number
  winner?: string | undefined // ID du joueur gagnant le round
}

