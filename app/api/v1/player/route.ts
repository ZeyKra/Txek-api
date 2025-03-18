import { NextResponse } from "next/server"
import type { Player } from "@/app/types/player"
import { createPlayer } from "@/app/backend/surreal-actions"

// Simulation d'une base de données
const users: Player[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const player = await request.json()
    console.log(player);

    // Validation basique
    if (!player.username) {
      return NextResponse.json({ error: "Le nom d'utilisateur est requis" }, { status: 400 })
    }

    const playerData: Player = {
      username: player.username,
    }

    const playerCreation = await createPlayer(playerData);


    return NextResponse.json(playerCreation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

