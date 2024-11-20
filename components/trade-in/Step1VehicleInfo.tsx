import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { vehicleYears, vehicleMakes } from "@/app/assets/constants/vehicle-options"
import { getVehicleByVin } from '@/lib/api'
import { toast } from 'sonner'

interface Step1Props {
  onNext: (data: Step1Data) => void
  initialData?: Step1Data
  onClose?: () => void
  onLanguageChange?: (lang: 'en' | 'fr') => void
  currentLanguage?: 'en' | 'fr'
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step1Data {
  year: string
  make: string
  model: string
  trim: string
  tradeInValue: number
  marketValue: number
  rawResponse: any
  gid?: string
}

// Add VIN lookup result interface
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

export function Step1VehicleInfo({ 
  onNext, 
  initialData, 
  onClose,
  onLanguageChange,
  currentLanguage,
  currentStep,
  totalSteps,
  onBack
}: Step1Props) {
  // Input method state
  const [inputMethod, setInputMethod] = useState<'vin' | 'manual'>('vin')
  const [loading, setLoading] = useState(false)

  // VIN-related states
  const [vin, setVin] = useState('')
  const [vinLookupResult, setVinLookupResult] = useState<VinLookupResult | null>(null)
  const [vinStyles, setVinStyles] = useState<Array<{
    style: string,
    gid: string
  }>>([])
  const [selectedVinStyle, setSelectedVinStyle] = useState<string>('')

  // Manual selection states
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedTrim, setSelectedTrim] = useState('')
  const [selectedGid, setSelectedGid] = useState<string>('')

  // Available options states
  const [availableMakes, setAvailableMakes] = useState<Array<{
    value: string,
    label: string
  }>>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [availableTrims, setAvailableTrims] = useState<Array<{
    trim: string,
    gid: string
  }>>([])

  // Form data state
  const [formData, setFormData] = useState<Step1Data>(initialData || {
    year: "",
    make: "",
    model: "",
    trim: "",
    tradeInValue: 0,
    marketValue: 0,
    rawResponse: null
  })

  // Handle make selection
  const handleMakeSelect = async (make: string) => {
    setSelectedMake(make)
    setSelectedModel('')
    setSelectedTrim('')
    
    try {
      const makeLabel = vehicleMakes.find(m => m.value === make)?.label || make
      const response = await fetch(`/api/vehicle/models?year=${selectedYear}&make=${makeLabel}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      
      const data = await response.json()
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

  // Handle trim selection
  const handleTrimSelect = (value: string) => {
    const selectedTrimData = availableTrims.find(t => t.trim === value)
    if (selectedTrimData) {
      setSelectedTrim(selectedTrimData.trim)
      setSelectedGid(selectedTrimData.gid)
    }
  }

  // Handle year selection
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let vehicleData: Step1Data

      if (inputMethod === 'vin') {
        if (!vinLookupResult) {
          // First step: VIN lookup
          if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
            toast.error('Please enter a valid 17-character VIN (alphanumeric characters only)')
            return
          }

          const data = await getVehicleByVin(vin)
          if (Array.isArray(data) && data.length > 0) {
            setVinLookupResult(data[0])
            const styles = data.map(item => ({
              style: item.style,
              gid: item.gid
            }))
            setVinStyles(styles)
          } else {
            throw new Error('No vehicle data found for this VIN')
          }
        } else {
          // Second step: Get vehicle value using selected style's GID
          if (!selectedVinStyle) {
            toast.error('Please select a style/trim')
            return
          }

          const selectedStyle = vinStyles.find(style => style.style === selectedVinStyle)
          if (!selectedStyle) {
            toast.error('Selected style not found')
            return
          }

          // Make the API call using the GID
          const response = await fetch(`/api/vehicle/gid/${selectedStyle.gid}`)
          if (!response.ok) {
            throw new Error('Failed to fetch vehicle data')
          }

          const data = await response.json()
          vehicleData = {
            year: vinLookupResult.year,
            make: vinLookupResult.make,
            model: vinLookupResult.model,
            trim: selectedVinStyle,
            tradeInValue: data.tradeInValue || 0,
            marketValue: data.marketValue || 0,
            rawResponse: data,
            gid: selectedStyle.gid
          }
          setFormData(vehicleData)
          onNext(vehicleData)
        }
      } else {
        if (!selectedYear || !selectedMake || !selectedModel || !selectedTrim) {
          toast.error('Please select all vehicle details')
          return
        }

        const response = await fetch(`/api/vehicle/gid/${selectedGid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data')
        }

        const data = await response.json()
        vehicleData = {
          year: selectedYear,
          make: selectedMake,
          model: selectedModel,
          trim: selectedTrim,
          tradeInValue: data.tradeInValue || 0,
          marketValue: data.marketValue || 0,
          rawResponse: data,
          gid: selectedGid
        }
        setFormData(vehicleData)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch vehicle data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card 
      className="w-full mx-auto"
      onClose={onClose}
      onLanguageChange={onLanguageChange}
      currentLanguage={currentLanguage}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={onBack}
    >
      <CardHeader className="px-[30px] text-left">
        <CardTitle className="font-manrope text-[21px] font-extrabold text-black leading-normal">
          Vehicle Information
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          Enter your VIN or select your vehicle details manually.
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
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

      {/* Add API Response Card */}
      {formData.rawResponse && (
        <div className="mt-6">
          <Card>
            <CardHeader className="ml-[30px] mb-[30px]">
              <CardTitle>Raw API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(formData.rawResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
} 