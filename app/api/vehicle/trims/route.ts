import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const make = searchParams.get('make')
    const model = searchParams.get('model')

    if (!year || !make || !model) {
      return NextResponse.json(
        { error: 'Year, make, and model are required' },
        { status: 400 }
      )
    }

    const formattedMake = make.charAt(0).toUpperCase() + make.slice(1).toLowerCase()
    const formattedModel = model.toLowerCase().replace(/\s+/g, '-')

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/styles/${year}/${formattedMake}/${formattedModel}?apiKey=${apiKey}`
    
    console.log('Fetching trims from:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Raw trims data:', data)

    let trimNames: string[] = []
    if (Array.isArray(data)) {
      trimNames = data.filter(trim => trim && typeof trim === 'string')
    } else if (data && typeof data === 'object') {
      trimNames = Object.values(data)
        .filter(trim => trim && typeof trim === 'string')
    }

    console.log('Processed trims:', trimNames)
    return NextResponse.json(trimNames)

  } catch (error) {
    console.error('Error fetching trims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trims' },
      { status: 500 }
    )
  }
} 