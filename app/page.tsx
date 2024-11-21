"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getVehicleByVin } from '@/lib/api'
import { toast } from 'sonner'
import { vehicleYears, vehicleMakes } from "@/app/assets/constants/vehicle-options"
import { StepHeader } from '@/components/trade-in/StepHeader'

interface VehicleData {
  year: string
  make: string
  model: string
  trim: string
  tradeInValue: number
  marketValue: number
  rawResponse: VinLookupResult[]
  gid?: string
}

// Modify the interface to better match the API response structure
interface VinLookupResult {
  gid: string
  extendedGid: string
  year: string
  make: string
  model: string
  style: string
  webmodel: string
  isSelected: boolean
}

export default function TradeInPage() {
  const [inputMethod, setInputMethod] = useState<'vin' | 'manual'>('vin')
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
  
  // States for manual selection
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedTrim, setSelectedTrim] = useState('')
  const [selectedGid, setSelectedGid] = useState<string>('')

  // Add state for available options
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [availableTrims, setAvailableTrims] = useState<Array<{
    trim: string,
    gid: string
  }>>([])

  // Add new state for available makes
  const [availableMakes, setAvailableMakes] = useState<Array<{
    value: string,
    label: string
  }>>([])

  // Add new state near the top of the component with other states
  const [vinLookupResult, setVinLookupResult] = useState<VinLookupResult | null>(null)

  // Add new state for available styles from VIN lookup
  const [vinStyles, setVinStyles] = useState<Array<{
    style: string,
    gid: string
  }>>([])

  // Add state for selected style
  const [selectedVinStyle, setSelectedVinStyle] = useState<string>('')

  // Handle make selection
  const handleMakeSelect = async (make: string) => {
    setSelectedMake(make)
    setSelectedModel('')
    setSelectedTrim('')
    
    try {
      const makeLabel = vehicleMakes.find(m => m.value === make)?.label || make
      
      const response = await fetch(
        `/api/vehicle/models?year=${selectedYear}&make=${makeLabel}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      
      const data = await response.json()
      console.log('Models data received:', data)
      
      if (Array.isArray(data)) {
        setAvailableModels(data)
      } else {
        console.error('Unexpected models data format:', data)
        setAvailableModels([])
      }
    } catch (error) {
      console.error('Error fetching models:', error)
      toast.error('Failed to fetch models')
      setAvailableModels([])
    }
  }

  // Handle model selection
  const handleModelSelect = async (model: string) => {
    setSelectedModel(model)
    setSelectedTrim('')
    setSelectedGid('')
    
    try {
      const makeLabel = vehicleMakes.find(m => m.value === selectedMake)?.label || selectedMake
      
      const response = await fetch(
        `/api/vehicle/trims?year=${selectedYear}&make=${makeLabel}&model=${model}`
      )
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch trims')
      }
      
      const data = await response.json()
      console.log('Trims data received:', data) // Debug log
      
      // Update this to match the API response structure
      setAvailableTrims(Array.isArray(data) ? data : [])
      
      if (!data.length) {
        toast.error('No trims found for this model')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch trims')
      setAvailableTrims([])
    }
  }

  // Update the trim selection handler to match the data structure
  const handleTrimSelect = (value: string) => {
    const selectedTrimData = availableTrims.find(t => t.trim === value)
    if (selectedTrimData) {
      setSelectedTrim(selectedTrimData.trim)
      setSelectedGid(selectedTrimData.gid)
      console.log('Selected trim data:', selectedTrimData) // Debug log
    }
  }

  // Add handler for year selection
  const handleYearSelect = async (year: string) => {
    setSelectedYear(year)
    setSelectedMake('')
    setSelectedModel('')
    setSelectedTrim('')
    setSelectedGid('')
    
    try {
      const response = await fetch(`/api/vehicle/makes?year=${year}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch makes')
      }
      
      const data = await response.json()
      console.log('Makes data received:', data)
      
      if (Array.isArray(data)) {
        setAvailableMakes(data)
      } else {
        console.error('Unexpected makes data format:', data)
        setAvailableMakes([])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch makes')
      setAvailableMakes([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (inputMethod === 'vin') {
        // Validate VIN format
        if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
          toast.error('Please enter a valid 17-character VIN (alphanumeric characters only)')
          setLoading(false)
          return
        }

        const data = await getVehicleByVin(vin)
        // Set the first item from the array as our lookup result
        if (Array.isArray(data) && data.length > 0) {
          setVinLookupResult(data[0])
          // Extract styles from the response
          const styles = data.map(item => ({
            style: item.style,
            gid: item.gid
          }))
          setVinStyles(styles)
        }
        
        setVehicleData({
          year: data[0].year,
          make: data[0].make,
          model: data[0].model,
          trim: data[0].style,
          tradeInValue: data[0].tradeInValue || 0,
          marketValue: data[0].marketValue || 0,
          rawResponse: data
        })
      } else {
        // Validate manual selection
        if (!selectedYear || !selectedMake || !selectedModel || !selectedTrim) {
          toast.error('Please select all vehicle details')
          return
        }

        // Use GID to fetch vehicle data
        const response = await fetch(`/api/vehicle/gid/${selectedGid}`)

        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data')
        }

        const data = await response.json()
        setVehicleData({
          year: selectedYear,
          make: selectedMake,
          model: selectedModel,
          trim: selectedTrim,
          tradeInValue: data.tradeInValue || 0,
          marketValue: data.marketValue || 0,
          rawResponse: data,
          gid: selectedGid
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch vehicle data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-left pl-[20px] pb-[20px]">
          <h1 className="text-3xl font-bold">Trade-In Evaluation Tool</h1>
          <p className="text-muted-foreground mt-2">
            Get the most accurate trade-in values for your vehicle.
          </p>
        </div>

        {/* First Card with StepHeader */}
        <div className="bg-[#F2F2F7] shadow-sm w-full mx-auto" style={{ width: '540px' }}>
          <StepHeader 
            hideCounter={true}
            onClose={() => {/* handle close */}}
          />
          <Card>
            <CardHeader className="ml-[30px] mb-[30px]">
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Enter your VIN or select your vehicle details manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={inputMethod === 'vin' ? 'default' : 'outline'}
                    onClick={() => setInputMethod('vin')}
                  >
                    Enter VIN
                  </Button>
                  <Button
                    variant={inputMethod === 'manual' ? 'default' : 'outline'}
                    onClick={() => setInputMethod('manual')}
                  >
                    Manual Selection
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {inputMethod === 'vin' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter your VIN"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        maxLength={17}
                      />
                      <p className="text-sm text-muted-foreground">
                        Your VIN is a 17-character alphanumeric code.
                      </p>
                      {vinLookupResult && (
                        <>
                          <h2 className="text-xl font-semibold mt-4">
                            Select trim for your {vinLookupResult.year} {vinLookupResult.make} {vinLookupResult.model}
                          </h2>
                          <Select 
                            value={selectedVinStyle}
                            onValueChange={setSelectedVinStyle}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select Style/Trim" />
                            </SelectTrigger>
                            <SelectContent>
                              {vinStyles.map((style) => (
                                <SelectItem 
                                  key={style.gid} 
                                  value={style.style}
                                >
                                  {style.style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  )}

                  {inputMethod === 'manual' && (
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={selectedYear} onValueChange={handleYearSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select 
                        value={selectedMake} 
                        onValueChange={handleMakeSelect}
                        disabled={!selectedYear || availableMakes.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMakes.map((make) => (
                            <SelectItem key={make.value} value={make.value}>
                              {make.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select 
                        value={selectedModel} 
                        onValueChange={handleModelSelect}
                        disabled={!selectedMake}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select 
                        value={selectedTrim} 
                        onValueChange={handleTrimSelect}
                        disabled={!selectedModel || availableTrims.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Trim" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrims.map((trim) => (
                            <SelectItem 
                              key={trim.gid || trim.trim} 
                              value={trim.trim}
                            >
                              {trim.trim}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Loading...' : (
                      inputMethod === 'vin' && !vinLookupResult 
                        ? 'Find A Vehicle'
                        : 'Get Vehicle Value'
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {vehicleData && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="ml-[30px] mb-[30px]">
                <CardTitle>Raw API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(vehicleData.rawResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
} 