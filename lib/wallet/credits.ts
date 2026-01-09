import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

/**
 * Obtiene el saldo actual de créditos de un perfil
 */
export async function getCreditsBalance(profileId: string): Promise<number> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('wallet')
    .select('credits')
    .eq('profile_id', profileId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    throw new Error(`Error al obtener saldo: ${error.message}`)
  }

  return data?.credits || 0
}

/**
 * Crea o actualiza la billetera de un perfil
 */
export async function initializeWallet(profileId: string, initialCredits: number = 0): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('wallet')
    .upsert({
      profile_id: profileId,
      credits: initialCredits,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(`Error al inicializar billetera: ${error.message}`)
  }
}

/**
 * Agrega créditos a la billetera de un perfil
 */
export async function addCredits(
  profileId: string,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createClient()
  
  // Obtener saldo actual
  const balanceBefore = await getCreditsBalance(profileId)
  const balanceAfter = balanceBefore + amount

  // Inicializar wallet si no existe
  await initializeWallet(profileId, balanceAfter)

  // Crear transacción
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      profile_id: profileId,
      type: 'credit',
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: description || `Créditos agregados: ${amount}`,
    })

  if (transactionError) {
    throw new Error(`Error al crear transacción: ${transactionError.message}`)
  }

  // Actualizar billetera
  const { error: walletError } = await supabase
    .from('wallet')
    .update({
      credits: balanceAfter,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', profileId)

  if (walletError) {
    throw new Error(`Error al actualizar billetera: ${walletError.message}`)
  }
}

/**
 * Deduce créditos de la billetera de un perfil
 */
export async function deductCredits(
  profileId: string,
  amount: number,
  listingId: string | null = null,
  description?: string
): Promise<void> {
  const supabase = await createClient()
  
  // Obtener saldo actual
  const balanceBefore = await getCreditsBalance(profileId)

  if (balanceBefore < amount) {
    throw new Error(`Saldo insuficiente. Saldo actual: ${balanceBefore}, Requerido: ${amount}`)
  }

  const balanceAfter = balanceBefore - amount

  // Crear transacción
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      profile_id: profileId,
      listing_id: listingId,
      type: 'debit',
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: description || `Créditos deducidos: ${amount}`,
    })

  if (transactionError) {
    throw new Error(`Error al crear transacción: ${transactionError.message}`)
  }

  // Actualizar billetera
  const { error: walletError } = await supabase
    .from('wallet')
    .update({
      credits: balanceAfter,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', profileId)

  if (walletError) {
    throw new Error(`Error al actualizar billetera: ${walletError.message}`)
  }
}

/**
 * Obtiene el historial de transacciones de un perfil
 */
export async function getTransactionHistory(profileId: string, limit: number = 50) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Error al obtener historial: ${error.message}`)
  }

  return data || []
}
