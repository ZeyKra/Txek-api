import { NextResponse } from "next/server"
import type { Round } from "@/app/types/round"
import type { Match } from "@/app/types/match"
import { getSurrealClient } from "@/app/backend/surreal-actions"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const match = matches.find((m) => m.id === params.id)

  if (!match) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  return NextResponse.json(match)
}

//create round
export async function POST(request: Request, { params }: { params: { round_index: number } }) {
  try {
    const db = await getSurrealClient();

    const roundData = await request.json()

    const newRound: Round = {
      created_at: new Date().toISOString(),
      round_index: roundData.round_index,  
      winner: roundData.winner || null,
    }


    return NextResponse.json(newRound, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du round" }, { status: 500 })
  }
}

