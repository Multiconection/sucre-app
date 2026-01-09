import type { Database } from '@/lib/supabase/types'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-6 border rounded-lg text-center text-gray-500 dark:text-gray-400">
        No hay transacciones registradas aún.
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Saldo Antes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Saldo Después
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Descripción
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {new Date(transaction.created_at).toLocaleString('es-ES')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'credit'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {transaction.type === 'credit' ? '+' : '-'}
                {transaction.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {transaction.balance_before.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {transaction.balance_after.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {transaction.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
