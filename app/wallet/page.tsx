import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCreditsBalance, getTransactionHistory } from '@/lib/wallet/credits'
import WalletActions from '@/components/WalletActions'
import TransactionList from '@/components/TransactionList'

export default async function WalletPage() {
  const supabase = await createClient()
  
  // Obtener el perfil del usuario actual (en producción, usarías autenticación real)
  // Por ahora, usamos un perfil de ejemplo o el primero disponible
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (error || !profiles) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Billetera</h1>
          <div className="p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-gray-700 dark:text-gray-300">
              No hay perfiles disponibles. Por favor, crea un perfil primero.
            </p>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Error: {error.message}
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }

  const profileId = profiles.id
  const balance = await getCreditsBalance(profileId)
  const transactions = await getTransactionHistory(profileId)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Billetera de Créditos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus créditos y consulta tu historial</p>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saldo Actual</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {balance.toLocaleString()} créditos
              </p>
            </div>
          </div>
        </div>

        <WalletActions profileId={profileId} />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Historial de Transacciones</h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </main>
  )
}
