import { NextResponse } from "next/server"
import type { Match } from "@/app/types/match"
import { getRoundDeckList } from "@/app/backend/surreal-actions";

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  const { matchId, roundId } = await params;

  // TODO: Check if match exist
  const deckList = await getRoundDeckList(roundId);

  return NextResponse.json(deckList)
}

export async function PATCH(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  try {
    const roundData = await request.json()
    const { matchId, roundId } = await params;
  
    

    return NextResponse.json()
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du round" }, { status: 500 })
  }
}

