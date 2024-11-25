import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { StepHeader } from "./StepHeader"
import { Step1Data } from "./Step1VehicleInfo"
import { Step2Data } from "./Step2VehicleSpecs"
import { Step3Data } from "./Step3Financing"
import { Step4Data } from "./Step4Damage"
import { Step5Data } from "./Step5Additional"
import { cn } from "@/lib/utils"

interface Step6Props {
  onNext: (data: Step6Data) => void
  initialData?: Step6Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  vehicleInfo?: Step1Data
  vehicleSpecs?: Step2Data
  financingData?: Step3Data
  damageData?: Step4Data
  additionalData?: Step5Data
}

export interface Step6Data {
  firstName: string
  lastName: string
  phone: string
  email: string
  acceptTerms: boolean
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

// Move text with apostrophes to constants and use proper HTML entities
const FORM_TITLE = "Let's Get Your Trade-In Value"
const FORM_DESCRIPTION = "It's important to ensure all fields are filled out correctly."

export function Step6Contact({ 
  onNext, 
  initialData, 
  currentStep, 
  totalSteps, 
  onBack,
  vehicleInfo,
  vehicleSpecs,
  financingData,
  damageData,
  additionalData
}: Step6Props) {
  const [formData, setFormData] = useState<Step6Data>(initialData || {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    acceptTerms: "",
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone)
  }

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      acceptTerms: "",
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms of service"
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
          {FORM_TITLE}
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          {FORM_DESCRIPTION}
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[16px]">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, firstName: e.target.value }))
                }
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[16px]">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, lastName: e.target.value }))
                }
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[16px]">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, phone: e.target.value }))
              }
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[16px]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Terms of Service */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms of service
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">{errors.acceptTerms}</p>
            )}
          </div>

          <div className="!mt-[30px]">
            <Button type="submit" className="w-full">
              Get My Trade-In Value
            </Button>
          </div>
        </form>
      </CardContent>

      {(vehicleInfo || vehicleSpecs || financingData || damageData || additionalData) && (
        <Card className="mt-6 border-t">
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

              {/* Damage Info */}
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

              {/* Additional Info */}
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