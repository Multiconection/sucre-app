import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ListingsPage() {
  const supabase = await createClient()
  
  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:profile_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Listados</h1>
          <div className="p-6 border rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
            Error al cargar listados: {error.message}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold mb-2">Listados</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona los listados disponibles</p>
          </div>
          <Link
            href="/listings/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo Listado
          </Link>
        </div>

        {!listings || listings.length === 0 ? (
          <div className="p-6 border rounded-lg text-center text-gray-500 dark:text-gray-400">
            No hay listados registrados aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const profile = listing.profiles as any
              return (
                <div
                  key={listing.id}
                  className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : listing.status === 'sold'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {listing.description || 'Sin descripción'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold">${listing.price?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Créditos requeridos:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {listing.credits_required.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Por: {profile?.name || profile?.email || 'Usuario'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
