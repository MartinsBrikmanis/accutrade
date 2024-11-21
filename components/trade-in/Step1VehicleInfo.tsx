import { useState } from "react"
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

export function Step1VehicleInfo({ 
  onNext, 
  initialData, 
  onClose,
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

  // Add the missing isTrimSelected function
  const isTrimSelected = () => {
    return (inputMethod === 'vin' && selectedVinStyle) || 
           (inputMethod === 'manual' && selectedTrim);
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (inputMethod === 'vin') {
        if (!vinLookupResult) {
          // First submission - VIN lookup
          if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
            toast.error('Please enter a valid 17-character VIN')
            return
          }

          const data = await getVehicleByVin(vin)
          
          if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response format from API')
          }

          if (data.length === 0) {
            toast.error('No vehicle found for this VIN')
            return
          }

          // Set the VIN lookup result and available styles
          setVinLookupResult(data[0])
          const styles = data.map(item => ({
            style: item.style || item.trim,
            gid: item.gid
          }))
          setVinStyles(styles)
        } else {
          // Second submission - Get vehicle value using GID
          const selectedStyle = vinStyles.find(s => s.style === selectedVinStyle)
          if (!selectedStyle?.gid) {
            toast.error('Please select a trim level')
            return
          }

          if (!formData.mileage) {
            toast.error('Please enter vehicle mileage')
            return
          }

          try {
            // Make parallel API calls
            const [gidResponse, mileageResponse] = await Promise.all([
              fetch(`/api/vehicle/gid/${selectedStyle.gid}`),
              fetch(`/api/vehicle/gid/${selectedStyle.gid}/mileage/${formData.mileage}`)
            ])

            if (!gidResponse.ok || !mileageResponse.ok) {
              throw new Error('Failed to fetch vehicle data')
            }

            const [gidData, mileageData] = await Promise.all([
              gidResponse.json(),
              mileageResponse.json()
            ])

            // Add logging to debug the response
            console.log('GID Response Data:', gidData)

            // Update the field mappings to match the API response structure
            onNext({
              year: vinLookupResult.year,
              make: vinLookupResult.make,
              model: vinLookupResult.model,
              trim: selectedVinStyle,
              mileage: formData.mileage,
              vehicleBasePrice: gidData.trade || 0,
              vehicleMarketValue: gidData.retail || 0,
              vehiclePriceAdjustment: mileageData.adjustment || 0,
              vehicleDesirability: mileageData.desirable || false,
              rawResponse: gidData,
              gid: selectedStyle.gid
            })
          } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to fetch vehicle value')
          }
        }
      } else {
        // Manual selection - Get vehicle value using GID
        if (!selectedGid) {
          toast.error('Please select all vehicle details')
          return
        }

        if (!formData.mileage) {
          toast.error('Please enter vehicle mileage')
          return
        }

        try {
          // Make parallel API calls
          const [gidResponse, mileageResponse] = await Promise.all([
            fetch(`/api/vehicle/gid/${selectedGid}`),
            fetch(`/api/vehicle/gid/${selectedGid}/mileage/${formData.mileage}`)
          ])

          if (!gidResponse.ok || !mileageResponse.ok) {
            throw new Error('Failed to fetch vehicle data')
          }

          const [gidData, mileageData] = await Promise.all([
            gidResponse.json(),
            mileageResponse.json()
          ])

          // Add logging to debug the response
          console.log('GID Response Data:', gidData)

          // Update the field mappings to match the API response structure
          onNext({
            year: selectedYear,
            make: selectedMake,
            model: selectedModel,
            trim: selectedTrim,
            mileage: formData.mileage,
            vehicleBasePrice: gidData.trade || 0,
            vehicleMarketValue: gidData.retail || 0,
            vehiclePriceAdjustment: mileageData.adjustment || 0,
            vehicleDesirability: mileageData.desirable || false,
            rawResponse: gidData,
            gid: selectedGid
          })
        } catch (error) {
          console.error('Error:', error)
          toast.error('Failed to fetch vehicle value')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch vehicle data')
    } finally {
      setLoading(false)
    }
  }

  // Add handler for style selection
  const handleVinStyleSelect = async (style: string) => {
    setSelectedVinStyle(style)
    const selectedStyle = vinStyles.find(s => s.style === style)
    
    if (selectedStyle && vinLookupResult) {
      setFormData({
        year: vinLookupResult.year,
        make: vinLookupResult.make,
        model: vinLookupResult.model,
        trim: style,
        mileage: formData.mileage,
        vehicleBasePrice: vinLookupResult.basePrice || 0,
        vehicleMarketValue: vinLookupResult.marketValue || 0,
        vehiclePriceAdjustment: vinLookupResult.priceAdjustment || 0,
        vehicleDesirability: vinLookupResult.desirability || false,
        rawResponse: vinLookupResult,
        gid: selectedStyle.gid
      })
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

  // Add this function to determine if the button should be disabled
  const isButtonDisabled = () => {
    if (loading) return true;
    
    if (inputMethod === 'vin') {
      // For VIN input, only disable if:
      // 1. No VIN entered and it's in "Find A Vehicle" state
      // 2. Has VIN lookup result but no style selected and mileage for "Get Vehicle Value" state
      if (!vinLookupResult) {
        return vin.length === 0; // Enable if VIN is entered
      } else {
        return !selectedVinStyle || !formData.mileage; // Enable if style and mileage are selected
      }
    } else {
      // For manual selection, disable if any required field is missing
      return !selectedYear || !selectedMake || !selectedModel || !selectedTrim || !formData.mileage;
    }
  };

  return (
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
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