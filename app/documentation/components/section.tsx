import type { ApiSection } from "../api-data"
import EndpointCard from "./endpoint-card"

interface SectionProps {
  section: ApiSection
}

export default function Section({ section }: SectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
      <p className="mb-6">{section.description}</p>

      {section.endpoints.map((endpoint, index) => (
        <EndpointCard key={index} endpoint={endpoint} />
      ))}
    </section>
  )
}

