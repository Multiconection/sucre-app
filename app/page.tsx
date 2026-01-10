import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ListingCard from '@/components/ListingCard'

export default async function Home() {
  const supabase = await createClient()
  
  // Obtener listados recientes activos
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
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Listados Recientes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre oportunidades de intercambio en tu comunidad
          </p>
        </div>

        {/* Grid de listados */}
        {error ? (
          <div className="p-6 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200">
              Error al cargar listados: {error.message}
            </p>
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay listados disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sé el primero en publicar un listado en la plataforma
            </p>
            <a
              href="/listings/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-tierra-600 to-tierra-700 text-white rounded-lg font-medium hover:from-tierra-700 hover:to-tierra-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Crear Primer Listado
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Ver más link */}
        {listings && listings.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="/listings"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
            >
              Ver todos los listados
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
