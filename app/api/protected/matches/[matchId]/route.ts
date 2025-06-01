import { NextResponse } from "next/server"
import type { Match } from "@/types/match"
import { createRound, getMatchInformations, getMatchRounds } from "@/app/backend/surreal-actions";

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { matchId: string } }) {
  const matchId = await params.matchId;

  const matchInformations = await getMatchInformations(matchId);

  return NextResponse.json(matchInformations)
}

export async function POST(request: Request, { params }: { params: { matchId: string } }) {
  const matchId = await params.matchId;
  const requestData = await request.json();

  await console.log(requestData);

  if(!requestData.players || requestData.players.length !== 2) {
    return NextResponse.json({ error: "Un match doit avoir deux joueurs" }, { status: 400 })
  }

  

  //const roundInformations = await createRound(`Match:${matchId}`, requestData.players);

  return NextResponse.json("roundInformations")
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const matchData = await request.json()
    const index = matches.findIndex((m) => m.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
    }

    matches[index] = {
      ...matches[index],
      ...matchData,
      id: params.id, // Assurer que l'ID ne change pas
    }

    return NextResponse.json(matches[index])
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du match" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = matches.findIndex((m) => m.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  matches.splice(index, 1)

  return NextResponse.json({ message: "Match supprimé avec succès" })
}

