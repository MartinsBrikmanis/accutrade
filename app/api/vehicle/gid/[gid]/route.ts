import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string } }
) {
  try {
    const gid = params.gid

    if (!gid) {
      return NextResponse.json(
        { error: 'GID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ACCU_TRADE_API_KEY
    if (!apiKey) {
      console.error('ACCU_TRADE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const url = `https://api.accu-trade.com/vehicle/${gid}?apiKey=${apiKey}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AccuTrade API Error:', {
        status: response.status,
        response: errorText
      })
      return NextResponse.json(
        { error: `Vehicle lookup failed: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('AccuTrade GID API Response:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in GID lookup:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
} 