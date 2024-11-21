import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string } }
) {
  try {
    const { gid } = params
    const apiKey = process.env.ACCU_TRADE_API_KEY

    if (!apiKey) {
      console.error('API key is not configured')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.accu-trade.com/vehicle/${gid}?apiKey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}):`, errorText)
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Validate the response data
    if (!data || (typeof data.trade !== 'number' && typeof data.market !== 'number')) {
      console.error('Invalid API response data:', data)
      return NextResponse.json(
        { error: 'Invalid response data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tradeInValue: data.trade || 0,
      marketValue: data.market || 0,
      basePrice: data.trade || 0,
      rawResponse: data
    })

  } catch (error) {
    console.error('Error fetching vehicle value:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle value' },
      { status: 500 }
    )
  }
} 