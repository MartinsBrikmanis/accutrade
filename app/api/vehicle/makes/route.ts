import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/makes/byYear/${year}?apiKey=${apiKey}`
    
    console.log('Fetching makes from:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the API response to match our expected format
    const makes = Array.isArray(data) 
      ? data.map(make => ({
          value: make.make.toLowerCase(),
          label: make.make
        }))
      : []

    return NextResponse.json(makes)

  } catch (error) {
    console.error('Error fetching makes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch makes' },
      { status: 500 }
    )
  }
} 