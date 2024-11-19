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

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/styles/${year}/${formattedMake}/${model}?apiKey=${apiKey}`
    
    console.log('Fetching trims from:', url)

    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Raw API Response:', data)

    const trimData = Array.isArray(data) 
      ? data.map(trim => {
          if (typeof trim === 'string') return { trim, gid: '' }
          if (typeof trim === 'object' && trim !== null) {
            return {
              trim: trim.style || `${trim.webmodel || ''} ${trim.extendedGid || ''}`.trim(),
              gid: trim.gid || ''
            }
          }
          return { trim: '', gid: '' }
        }).filter(t => t.trim)
      : []

    console.log('Processed trim names:', trimData)
    return NextResponse.json(trimData)

  } catch (error) {
    console.error('Error fetching trims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trims' },
      { status: 500 }
    )
  }
} 