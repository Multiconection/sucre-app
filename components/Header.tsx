import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCreditsBalance } from '@/lib/wallet/credits'

export default async function Header() {
  const supabase = await createClient()
  
  // Obtener el primer perfil disponible (en producción usarías autenticación real)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle()

  let balance = 0
  if (profile) {
    balance = await getCreditsBalance(profile.id)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo SUCRE */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-tierra-600 to-esmeralda-600 bg-clip-text text-transparent">
              SUCRE
            </div>
          </Link>

          {/* Right side: Balance and Publish button */}
          <div className="flex items-center space-x-4">
            {/* Balance */}
            <Link
              href="/wallet"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-esmeralda-50 to-tierra-50 dark:from-esmeralda-900/20 dark:to-tierra-900/20 border border-esmeralda-200 dark:border-esmeralda-800 hover:shadow-md transition-shadow"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">Saldo:</span>
              <span className="text-lg font-bold text-esmeralda-700 dark:text-esmeralda-400">
                {balance.toLocaleString()} ₷
              </span>
            </Link>

            {/* Publish button */}
            <Link
              href="/listings/new"
              className="px-6 py-2 bg-gradient-to-r from-tierra-600 to-tierra-700 text-white rounded-lg font-medium hover:from-tierra-700 hover:to-tierra-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Publicar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
