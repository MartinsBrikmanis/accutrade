import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
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

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/vehicle/manual/${year}/${make}/${model}?apiKey=${apiKey}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle data')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in manual vehicle lookup:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json()
    const { year, make, model, trim } = data

    if (!year || !make || !model || !trim) {
      return NextResponse.json(
        { error: 'Year, make, model, and trim are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ACCU_TRADE_API_KEY
    const url = `https://api.accu-trade.com/vehicle/manual?apiKey=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, make, model, trim }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle data')
    }

    const responseData = await response.json()
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error in manual vehicle lookup:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    )
  }
} 