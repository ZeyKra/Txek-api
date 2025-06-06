import { NextResponse } from "next/server"
import type { Match } from "@/types/match"
import { createRound, deleteMatch, getMatchInformations, getMatchRounds } from "@/app/backend/surreal-actions";

// Simulation d'une base de données
const matches: Match[] = []

/**
 * GET /api/protected/matches/{matchId}
 * 
 * Récuperation des informations d'un match
 * @param matchData
 * @returns
 * 
 */
export async function GET(request: Request, { params }: { params: { matchId: string } }) {
  const matchId = await params.matchId;

  const matchInformations = await getMatchInformations(matchId);

  return NextResponse.json(matchInformations)
}

/**
 * PATCH /api/protected/matches/{matchId}
 * //TODO
 * Modification d'un match
 * @param matchData
 * @returns
 * 
 */
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

/**
 * DELETE /api/protected/matches/{matchId}
 * 
 * Suppression d'un match et tout ses rounds
 * @param matchData
 * @returns
 * 
 */
export async function DELETE(request: Request, { params }: { params: { matchId: string } }) {
  const { matchId } = await params;

  deleteMatch(`Match:${matchId}`);

  return NextResponse.json({ message: "Match supprimé avec succès" })
}

