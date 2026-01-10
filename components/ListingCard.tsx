import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  profiles?: {
    id: string
    name: string | null
    email: string | null
  }
}

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.image_url || '/placeholder-image.jpg'
  const authorName = listing.profiles?.name || listing.profiles?.email || 'Usuario'
  const authorInitial = authorName.charAt(0).toUpperCase()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-esmeralda-50 dark:border-gray-700 overflow-hidden">
      {/* Imagen o Placeholder */}
      <div className="h-48 bg-esmeralda-100 dark:bg-esmeralda-900/30 flex items-center justify-center relative overflow-hidden">
        {listing.image_url ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-16 h-16 text-esmeralda-400 dark:text-esmeralda-600"
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
        )}
        
        {/* Category - esquina superior izquierda */}
        {listing.category && (
          <span className="absolute top-3 left-3 text-esmeralda-600 dark:text-esmeralda-400 font-medium text-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            {listing.category}
          </span>
        )}
        
        {/* Price badge - esquina superior derecha */}
        {listing.status === 'active' && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-bold text-esmeralda-700 dark:text-esmeralda-400">
              ₷ {listing.credits_required.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1 line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
          {listing.description || 'Sin descripción disponible'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-tierra-100 dark:bg-tierra-900/30 flex items-center justify-center text-tierra-600 dark:text-tierra-400 text-xs font-bold">
              {authorInitial}
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Por {authorName}
            </span>
          </div>
          <Link
            href={`/listings/${listing.id}`}
            className="bg-esmeralda-600 hover:bg-esmeralda-700 dark:bg-esmeralda-700 dark:hover:bg-esmeralda-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Intercambiar
          </Link>
        </div>
      </div>
    </div>
  )
}
