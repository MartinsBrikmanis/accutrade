import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vehicleYears, vehicleMakes } from "@/app/assets/constants/vehicle-options"
import { getVehicleByVin } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import { StepHeader } from "./StepHeader"

interface Step1Props {
  onNext: (data: Step1Data) => void
  initialData?: Step1Data
  onClose?: () => void
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  hideCounter?: boolean
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
  rawResponse: VinLookupResult | null
  gid?: string
}

// Expand the VinLookupResult interface to include all possible fields
interface VinLookupResult {
  gid: string
  extendedGid: string
  year: string
  make: string
  model: string
  trim: string
  basePrice?: number
  marketValue?: number
  priceAdjustment?: number
  desirability?: boolean
  [key: string]: unknown // For any additional fields from the API
}

// Add near the top of the component
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(amount)
}

// Add this function near the top of the component
const validateVehicleData = (data: Step1Data): boolean => {
  if (!data.year || !data.make || !data.model || !data.trim || !data.mileage) {
    console.error('Missing required vehicle data:', data)
    return false
  }
  return true
}

export function Step1VehicleInfo({ 
  onNext, 
  initialData, 
  onClose,
  currentStep,
  totalSteps,
  onBack,
  hideCounter
}: Step1Props) {
  // State declarations first
  const [inputMethod, setInputMethod] = useState<'vin' | 'manual'>('vin')
  const [loading, setLoading] = useState(false)
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

  // Near the top of the component, add this check
  useEffect(() => {
    if (!onNext) {
      console.error('onNext callback is not defined')
    }
  }, [onNext])

  // Move helper functions inside the component
  const handleVinLookup = async () => {
    try {
      // Log the VIN being looked up
      console.log('Looking up VIN:', vin)

      // Validate VIN format first
      if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
        throw new Error('Invalid VIN format')
      }

      const response = await getVehicleByVin(vin)
      console.log('Raw VIN lookup response:', response)

      // Check if response is an array and has content
      if (!Array.isArray(response) || response.length === 0) {
        throw new Error('No vehicle data found for this VIN')
      }

      // Get the first result
      const vehicleData = response[0]
      console.log('Vehicle data from response:', vehicleData)

      // Validate required fields
      if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
        throw new Error('Incomplete vehicle data received')
      }

      // Set the VIN lookup result
      setVinLookupResult({
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        gid: vehicleData.gid || '',
        extendedGid: vehicleData.extendedGid || '',
        trim: vehicleData.trim || '',
        basePrice: vehicleData.basePrice || 0,
        marketValue: vehicleData.marketValue || 0,
        priceAdjustment: vehicleData.priceAdjustment || 0,
        desirability: vehicleData.desirability || false
      })

      // Extract and set available styles
      const styles = response.map(item => ({
        style: item.trim || item.style || `${item.year} ${item.make} ${item.model}`,
        gid: item.gid || ''
      })).filter(style => style.style && style.gid)

      if (styles.length === 0) {
        throw new Error('No trim levels found for this vehicle')
      }

      console.log('Available styles:', styles)
      setVinStyles(styles)

      // Show success message
      toast.success('Vehicle found! Please select a trim level.')

    } catch (error) {
      console.error('VIN lookup error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to lookup VIN')
      throw error
    }
  }

  const safeOnNext = (data: Step1Data) => {
    try {
      console.log('Attempting to navigate with data:', data)
      onNext(data)
    } catch (error) {
      console.error('Error in onNext callback:', error)
      toast.error('Failed to proceed to next step')
    }
  }

  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (inputMethod === 'vin') {
        if (!vinLookupResult) {
          await handleVinLookup()
          setLoading(false)
          return
        }

        const selectedStyle = vinStyles.find(s => s.style === selectedVinStyle)
        if (!selectedStyle?.gid || !formData.mileage) {
          throw new Error('Please complete all required fields')
        }

        // Make API calls
        const [gidResponse, mileageResponse] = await Promise.all([
          fetch(`/api/vehicle/gid/${selectedStyle.gid}`),
          fetch(`/api/vehicle/gid/${selectedStyle.gid}/mileage/${formData.mileage}`)
        ])

        const [gidData, mileageData] = await Promise.all([
          gidResponse.json(),
          mileageResponse.json()
        ])

        // Create vehicle data
        const vehicleData: Step1Data = {
          year: vinLookupResult.year,
          make: vinLookupResult.make,
          model: vinLookupResult.model,
          trim: selectedVinStyle,
          mileage: formData.mileage,
          vehicleBasePrice: gidData.baseProjectedPrice || 0,
          vehicleMarketValue: gidData.baseProjectedMarketPrice || 0,
          vehiclePriceAdjustment: mileageData.adjustment || 0,
          vehicleDesirability: !mileageData.desirable,
          rawResponse: gidData,
          gid: selectedStyle.gid
        }

        console.log('Navigating with data:', vehicleData)
        onNext(vehicleData)

      } else {
        // Manual flow
        if (!selectedGid || !formData.mileage) {
          throw new Error('Please complete all required fields')
        }

        // Make API calls
        const [gidResponse, mileageResponse] = await Promise.all([
          fetch(`/api/vehicle/gid/${selectedGid}`),
          fetch(`/api/vehicle/gid/${selectedGid}/mileage/${formData.mileage}`)
        ])

        const [gidData, mileageData] = await Promise.all([
          gidResponse.json(),
          mileageResponse.json()
        ])

        // Create vehicle data
        const vehicleData: Step1Data = {
          year: selectedYear,
          make: selectedMake,
          model: selectedModel,
          trim: selectedTrim,
          mileage: formData.mileage,
          vehicleBasePrice: gidData.baseProjectedPrice || 0,
          vehicleMarketValue: gidData.baseProjectedMarketPrice || 0,
          vehiclePriceAdjustment: mileageData.adjustment || 0,
          vehicleDesirability: !mileageData.desirable,
          rawResponse: gidData,
          gid: selectedGid
        }

        console.log('Navigating with data:', vehicleData)
        onNext(vehicleData)
      }
    } catch (error) {
      console.error('Error submitting vehicle data:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit vehicle data')
    } finally {
      setLoading(false)
    }
  }

  // Add handler for style selection
  const handleVinStyleSelect = (value: string) => {
    setSelectedVinStyle(value)
    // Update form data when style is selected
    if (vinLookupResult) {
      setFormData(prev => ({
        ...prev,
        year: vinLookupResult.year,
        make: vinLookupResult.make,
        model: vinLookupResult.model,
        trim: value
      }))
    }
  }

  // Add mileage adjustment display component
  const MileageAdjustmentDisplay = (): JSX.Element | null => {
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
              {formatCurrency(formData.vehiclePriceAdjustment)}
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

  // Fix the isButtonDisabled function
  const isButtonDisabled = () => {
    if (loading) return true
    
    if (inputMethod === 'vin') {
      if (!vinLookupResult) {
        return vin.length !== 17 // Only enable if VIN is 17 characters
      }
      return !selectedVinStyle || !formData.mileage // Enable if style and mileage are selected
    }
    
    // For manual selection
    return !selectedYear || !selectedMake || !selectedModel || !selectedTrim || !formData.mileage
  }

  // Add helper function to check if trim is selected
  const isTrimSelected = () => {
    if (inputMethod === 'vin') {
      return !!selectedVinStyle
    }
    return !!selectedTrim
  }

  // Add debug logging to the VIN input handler
  const handleVinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase()
    console.log('VIN input changed:', newVin)
    setVin(newVin)
  }

  // Add near the top of the component
  useEffect(() => {
    console.log('Current VIN state:', vin)
    console.log('VIN lookup result:', vinLookupResult)
    console.log('Available styles:', vinStyles)
  }, [vin, vinLookupResult, vinStyles])

  // Add these handler functions inside the Step1VehicleInfo component, after the state declarations

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
      
      // Update form data when trim is selected
      setFormData(prev => ({
        ...prev,
        year: selectedYear,
        make: selectedMake,
        model: selectedModel,
        trim: selectedTrimData.trim,
        gid: selectedTrimData.gid
      }))
    }
  }

  return (
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={hideCounter ? undefined : currentStep}
        totalSteps={hideCounter ? undefined : totalSteps}
        onBack={onBack}
        onClose={onClose}
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
                  id="vin-input"
                  name="vin-input"
                  placeholder="Enter your VIN"
                  value={vin}
                  onChange={handleVinInput}
                  maxLength={17}
                  className="uppercase"
                  aria-label="Vehicle Identification Number"
                />
                <p className="text-sm text-muted-foreground">
                  Your VIN is a 17-character alphanumeric code.
                </p>
                {vinLookupResult && (
                  <>
                    <h2 className="text-xl font-semibold mt-4">
                      Select trim for your{" "}
                      <span className="text-[#4b69a0]">
                        {vinLookupResult.year} {vinLookupResult.make} {vinLookupResult.model}
                      </span>
                    </h2>
                    <Select 
                      value={selectedVinStyle}
                      onValueChange={handleVinStyleSelect}
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
                <Select
                  value={selectedYear}
                  onValueChange={handleYearSelect}
                >
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

            <Button 
              type="submit" 
              disabled={isButtonDisabled()} 
              className="w-full"
            >
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
  )
} 