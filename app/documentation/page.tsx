import { apiDocumentation } from "./api-data"
import Section from "./components/section"

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Documentation de l'API du Jeu de Cartes</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p className="mb-4">
          Cette API permet la gestion d'un jeu de cartes en ligne, incluant la gestion des utilisateurs, des matchs et
          des rounds de jeu.
        </p>
      </section>

      {apiDocumentation.map((section, index) => (
        <Section key={index} section={section} />
      ))}
    </div>
  )
}

