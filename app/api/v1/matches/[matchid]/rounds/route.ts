import { NextResponse } from "next/server"
import type { Round } from "@/app/types/round"
import type { Match } from "@/app/types/match"
import { createRound, getMatchRounds, getSurrealClient, relatePlayerToRound, relateRoundToMatch } from "@/app/backend/surreal-actions"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { matchid: string } }) {
  const { matchid } = await params;

  // TODO: Check if match exist
  if (!matchid) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }
  
  const matchRounds = await getMatchRounds(matchid);
  

  return NextResponse.json(matchRounds)
}

//create round
export async function POST(request: Request, { params }: { params: { matchid: string, round_index: number } }) {
  try {

    const { matchid } = await params;
    const requestData = await request.json()
    const db = await getSurrealClient();

    //console.log(requestData, matchid); // DEBUG
    
    const newRoundData: Round = {
      created_at: new Date(),
      round_index: requestData.round_index,  
      winner: requestData.winner || undefined,
    }

    // Data srtucture 'Round:<id>'
    let roundCreationData = await createRound(newRoundData);
    
    await relateRoundToMatch(roundCreationData.id, matchid);
    await relatePlayerToRound(requestData.player, roundCreationData.id)
    //console.log(relateRoundToMatchData); // DEBUG 
    

    return NextResponse.json(roundCreationData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du round" }, { status: 500 })
  }
}

