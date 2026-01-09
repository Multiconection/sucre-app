import { NextRequest, NextResponse } from 'next/server'
import { addCredits } from '@/lib/wallet/credits'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, amount, description } = body

    if (!profileId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'profileId y amount son requeridos, amount debe ser mayor a 0' },
        { status: 400 }
      )
    }

    await addCredits(profileId, amount, description)

    return NextResponse.json({ success: true, message: 'Créditos agregados exitosamente' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al agregar créditos' },
      { status: 500 }
    )
  }
}
