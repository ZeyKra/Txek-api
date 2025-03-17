import { NextResponse } from "next/server"
import type { Match } from "@/types/match"

// Simulation d'une base de données
const matches: Match[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const match = matches.find((m) => m.id === params.id)

  if (!match) {
    return NextResponse.json({ error: "Match non trouvé" }, { status: 404 })
  }

  return NextResponse.json(match)
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

