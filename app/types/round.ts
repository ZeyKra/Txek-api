export interface RoundRelation {
  
}

export interface Round {
  id?: string
  created_at: string
  round_index: number
  winner?: string | undefined // ID du joueur gagnant le round
}

