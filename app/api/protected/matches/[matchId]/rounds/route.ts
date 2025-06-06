import { NextResponse } from "next/server"
import type { Round } from "@/types/round"
import type { Match } from "@/types/match"
import { createRound, getMatchRounds, getSurrealClient, relateRoundToMatch } from "@/app/backend/surreal-actions"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { matchId: string } }) {
  const { matchId } = await params;

  // TODO: Check if match exist
  if (!matchId) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  const matchRounds = await getMatchRounds(`Match:${matchId}`);
  
  return NextResponse.json(matchRounds)
}

//create round
export async function POST(request: Request, { params }: { params: { matchId: string } }) {
  try {

    const { matchId } = await params;
    const requestData = await request.json()

    //console.log(requestData, matchid); // DEBUG
    if(!requestData.players || requestData.players.length !== 2) {
      return NextResponse.json({ error: "Un match doit avoir 2 joueurs" }, { status: 400 })
    }
    
    const newRoundData: Round = {
      created_at: new Date(),
      status: "in_progress",
      round_index: requestData.round_index,  
      winner: requestData.winner || undefined,
    }

    let roundCreationData = await createRound(newRoundData, requestData.players);
    
    await relateRoundToMatch(`${roundCreationData.id.tb}:${roundCreationData.id.id}`, `Match:${matchId}`);

    return NextResponse.json(roundCreationData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du round" }, { status: 500 })
  }
}

