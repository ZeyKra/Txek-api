import { NextResponse } from "next/server"
import type { Match } from "@/app/types/match"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { id: string; roundId: string } }) {
  const match = matches.find((m) => m.id === params.id)

  if (!match) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  const round = match.rounds.find((r) => r.id === params.roundId)

  if (!round) {
    return NextResponse.json({ error: "Round non trouvé" }, { status: 404 })
  }

  return NextResponse.json(round)
}

export async function PATCH(request: Request, { params }: { params: { id: string; roundId: string } }) {
  try {
    const roundData = await request.json()
    const matchIndex = matches.findIndex((m) => m.id === params.id)

    if (matchIndex === -1) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
    }

    const roundIndex = matches[matchIndex].rounds.findIndex((r) => r.id === params.roundId)

    if (roundIndex === -1) {
      return NextResponse.json({ error: "Round non trouvé" }, { status: 404 })
    }

    matches[matchIndex].rounds[roundIndex] = {
      ...matches[matchIndex].rounds[roundIndex],
      ...roundData,
      id: params.roundId,
    }

    return NextResponse.json(matches[matchIndex].rounds[roundIndex])
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du round" }, { status: 500 })
  }
}

