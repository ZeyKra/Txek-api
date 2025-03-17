import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">API du Jeu de Cartes</h1>
      <p className="text-xl mb-8">
        Bienvenue dans l'API de notre jeu de cartes! Cette API permet de gérer les utilisateurs, les matchs et les
        rounds de jeu.
      </p>
      <div className="mb-8">
        <Link
          href="/documentation"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Consulter la Documentation
        </Link>
      </div>
    </div>
  )
}

