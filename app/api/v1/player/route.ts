import { NextResponse } from "next/server"
import type { Player } from "@/app/types/player"
import { createPlayer } from "@/app/backend/surreal-actions"
import { createStatisticsProfile, createStatisticsRelation } from "@/app/backend/surreal-statistics"

// Simulation d'une base de données
const users: Player[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json()

    // Validation basique
    if (!requestData.username) {
      return NextResponse.json({ error: "Le nom d'utilisateur est requis" }, { status: 400 })
    }

    const playerData: Player = {
      username: requestData.username,
      created_at: new Date()
    }

    const playerCreation = await createPlayer(playerData);
    
    const statisticsProfile = await createStatisticsProfile();
    await createStatisticsRelation(playerCreation.id, statisticsProfile.id);
    
    // DEBUG : Logging
    //console.log(playerCreation);
    //console.log(statisticsProfileCreationResponse);

    return NextResponse.json(playerCreation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

