import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js API with Auth.js and SurrealDB',
  description: 'Backend-only API with JWT authentication',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Next.js API with Auth.js and SurrealDB</h1>
        
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="mb-4">This is a backend-only API project. There is no user interface.</p>
          
          <h2 className="text-2xl font-semibold mb-2">Available Endpoints:</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><code className="bg-gray-200 px-2 py-1 rounded">/api</code> - API information</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded">/api/auth/token</code> - Authentication endpoint</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded">/api/protected/*</code> - Protected routes</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded">/api/health</code> - Health check</li>
          </ul>
          
          <p className="mb-2">For more information, please refer to the README.md file.</p>
        </div>
      </div>
    </main>
  );
}
