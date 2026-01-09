'use client'

import { useState } from 'react'

interface WalletActionsProps {
  profileId: string
}

export default function WalletActions({ profileId }: WalletActionsProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAddCredits = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Por favor ingresa un monto válido' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/wallet/add-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          amount: parseFloat(amount),
          description: description || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar créditos')
      }

      setMessage({ type: 'success', text: `Se agregaron ${amount} créditos exitosamente` })
      setAmount('')
      setDescription('')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al agregar créditos' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeductCredits = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Por favor ingresa un monto válido' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/wallet/deduct-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          amount: parseFloat(amount),
          description: description || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al deducir créditos')
      }

      setMessage({ type: 'success', text: `Se dedujeron ${amount} créditos exitosamente` })
      setAmount('')
      setDescription('')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al deducir créditos' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Acciones de Billetera</h3>
      
      {message && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Cantidad de Créditos
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Descripción (opcional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción de la transacción"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddCredits}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Procesando...' : 'Agregar Créditos'}
          </button>
          <button
            onClick={handleDeductCredits}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Procesando...' : 'Deducir Créditos'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Nota: Las operaciones de créditos se registrarán en tu historial de transacciones.
      </p>
    </div>
  )
}
