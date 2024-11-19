import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { vin } = await request.json()

    if (!vin || vin.length !== 17) {
      return NextResponse.json(
        { error: 'Invalid VIN' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const response = await fetch(
      `https://api.accu-trade.com/vehicleByVIN/${vin}?apiKey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching vehicle data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
} 