import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { vin } = await request.json()

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN is required' },
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

    const url = `https://api.accu-trade.com/vehicleByVIN/${vin}?apiKey=${apiKey}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
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
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in VIN lookup:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get('vin')

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN is required' },
      { status: 400 }
    )
  }

  const mockRequest = new Request('http://localhost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vin })
  })

  return POST(mockRequest)
} 