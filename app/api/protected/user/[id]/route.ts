import { NextResponse } from "next/server"
import type { User } from "@/types/User"
import { getUserInformations } from "@/app/backend/surreal-actions"
// Simulation d'une base de données
const users: User[] = []

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userInformations = await getUserInformations(id)

    if (!userInformations) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json(userInformations)
  } catch(error) {
    return NextResponse.json({ error: "Erreur lors de la recuperation d'un joueur" }, { status: 500 })
  }

}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const index = users.findIndex((u) => u.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    users[index] = {
      ...users[index],
      ...userData,
      id: params.id, // Assurer que l'ID ne change pas
    }

    return NextResponse.json(users[index])
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = users.findIndex((u) => u.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
  }

  users.splice(index, 1)

  return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
}

