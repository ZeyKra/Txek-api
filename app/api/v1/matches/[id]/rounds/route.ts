import { NextResponse } from "next/server"
import type { Round } from "@/app/types/round"
import type { Match } from "@/app/types/match"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const match = matches.find((m) => m.id === params.id)

  if (!match) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  return NextResponse.json(match.rounds)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const roundData = await request.json()
    const matchIndex = matches.findIndex((m) => m.id === params.id)

    if (matchIndex === -1) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
    }

    if (matches[matchIndex].status !== "in_progress") {
      return NextResponse.json({ error: "Le match n'est pas en cours" }, { status: 400 })
    }

    const newRound: Round = {
      id: crypto.randomUUID(),
      roundNumber: matches[matchIndex].rounds.length + 1,
      moves: roundData.moves || [],
      winner: roundData.winner || null,
      createdAt: new Date(),
    }

    matches[matchIndex].rounds.push(newRound)

    return NextResponse.json(newRound, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du round" }, { status: 500 })
  }
}

