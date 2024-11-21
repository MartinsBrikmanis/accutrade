import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Pencil } from "lucide-react"
import { Step1Data } from "./Step1VehicleInfo"
import { StepHeader } from "./StepHeader"
import { cn } from "@/lib/utils"

interface Step2Props {
  onNext: (data: Step2Data) => void
  initialData?: Step2Data
  vehicleInfo?: Step1Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step2Data {
  exteriorColor: string
  interiorColor: string
  engineOptions: string[]
}

const EXTERIOR_COLORS = [
  { id: "agate-black", label: "Agate Black", color: "#000000" },
  { id: "oxford-white", label: "Oxford White", color: "#FFFFFF" },
  { id: "iconic-silver", label: "Iconic Silver", color: "#C0C0C0" },
  { id: "carbonized-gray", label: "Carbonized Gray", color: "#4A4A4A" },
  { id: "rapid-red", label: "Rapid Red", color: "#8B2F3F" },
  { id: "atlas-blue", label: "Atlas Blue", color: "#1B2B4B" },
  { id: "forged-green", label: "Forged Green", color: "#2C4C3B" },
  { id: "desert-gold", label: "Desert Gold", color: "#C1A87D" },
]

const INTERIOR_COLORS = [
  { id: "onyx", label: "Onyx Black", color: "#2B2B2B" },
  { id: "sandstone", label: "Sandstone", color: "#B5B1A3" },
  { id: "cognac", label: "Cognac", color: "#6D2B23" },
  { id: "space-gray", label: "Space Gray", color: "#4F4F4F" },
  { id: "ceramic", label: "Ceramic", color: "#E5E4E2" },
  { id: "navy-pier", label: "Navy Pier", color: "#2B3C5B" },
]

const ENGINE_OPTIONS = [
  { id: "3.5l-ecoboost", label: "3.5L EcoBoost V6" },
  { id: "3.0l-diesel", label: "3.0L V6 Turbo Diesel" },
]

export function Step2VehicleSpecs({ onNext, initialData, vehicleInfo, currentStep, totalSteps, onBack }: Step2Props) {
  const [formData, setFormData] = useState<Step2Data>(initialData || {
    exteriorColor: "agate-black",
    interiorColor: "sandstone",
    engineOptions: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
      />
      <CardHeader className="px-[30px] text-left">
        <CardTitle className="font-manrope text-[21px] font-extrabold text-black leading-normal">
          Your Vehicle
        </CardTitle>
        {vehicleInfo && (
          <div className="bg-muted p-4 rounded-lg mt-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-bold">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim}
                </p>
                <p className="text-sm text-muted-foreground">
                  {vehicleInfo.mileage} KM
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exterior Color */}
          <div className="space-y-2">
            <Label className="text-[16px]">Exterior Color</Label>
            <Select
              value={formData.exteriorColor}
              onValueChange={(value) => setFormData({ ...formData, exteriorColor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exterior color">
                  {formData.exteriorColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-[20px] h-[20px] rounded-full",
                          formData.exteriorColor === "oxford-white" && "border border-gray-200"
                        )}
                        style={{ 
                          backgroundColor: EXTERIOR_COLORS.find(c => c.id === formData.exteriorColor)?.color 
                        }} 
                      />
                      {EXTERIOR_COLORS.find(c => c.id === formData.exteriorColor)?.label}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EXTERIOR_COLORS.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-[20px] h-[20px] rounded-full",
                          color.id === "oxford-white" && "border border-gray-200"
                        )}
                        style={{ backgroundColor: color.color }} 
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interior Color */}
          <div className="space-y-2">
            <Label className="text-[16px]">Interior Color</Label>
            <Select
              value={formData.interiorColor}
              onValueChange={(value) => setFormData({ ...formData, interiorColor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interior color">
                  {formData.interiorColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-[20px] h-[20px] rounded-full"
                        style={{ 
                          backgroundColor: INTERIOR_COLORS.find(c => c.id === formData.interiorColor)?.color 
                        }} 
                      />
                      {INTERIOR_COLORS.find(c => c.id === formData.interiorColor)?.label}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {INTERIOR_COLORS.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-[20px] h-[20px] rounded-full"
                        style={{ backgroundColor: color.color }} 
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="!mt-[30px]">
            <Button type="submit" className="w-full">
              Next
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Add new card at the bottom to display Step 1 data */}
      {vehicleInfo && (
        <Card className="mt-6 border-t">
          <CardHeader className="px-[30px]">
            <CardTitle className="text-[16px] font-semibold">Vehicle Information Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-[30px] py-4">
            <div className="space-y-4">
              {/* Basic Vehicle Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Basic Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Year:</span>
                    <span className="ml-2 font-medium">{vehicleInfo.year}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Make:</span>
                    <span className="ml-2 font-medium">{vehicleInfo.make}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="ml-2 font-medium">{vehicleInfo.model}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trim:</span>
                    <span className="ml-2 font-medium">{vehicleInfo.trim}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mileage:</span>
                    <span className="ml-2 font-medium">{vehicleInfo.mileage} KM</span>
                  </div>
                </div>
              </div>

              {/* Valuation Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Valuation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-medium">
                      {formatCurrency(vehicleInfo.vehicleBasePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Value:</span>
                    <span className="font-medium">
                      {formatCurrency(vehicleInfo.vehicleMarketValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage Adjustment:</span>
                    <span className={cn(
                      "font-medium",
                      vehicleInfo.vehiclePriceAdjustment > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(vehicleInfo.vehiclePriceAdjustment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mileage Status:</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      vehicleInfo.vehicleDesirability 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    )}>
                      {vehicleInfo.vehicleDesirability ? "Below Average" : "Above Average"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Card>
  )
} 