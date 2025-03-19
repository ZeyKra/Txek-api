import type React from "react"
export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">API Txek</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

