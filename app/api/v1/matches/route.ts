import { NextResponse } from "next/server"
import type { Match } from "@/app/types/match"
import { createMatch } from "@/app/backend/surreal-actions"
import { SurrealResponse } from "@/app/types/surreal-response"
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
    if (!requestData.owner) {
       return NextResponse.json({ error: "Un match doit avoir un Proprietaire" }, { status: 400 })
    }

    const newMatch: Match = {
      completed_at: new Date(),
      created_at: new Date(),
      local_player: requestData.local_player, // IDs des utilisateurs
      local_player_count: requestData.local_player.length,
      owner: new StringRecordId(requestData.owner), // ID de l'utilisateur TODO: Ajouter l'owner
      player_count: 0,
      status: "created",
      round_count: 8,
      winner: undefined // ID de l'utilisateur gagnant
    }

    const matchCreationData: SurrealResponse<any> = await createMatch(newMatch);
    return NextResponse.json(matchCreationData, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur lors de la création du match" }, { status: 500 })
  }
}

