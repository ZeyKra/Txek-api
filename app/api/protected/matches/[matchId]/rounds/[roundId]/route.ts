import { NextResponse } from "next/server"
import { deleteRound, getRoundInformations } from "@/app/backend/surreal-actions";

/**
 * GET /api/protected/matches/{matchId}/rounds/{roundId}
 * 
 * Récupération des informations d'un round
 * @param matchData
 * @returns
 * 
 */
export async function GET(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  const { roundId } = await params;

  // TODO: Check if match exist
  const roundInformations = await getRoundInformations(`Round:${roundId}`);

  return NextResponse.json(roundInformations)
}

/**
 * Modification /api/protected/matches/{matchId}/rounds/{roundId}
 * 
 * Modifier les informations d'un round
 * @param matchData
 * @returns
 * 
 */
export async function PATCH(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  try {
    const roundData = await request.json()
    const { matchId, roundId } = await params;
    
    const matchIndex = matches.findIndex((m) => m.id === params.id)

    if (matchIndex === -1) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
    }

    const roundIndex = matches[matchIndex].rounds.findIndex((r) => r.id === params.roundId)

    if (roundIndex === -1) {
      return NextResponse.json({ error: "Round non trouvé" }, { status: 404 })
    }

    matches[matchIndex].rounds[roundIndex] = {
      ...matches[matchIndex].rounds[roundIndex],
      ...roundData,
      id: params.roundId,
    }

    return NextResponse.json(matches[matchIndex].rounds[roundIndex])
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du round" }, { status: 500 })
  }
}

/**
 * DELETE /api/protected/matches/{matchId}/rounds/{roundId}
 * 
 * Suppréssion d'un round
 * @param matchData
 * @returns
 * 
 */
export async function DELETE(request: Request, { params }: { params: { matchId: string; roundId: string } }) {
  const { roundId } = await params;

  // TODO: Check if match exist
  const roundInformations = await deleteRound(`Round:${roundId}`);

  return NextResponse.json(roundInformations)
}

