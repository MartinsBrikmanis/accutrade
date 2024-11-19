import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string } }
) {
  try {
    const gid = params.gid
    const apiKey = process.env.ACCU_TRADE_API_KEY

    const response = await fetch(
      `https://api.accu-trade.com/vehicle/${gid}?apiKey=${apiKey}`,
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
    console.error('Error fetching vehicle data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
} 