import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string; mileage: string } }
) {
  try {
    const { gid, mileage } = params
    const apiKey = process.env.ACCU_TRADE_API_KEY

    const response = await fetch(
      `https://api.accu-trade.com/vehicle/${gid}/mileage/${mileage}?apiKey=${apiKey}`,
      {
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
    console.error('Error fetching mileage adjustment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mileage adjustment' },
      { status: 500 }
    )
  }
} 