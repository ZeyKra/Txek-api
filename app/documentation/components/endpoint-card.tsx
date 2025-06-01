import type { ApiEndpoint } from "../api-data"

interface EndpointCardProps {
  endpoint: ApiEndpoint
}

export default function EndpointCard({ endpoint }: EndpointCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{endpoint.title}</h3>
      <p className="mb-2">
        <strong>{endpoint.method}</strong> {endpoint.path}
      </p>
      <p className="mb-2">{endpoint.description}</p>

      {endpoint.requestBody && (
        <>
          <p className="mb-2">
            <strong>Corps de la requête:</strong>
          </p>
          <pre className="bg-gray-100 p-2 rounded mb-2">{endpoint.requestBody}</pre>
        </>
      )}

      <p>
        <strong>Réponse:</strong> {endpoint.response}
      </p>
    </div>
  )
}

