import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'

export default async function TransactionsPage() {
  const supabase = await createClient()
  
  // Obtener todas las transacciones con información relacionada
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles:profile_id (
        id,
        name,
        email
      ),
      listings:listing_id (
        id,
        title
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-esmeralda-600 hover:text-esmeralda-700 dark:text-esmeralda-400 dark:hover:text-esmeralda-300 text-sm mb-2 inline-block transition-colors"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Historial de Transacciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registro completo de todas las transacciones en la plataforma
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">
                  Error al cargar transacciones
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && (!transactions || transactions.length === 0) && (
          <div className="text-center py-16 px-4">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay transacciones registradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Las transacciones aparecerán aquí cuando se realicen intercambios o se gestionen créditos en la plataforma.
            </p>
            <Link
              href="/wallet"
              className="inline-block px-6 py-3 bg-gradient-to-r from-esmeralda-600 to-esmeralda-700 text-white rounded-lg font-medium hover:from-esmeralda-700 hover:to-esmeralda-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Ir a Billetera
            </Link>
          </div>
        )}

        {/* Transactions List */}
        {!error && transactions && transactions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Saldo Anterior
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Saldo Posterior
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Listado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => {
                    const profile = transaction.profiles as any
                    const listing = transaction.listings as any
                    const isCredit = transaction.type === 'credit'
                    
                    return (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(transaction.created_at).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {profile?.name || profile?.email || 'Usuario'}
                          </div>
                          {profile?.email && profile?.name && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              isCredit
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {isCredit ? (
                              <>
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Crédito
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                                Débito
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${
                            isCredit
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {isCredit ? '+' : '-'}
                            {transaction.amount.toLocaleString()} ₷
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {transaction.balance_before.toLocaleString()} ₷
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {transaction.balance_after.toLocaleString()} ₷
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {listing?.title ? (
                            <Link
                              href={`/listings/${listing.id}`}
                              className="text-sm text-esmeralda-600 dark:text-esmeralda-400 hover:text-esmeralda-700 dark:hover:text-esmeralda-300 font-medium transition-colors line-clamp-1"
                            >
                              {listing.title}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {transaction.description || '-'}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => {
                const profile = transaction.profiles as any
                const listing = transaction.listings as any
                const isCredit = transaction.type === 'credit'
                
                return (
                  <div
                    key={transaction.id}
                    className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Header: Date and Type */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isCredit
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {isCredit ? 'Crédito' : 'Débito'}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className={`text-2xl font-bold ${
                      isCredit
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isCredit ? '+' : '-'}
                      {transaction.amount.toLocaleString()} ₷
                    </div>

                    {/* Profile */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Por:</span> {profile?.name || profile?.email || 'Usuario'}
                    </div>

                    {/* Balance */}
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Saldo anterior</div>
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {transaction.balance_before.toLocaleString()} ₷
                        </div>
                      </div>
                      <div className="text-center">
                        <svg
                          className="w-5 h-5 mx-auto text-gray-400 dark:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Saldo posterior</div>
                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                          {transaction.balance_after.toLocaleString()} ₷
                        </div>
                      </div>
                    </div>

                    {/* Listing */}
                    {listing?.title && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Listado:</div>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-sm text-esmeralda-600 dark:text-esmeralda-400 hover:text-esmeralda-700 dark:hover:text-esmeralda-300 font-medium transition-colors"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    )}

                    {/* Description */}
                    {transaction.description && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Descripción:</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.description}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!error && transactions && transactions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transacciones</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Créditos Totales</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                +{transactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()} ₷
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Débitos Totales</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                -{transactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()} ₷
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
