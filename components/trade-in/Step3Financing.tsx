import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { StepHeader } from "./StepHeader"
import { cn } from "@/lib/utils"
import { Step2Data } from "./Step2VehicleSpecs"
import { Step1Data } from "./Step1VehicleInfo"

interface Step3Props {
  onNext: (data: Step3Data) => void
  initialData?: Step3Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  vehicleInfo?: Step1Data
  vehicleSpecs?: Step2Data
}

export interface Step3Data {
  financingStatus: "financed" | "leased" | "owned"
}

const FINANCING_OPTIONS = [
  { id: "financed", label: "Financed" },
  { id: "leased", label: "Leased" },
  { id: "owned", label: "Own Outright" },
] as const

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

export function Step3Financing({ 
  onNext, 
  initialData, 
  currentStep, 
  totalSteps, 
  onBack,
  vehicleInfo,
  vehicleSpecs 
}: Step3Props) {
  const [financingStatus, setFinancingStatus] = useState<Step3Data["financingStatus"]>(
    initialData?.financingStatus || "owned"
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ financingStatus })
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
          Financing Status
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          Tell us about your current financing situation
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-[16px] text-[#372539]">
              Is your vehicle currently Financed or Leased?
            </Label>
            <RadioGroup
              value={financingStatus}
              onValueChange={(value: Step3Data["financingStatus"]) => 
                setFinancingStatus(value)
              }
              className="space-y-[12px]"
            >
              {FINANCING_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-[8px]">
                  <div className="relative flex items-center justify-center">
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      className="h-[24px] w-[24px] border-[#D7D7D7] bg-white data-[state=checked]:border-[#031420] data-[state=checked]:border-[1px]"
                    />
                  </div>
                  <Label 
                    htmlFor={option.id} 
                    className="text-[16px] text-[#372539] cursor-pointer leading-[17px]"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="!mt-[30px]">
            <Button type="submit" className="w-full">
              Next
            </Button>
          </div>
        </form>
      </CardContent>

      {(vehicleInfo || vehicleSpecs) && (
        <Card className="mt-6 border-t">
          <CardHeader className="px-[30px]">
            <CardTitle className="text-[16px] font-semibold">Vehicle Information Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-[30px] py-4">
            <div className="space-y-4">
              {/* Vehicle Specs Summary */}
              {vehicleSpecs && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Vehicle Specifications</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Exterior Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className={cn(
                            "w-[20px] h-[20px] rounded-full",
                            vehicleSpecs.exteriorColor === "oxford-white" && "border border-gray-200"
                          )}
                          style={{ 
                            backgroundColor: EXTERIOR_COLORS.find(
                              c => c.id === vehicleSpecs.exteriorColor
                            )?.color 
                          }} 
                        />
                        <span className="font-medium">
                          {EXTERIOR_COLORS.find(c => c.id === vehicleSpecs.exteriorColor)?.label}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interior Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-[20px] h-[20px] rounded-full"
                          style={{ 
                            backgroundColor: INTERIOR_COLORS.find(
                              c => c.id === vehicleSpecs.interiorColor
                            )?.color 
                          }} 
                        />
                        <span className="font-medium">
                          {INTERIOR_COLORS.find(c => c.id === vehicleSpecs.interiorColor)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Vehicle Info */}
              {vehicleInfo && (
                <>
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
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Card>
  )
} 