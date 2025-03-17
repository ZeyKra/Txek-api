export interface Move {
  playerId: string
  cardId: string
  timestamp: Date
}

export interface Round {
  id: string
  roundNumber: number
  moves: Move[]
  winner: string | null // ID du joueur gagnant le round
  createdAt: Date
}

