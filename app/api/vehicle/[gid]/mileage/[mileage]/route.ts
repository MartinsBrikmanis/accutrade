import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string; mileage: string } }
) {
  try {
    const { gid, mileage } = params
    const apiKey = process.env.ACCU_TRADE_API_KEY

    if (!apiKey) {
      throw new Error('API key is not configured')
    }
    
    // Add apiKey as query parameter instead of header
    const response = await fetch(
      `https://api.accu-trade.com/vehicle/${gid}/mileage/${mileage}?apiKey=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch mileage adjustment')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in mileage adjustment API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mileage adjustment' },
      { status: 500 }
    )
  }
} 