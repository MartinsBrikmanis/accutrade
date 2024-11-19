import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const make = searchParams.get('make')

    if (!year || !make) {
      return NextResponse.json(
        { error: 'Year and make are required' },
        { status: 400 }
      )
    }

    const formattedMake = make.charAt(0).toUpperCase() + make.slice(1).toLowerCase()

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/models/${year}/${formattedMake}?apiKey=${apiKey}`
    
    console.log('Fetching models from:', url)

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
    console.log('API Response data:', data)

    const modelNames = Array.isArray(data) 
      ? data.map(model => typeof model === 'object' ? model.name || model.model : model)
      : []

    return NextResponse.json(modelNames)

  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
} 