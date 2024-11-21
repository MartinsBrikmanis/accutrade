import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { gid: string; mileage: string } }
) {
  try {
    const { gid, mileage } = params
    const apiKey = process.env.ACCU_TRADE_API_KEY

    // First get the vehicle data to compare with base mileage
    const response = await fetch(
      `https://api.accu-trade.com/vehicle/${gid}?apiKey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Disable caching
      }
    )

    if (!response.ok) {
      console.error(`API error: ${response.status}`)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Calculate mileage adjustment based on average mileage
    const avgMileage = data.avgMileage || data.basemiles || 100000 // fallback value
    const currentMiles = parseInt(mileage)
    const mileageDiff = currentMiles - avgMileage
    const isDesirable = currentMiles < avgMileage
    
    // Calculate adjustment (example: $100 per 1000 miles difference)
    const adjustment = Math.round((mileageDiff / 1000) * -100)

    return NextResponse.json({
      adjustment: adjustment,
      desirable: isDesirable,
      baseMiles: avgMileage,
      currentMiles: currentMiles
    })

  } catch (error) {
    console.error('Error fetching mileage adjustment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mileage adjustment' },
      { status: 500 }
    )
  }
} 