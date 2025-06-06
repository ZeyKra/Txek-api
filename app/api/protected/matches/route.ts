import { NextResponse } from "next/server"
import type { Match } from "@/types/match"
import { createMatch, relateRecordedUserToMatch } from "@/app/backend/surreal-actions"
import { SurrealResponse } from "@/types/surreal-response"

// Simulation d'une base de données

/**
 * Creer un match dans la base de données
 * @param matchData
 * @returns
 */
export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    
    //Validation basique

    const newMatch: Match = {
      completed_at: new Date(),
      created_at: new Date(),
      players: requestData.players, // IDs des utilisateurs
      status: "created",
      round_max: requestData.round_max,
    }

    const matchCreationData: SurrealResponse<any> = await createMatch(newMatch);
    
    //relateRecordedUserToMatch(requestData.owner_id, `${matchCreationData.id.tb}:${matchCreationData.id.id}`);
    
    await relateRecordedUserToMatch(requestData.owner_id, `${matchCreationData[0].id.tb}:${matchCreationData[0].id.id}`)
    return NextResponse.json(matchCreationData, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur lors de la création du match" }, { status: 500 })
  }
}

