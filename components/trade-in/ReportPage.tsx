import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { StepHeader } from "./StepHeader"
import { Step1Data } from "./Step1VehicleInfo"
import { Step2Data } from "./Step2VehicleSpecs"
import { Step3Data } from "./Step3Financing"
import { Step4Data } from "./Step4Damage"
import { Step5Data } from "./Step5Additional"
import { Step6Data } from "./Step6Contact"
import { cn } from "@/lib/utils"

interface ReportPageProps {
  vehicleData: {
    year: string
    make: string
    model: string
    trim: string
    condition: string
  }
  estimatedValue: {
    min: number
    max: number
    blackBookValue: number
    taxSavings: number
  }
  currentStep: number
  totalSteps: number
  onBack: () => void
  vehicleInfo?: Step1Data
  vehicleSpecs?: Step2Data
  financingData?: Step3Data
  damageData?: Step4Data
  additionalData?: Step5Data
  contactData?: Step6Data
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

const BUTTON_TEXT = "Get My Free Equifax Credit Score"
const BUTTON_SUBTEXT = "This will NOT impact your Credit"
const CREDIT_SCORE_TITLE = "Let's Check Your Credit Score"
const CREDIT_SCORE_DESCRIPTION = "It's quick, easy, and won't affect your credit score"
const CREDIT_SNAPSHOT_TEXT = "Obtain your Free Equifax Credit snapshot to determine your eligibility to financing the vehicle you've been eyeing"

const MILEAGE_STATUS = {
  BELOW_AVERAGE: "Below Average",
  ABOVE_AVERAGE: "Above Average"
}

export function ReportPage({ 
  vehicleData, 
  estimatedValue,
  currentStep,
  totalSteps,
  onBack,
  vehicleInfo,
  vehicleSpecs,
  financingData,
  damageData,
  additionalData,
  contactData
}: ReportPageProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalBenefit = estimatedValue.blackBookValue + estimatedValue.taxSavings

  return (
    <div className="w-full mx-auto">
      <Card className="w-full">
        <StepHeader 
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={onBack}
          hideCounter={true}
        />
        <CardHeader className="px-[30px] text-left">
          <CardTitle className="font-manrope text-[26px] font-extrabold text-black leading-normal text-left">
            Congratulations, Your Estimate Is Ready!
          </CardTitle>
          
          <Label className="text-[16px] block !mt-[24px] mb-2">Your Vehicle</Label>
          <div className="bg-muted p-4 rounded-lg bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[20px] font-bold">
                  {vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.trim}
                </p>
              </div>
            </div>
          </div>

          <Label className="text-[16px] block !mt-[24px] mb-2">Estimated Vehicle Value</Label>
          <div className="bg-muted p-4 rounded-lg bg-white">
            <div className="space-y-2">
              <p className="text-[20px] font-bold">
                {formatCurrency(estimatedValue.min)} - {formatCurrency(estimatedValue.max)}
              </p>
              <p className="text-[16px] text-muted-foreground">
                Condition: {vehicleData.condition}
              </p>
              <p className="text-[16px] text-muted-foreground">
                Value provided on: {new Date().toLocaleDateString('en-US', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-[30px] py-6">
          {/* Value Breakdown */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col divide-y">
              {/* Total Trade-in Benefit */}
              <div className="pb-4">
                <div className="flex items-center gap-4">
                  <p className="text-[20px] font-bold">
                    {formatCurrency(totalBenefit)}
                  </p>
                  <p className="text-[16px] text-muted-foreground">
                    Total trade-in benefit (incl tax savings)
                  </p>
                </div>
              </div>

              {/* Black Book Value */}
              <div className="py-4">
                <div className="flex items-center gap-4">
                  <p className="text-[16px] font-bold">
                    {formatCurrency(estimatedValue.blackBookValue)}
                  </p>
                  <p className="text-[16px] text-muted-foreground">
                    Accu-Trade® trade-in value
                  </p>
                </div>
              </div>

              {/* Tax Savings */}
              <div className="pt-4">
                <div className="flex items-center gap-4">
                  <p className="text-[16px] font-bold text-green-600">
                    + {formatCurrency(estimatedValue.taxSavings)}
                  </p>
                  <p className="text-[16px] text-muted-foreground">
                    Average tax savings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6">
            <Label className="text-[16px] block !mt-[24px] mb-2">Next Step</Label>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-[26px] font-bold mb-2 text-center">
                {CREDIT_SCORE_TITLE}
              </h3>
              <p className="text-[16px] text-muted-foreground mb-2">
                {CREDIT_SCORE_DESCRIPTION}
              </p>
              <p className="text-[16px] text-muted-foreground mb-6">
                {CREDIT_SNAPSHOT_TEXT}
              </p>
              
              <Button className="w-full h-auto py-4 bg-[#4b69a0] hover:bg-[#4b69a0]/90 text-[16px]">
                {BUTTON_TEXT}
              </Button>

              <div className="relative w-[200px] h-[20px] mx-auto mt-4">
                <Image 
                  src="/asset/button-sub-text-2.svg"
                  alt={BUTTON_SUBTEXT}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(vehicleInfo || vehicleSpecs || financingData || damageData || additionalData || contactData) && (
        <Card className="mt-6">
          <CardHeader className="px-[30px]">
            <CardTitle className="text-[16px] font-semibold">Vehicle Information Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-[30px] py-4">
            <div className="space-y-4">
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

              {/* Contact Information */}
              {contactData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">
                        {contactData.firstName} {contactData.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="ml-2 font-medium">{contactData.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2 font-medium">{contactData.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Financing Status */}
              {financingData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Financing Status</h3>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current Status:</span>
                    <span className="ml-2 font-medium capitalize">{financingData.financingStatus}</span>
                  </div>
                </div>
              )}

              {/* Damage & Repairs */}
              {damageData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Damage & Repairs</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accident History:</span>
                      <span className="ml-2 font-medium">{damageData.hasAccident ? "Yes" : "No"}</span>
                      {damageData.hasAccident && damageData.accidentDetails && (
                        <p className="mt-1 text-muted-foreground">{damageData.accidentDetails}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Needs Repairs:</span>
                      <span className="ml-2 font-medium">{damageData.needsRepairs ? "Yes" : "No"}</span>
                      {damageData.needsRepairs && damageData.repairDetails && (
                        <p className="mt-1 text-muted-foreground">{damageData.repairDetails}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {additionalData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Additional Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Winter Tires:</span>
                      <span className="ml-2 font-medium">{additionalData.hasWinterTires ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Original Keys:</span>
                      <span className="ml-2 font-medium">{additionalData.hasOriginalKeys ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Modifications:</span>
                      <span className="ml-2 font-medium">{additionalData.hasModifications ? "Yes" : "No"}</span>
                      {additionalData.hasModifications && additionalData.modificationDetails && (
                        <p className="mt-1 text-muted-foreground">{additionalData.modificationDetails}</p>
                      )}
                    </div>
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
                        {vehicleInfo.vehicleDesirability ? MILEAGE_STATUS.BELOW_AVERAGE : MILEAGE_STATUS.ABOVE_AVERAGE}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 