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
import { Separator } from '@/components/ui/separator'
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

interface VehicleData {
  year: string
  make: string
  model: string
  trim: string
  tradeInValue: number
  marketValue: number
  rawResponse: any
  gid?: string
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
        
        setVehicleData({
          year: data.year,
          make: data.make,
          model: data.model,
          trim: data.trim,
          tradeInValue: data.tradeInValue || 0,
          marketValue: data.marketValue || 0,
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
        <div className="text-center">
          <h1 className="text-3xl font-bold">Trade-In Evaluation Tool</h1>
          <p className="text-muted-foreground mt-2">
            Get the most accurate trade-in values for your vehicle.
          </p>
        </div>

        <Card>
          <CardHeader>
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
                {inputMethod === 'vin' ? (
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
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
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
                      disabled={!selectedYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleMakes.map((make) => (
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
                  {loading ? 'Loading...' : 'Get Vehicle Value'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {vehicleData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{vehicleData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="font-medium">{vehicleData.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{vehicleData.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trim</p>
                    <p className="font-medium">{vehicleData.trim}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trade-In Value</p>
                    <p className="font-medium">
                      ${vehicleData.tradeInValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Value</p>
                    <p className="font-medium">
                      ${vehicleData.marketValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
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