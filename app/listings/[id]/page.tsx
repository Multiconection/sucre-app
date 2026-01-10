import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCreditsBalance } from '@/lib/wallet/credits'
import Header from '@/components/Header'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:profile_id (
        id,
        name,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !listing) {
    notFound()
  }

  const profile = listing.profiles as any
  const imageUrl = listing.image_url || '/placeholder-image.jpg'

  // Obtener saldo del usuario actual para verificar si puede comprar
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle()

  let userBalance = 0
  let canPurchase = false
  if (currentProfile) {
    userBalance = await getCreditsBalance(currentProfile.id)
    canPurchase = userBalance >= listing.credits_required && listing.status === 'active'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="text-esmeralda-600 dark:text-esmeralda-400 hover:text-esmeralda-700 dark:hover:text-esmeralda-300 text-sm font-medium"
          >
            ← Volver al inicio
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            {listing.image_url ? (
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-tierra-100 to-esmeralda-100 dark:from-tierra-900/30 dark:to-esmeralda-900/30">
                <svg
                  className="w-32 h-32 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {listing.category && (
                  <span className="px-4 py-1 bg-esmeralda-100 dark:bg-esmeralda-900/30 text-esmeralda-700 dark:text-esmeralda-400 text-sm font-semibold rounded-full">
                    {listing.category}
                  </span>
                )}
                <span
                  className={`px-4 py-1 text-sm font-semibold rounded-full ${
                    listing.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : listing.status === 'sold'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {listing.status === 'active' ? 'Disponible' : listing.status === 'sold' ? 'Vendido' : 'Inactivo'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {listing.title}
              </h1>
            </div>

            {/* Price */}
            <div className="p-6 bg-gradient-to-r from-esmeralda-50 to-tierra-50 dark:from-esmeralda-900/20 dark:to-tierra-900/20 rounded-xl border border-esmeralda-200 dark:border-esmeralda-800">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Precio en Sucres</p>
                  <p className="text-4xl font-bold text-esmeralda-700 dark:text-esmeralda-400">
                    {listing.credits_required.toLocaleString()} ₷
                  </p>
                  {listing.price > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Equivalente a ${listing.price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Descripción
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Seller info */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Publicado por
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {profile?.name || profile?.email || 'Usuario'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Publicado el {new Date(listing.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {canPurchase ? (
                <button className="w-full px-6 py-4 bg-gradient-to-r from-esmeralda-600 to-esmeralda-700 text-white rounded-lg font-semibold text-lg hover:from-esmeralda-700 hover:to-esmeralda-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Comprar con {listing.credits_required.toLocaleString()} ₷
                </button>
              ) : (
                <div className="w-full px-6 py-4 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-semibold text-lg text-center cursor-not-allowed">
                  {listing.status !== 'active'
                    ? 'Este listado no está disponible'
                    : userBalance < listing.credits_required
                    ? `Saldo insuficiente. Necesitas ${(listing.credits_required - userBalance).toLocaleString()} ₷ más`
                    : 'Inicia sesión para comprar'}
                </div>
              )}
              
              <Link
                href="/wallet"
                className="block w-full px-6 py-3 text-center border-2 border-tierra-600 dark:border-tierra-500 text-tierra-600 dark:text-tierra-400 rounded-lg font-medium hover:bg-tierra-50 dark:hover:bg-tierra-900/20 transition-colors"
              >
                Gestionar Billetera
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
