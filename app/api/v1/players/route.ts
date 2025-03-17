import { NextResponse } from "next/server"
import type { User } from "@/types/user"

// Simulation d'une base de données
const users: User[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const user = await request.json()

    // Validation basique
    if (!user.username) {
      return NextResponse.json({ error: "Le nom d'utilisateur est requis" }, { status: 400 })
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: user.username,
      email: user.email,
      createdAt: new Date(),
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
      },
    }

    users.push(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

