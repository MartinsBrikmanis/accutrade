const API_BASE_URL = 'http://api.accu-trade.com'

export async function getVehicleByVin(vin: string) {
  try {
    // Validate VIN format (17 alphanumeric characters)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      throw new Error('Invalid VIN format')
    }

    const response = await fetch('/api/vehicle/vin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vin }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch vehicle data')
    }

    return response.json()
  } catch (error) {
    throw error
  }
} 