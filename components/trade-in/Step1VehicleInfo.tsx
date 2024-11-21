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
import { cn } from "@/lib/utils"
import { StepHeader } from "./StepHeader"

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
  mileage: string
  vehicleBasePrice: number
  vehicleMarketValue: number
  vehiclePriceAdjustment: number
  vehicleDesirability: boolean
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
    mileage: "",
    vehicleBasePrice: 0,
    vehicleMarketValue: 0,
    vehiclePriceAdjustment: 0,
    vehicleDesirability: false,
    rawResponse: null
  })

  // Add function to fetch mileage adjustment
  const fetchMileageAdjustment = async (gid: string, mileage: string) => {
    try {
      const response = await fetch(`/api/vehicle/${gid}/mileage/${mileage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch mileage adjustment')
      }
      
      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        vehiclePriceAdjustment: data.adjustment || 0,
        vehicleDesirability: data.desirable || false
      }))
    } catch (error) {
      console.error('Error fetching mileage adjustment:', error)
      toast.error('Failed to fetch mileage adjustment')
    }
  }

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

  // Helper function to check if style/trim is selected
  const isTrimSelected = () => {
    return inputMethod === 'vin' ? !!selectedVinStyle : !!selectedTrim
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First step: VIN lookup
      if (inputMethod === 'vin' && !vinLookupResult) {
        if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
          toast.error('Please enter a valid 17-character VIN')
          setLoading(false)
          return
        }

        try {
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
        } catch (error) {
          console.error('VIN lookup error:', error)
          toast.error('Failed to find vehicle with this VIN')
        }
        setLoading(false)
        return
      }

      // Second step: Get vehicle value
      let gid: string
      
      if (inputMethod === 'vin') {
        // VIN path validation
        if (!selectedVinStyle) {
          toast.error('Please select a trim level')
          setLoading(false)
          return
        }
        const selectedStyle = vinStyles.find(style => style.style === selectedVinStyle)
        if (!selectedStyle) {
          toast.error('Selected style not found')
          setLoading(false)
          return
        }
        gid = selectedStyle.gid
      } else {
        // Manual path validation
        if (!selectedYear || !selectedMake || !selectedModel || !selectedTrim) {
          toast.error('Please select all vehicle details')
          setLoading(false)
          return
        }
        if (!selectedGid) {
          toast.error('Vehicle trim GID not found')
          setLoading(false)
          return
        }
        gid = selectedGid
      }

      // Validate mileage
      if (!formData.mileage) {
        toast.error('Please enter vehicle mileage')
        setLoading(false)
        return
      }

      // Get vehicle value using the selected GID
      const response = await fetch(`/api/vehicle/gid/${gid}/value`)
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle value')
      }
      const valueData = await response.json()

      // Create vehicle data object with proper value mapping
      const vehicleData: Step1Data = {
        year: inputMethod === 'vin' ? vinLookupResult!.year : selectedYear,
        make: inputMethod === 'vin' ? vinLookupResult!.make : selectedMake,
        model: inputMethod === 'vin' ? vinLookupResult!.model : selectedModel,
        trim: inputMethod === 'vin' ? selectedVinStyle : selectedTrim,
        mileage: formData.mileage,
        vehicleBasePrice: valueData.basePrice || valueData.tradeInValue || 0,
        vehicleMarketValue: valueData.marketValue || 0,
        vehiclePriceAdjustment: 0,
        vehicleDesirability: false,
        rawResponse: valueData,
        gid: gid
      }

      // Get mileage adjustment
      const mileageResponse = await fetch(`/api/vehicle/gid/${gid}/mileage/${formData.mileage}`)
      if (mileageResponse.ok) {
        const mileageData = await mileageResponse.json()
        vehicleData.vehiclePriceAdjustment = mileageData.adjustment || 0
        vehicleData.vehicleDesirability = mileageData.desirable || false
      }

      // Update form data
      setFormData(vehicleData)
      onNext(vehicleData)

    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch vehicle data')
    } finally {
      setLoading(false)
    }
  }

  // Add mileage adjustment display component
  const MileageAdjustmentDisplay = () => {
    if (!formData.vehiclePriceAdjustment) {
      return null
    }

    return (
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Mileage Impact</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Value Adjustment:</span>
            <span className={cn(
              "font-semibold",
              formData.vehiclePriceAdjustment > 0 ? "text-green-600" : "text-red-600"
            )}>
              {new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD',
                maximumFractionDigits: 0
              }).format(formData.vehiclePriceAdjustment)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Mileage Status:</span>
            <span className={cn(
              "text-sm px-2 py-1 rounded",
              formData.vehicleDesirability 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            )}>
              {formData.vehicleDesirability ? "Below Average" : "Above Average"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
        onClose={onClose}
        onLanguageChange={onLanguageChange}
        currentLanguage={currentLanguage}
      />
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

            {/* Add Mileage Input when trim is selected */}
            {isTrimSelected() && (
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-[16px]">Vehicle Mileage (KM)</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="Enter vehicle mileage"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    mileage: e.target.value 
                  }))}
                />
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

      {/* Add Mileage Adjustment Display */}
      {formData.rawResponse && (
        <div className="mt-6 space-y-6">
          <MileageAdjustmentDisplay />
          
          {/* Existing Raw API Response Card */}
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

          {/* Add new card at the bottom - Only show when we have API response */}
          <Card className="border-t">
            <CardContent className="px-[30px] py-4">
              <Button 
                className="w-full"
                onClick={() => onNext(formData)}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
} 