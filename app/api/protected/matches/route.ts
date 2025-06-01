import { NextResponse } from "next/server"
import type { Match } from "@/types/match"
import { createMatch, relatePlayerToRound, relateRecordedUserToMatch } from "@/app/backend/surreal-actions"
import { SurrealResponse } from "@/types/surreal-response"
import { RecordId, StringRecordId } from "surrealdb"

// Simulation d'une base de données
const matches: Match[] = []

/**
 * Récupère tous les matchs //TODO: Je ferais surement pas
 * @returns
 */
export async function GET() {
  return NextResponse.json(matches)
}


/**
 * Creer un match dans la base de données
 * @param matchData
 * @returns
 */
export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    
    //Validation basique
    if (!requestData.owner_id) {
       return NextResponse.json({ error: "Un match doit avoir un Proprietaire" }, { status: 400 })
    }

    const newMatch: Match = {
      completed_at: new Date(),
      created_at: new Date(),
      players: requestData.players, // IDs des utilisateurs
      status: "created",
      round_max: requestData.round_max,
    }

    const matchCreationData: SurrealResponse<any> = await createMatch(newMatch);
    
    //relateRecordedUserToMatch(requestData.owner_id, `${matchCreationData.id.tb}:${matchCreationData.id.id}`);
    
    await relateRecordedUserToMatch(requestData.owner_id, `${matchCreationData.id.tb}:${matchCreationData.id.id}`)
    return NextResponse.json(matchCreationData, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur lors de la création du match" }, { status: 500 })
  }
}

