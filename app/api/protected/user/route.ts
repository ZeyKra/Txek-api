import { NextResponse } from "next/server"
import type { User } from "@/app/types/User"
import { createUser } from "@/app/backend/surreal-actions"
import { createStatisticsProfile, createStatisticsRelation } from "@/app/backend/surreal-statistics"

// Simulation d'une base de données
// TODO : Mettre l'endpoint au pluriel
const users: User[] = []

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

    const userData: User = {
      username: requestData.username,
      created_at: new Date()
    }

    const userCreation = await createUser(userData);
    
    const statisticsProfile = await createStatisticsProfile();
    await createStatisticsRelation(userCreation.id, statisticsProfile.id);
    
    // DEBUG : Logging
    //console.log(playerCreation);
    //console.log(statisticsProfileCreationResponse);

    return NextResponse.json(userCreation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

