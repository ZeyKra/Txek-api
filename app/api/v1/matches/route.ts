import { NextResponse } from "next/server"
import type { Match } from "@/app/types/match"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET() {
  return NextResponse.json(matches)
}

export async function POST(request: Request) {
  try {
    const matchData = await request.json()

    // Validation basique
    if (!matchData.players || !Array.isArray(matchData.players) || matchData.players.length < 2) {
      return NextResponse.json({ error: "Un match doit avoir au moins 2 joueurs" }, { status: 400 })
    }

    const newMatch: Match = {
      id: crypto.randomUUID(),
      players: matchData.players,
      status: "created",
      createdAt: new Date(),
      rounds: [],
      winner: null,
    }

    matches.push(newMatch)

    return NextResponse.json(newMatch, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du match" }, { status: 500 })
  }
}

