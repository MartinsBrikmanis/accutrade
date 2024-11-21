import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { StepHeader } from "./StepHeader"
import { Step1Data } from "./Step1VehicleInfo"
import { Step2Data } from "./Step2VehicleSpecs"
import { Step3Data } from "./Step3Financing"
import { cn } from "@/lib/utils"

interface Step4Props {
  onNext: (data: Step4Data) => void
  initialData?: Step4Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  vehicleInfo?: Step1Data
  vehicleSpecs?: Step2Data
  financingData?: Step3Data
}

export interface Step4Data {
  hasAccident: boolean
  accidentDetails: string
  needsRepairs: boolean
  repairDetails: string
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

export function Step4Damage({ 
  onNext, 
  initialData, 
  currentStep, 
  totalSteps, 
  onBack,
  vehicleInfo,
  vehicleSpecs,
  financingData 
}: Step4Props) {
  const [formData, setFormData] = useState<Step4Data>(initialData || {
    hasAccident: false,
    accidentDetails: "",
    needsRepairs: false,
    repairDetails: "",
  })

  const [errors, setErrors] = useState({
    accidentDetails: "",
    repairDetails: "",
  })

  const validate = () => {
    const newErrors = {
      accidentDetails: "",
      repairDetails: "",
    }

    if (formData.hasAccident && !formData.accidentDetails.trim()) {
      newErrors.accidentDetails = "Please provide accident details"
    }

    if (formData.needsRepairs && !formData.repairDetails.trim()) {
      newErrors.repairDetails = "Please provide repair details"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
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
          Vehicle History
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          Tell us about any accidents or damage
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Accident History */}
          <div className="space-y-4">
            <Label className="text-[16px]">
              Has your vehicle ever been in an accident?
            </Label>
            <RadioGroup
              value={formData.hasAccident ? "yes" : "no"}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  hasAccident: value === "yes",
                  accidentDetails: value === "no" ? "" : prev.accidentDetails
                }))
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="accident-yes" />
                <Label htmlFor="accident-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="accident-no" />
                <Label htmlFor="accident-no">No</Label>
              </div>
            </RadioGroup>

            {formData.hasAccident && (
              <div className="space-y-2">
                <Label htmlFor="accident-details" className="text-[16px]">
                  Please describe the damage
                </Label>
                <Textarea
                  id="accident-details"
                  placeholder="Enter accident details..."
                  value={formData.accidentDetails}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, accidentDetails: e.target.value }))
                  }
                  className={errors.accidentDetails ? "border-destructive" : ""}
                />
                {errors.accidentDetails && (
                  <p className="text-sm text-destructive">{errors.accidentDetails}</p>
                )}
              </div>
            )}
          </div>

          {/* Outstanding Repairs */}
          <div className="space-y-4">
            <Label className="text-[16px]">
              Is there currently any outstanding repairs that need to be fixed?
            </Label>
            <RadioGroup
              value={formData.needsRepairs ? "yes" : "no"}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  needsRepairs: value === "yes",
                  repairDetails: value === "no" ? "" : prev.repairDetails
                }))
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="repairs-yes" />
                <Label htmlFor="repairs-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="repairs-no" />
                <Label htmlFor="repairs-no">No</Label>
              </div>
            </RadioGroup>

            {formData.needsRepairs && (
              <div className="space-y-2">
                <Label htmlFor="repair-details" className="text-[16px]">
                  Please describe the repairs needed
                </Label>
                <Textarea
                  id="repair-details"
                  placeholder="Enter repair details..."
                  value={formData.repairDetails}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, repairDetails: e.target.value }))
                  }
                  className={errors.repairDetails ? "border-destructive" : ""}
                />
                {errors.repairDetails && (
                  <p className="text-sm text-destructive">{errors.repairDetails}</p>
                )}
              </div>
            )}
          </div>

          <div className="!mt-[30px]">
            <Button type="submit" className="w-full">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
      
      {(vehicleInfo || vehicleSpecs || financingData) && (
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
              )}

              {/* Financing Info */}
              {financingData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Financing Status</h3>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current Status:</span>
                    <span className="ml-2 font-medium capitalize">{financingData.financingStatus}</span>
                  </div>
                </div>
              )}

              {/* Valuation Info */}
              {vehicleInfo && (
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
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Card>
  )
} 