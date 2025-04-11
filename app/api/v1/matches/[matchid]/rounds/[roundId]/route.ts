import { NextResponse } from "next/server"
import type { Match } from "@/app/types/match"
import { getRoundInformations } from "@/app/backend/surreal-actions";

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  const { roundId } = await params;

  // TODO: Check if match exist
  const roundInformations = await getRoundInformations(roundId);

  return NextResponse.json(roundInformations)
}

export async function PATCH(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  try {
    const roundData = await request.json()
    const { matchId, roundId } = await params;
    
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

