import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"

interface Step4Props {
  onNext: (data: Step4Data) => void
  initialData?: Step4Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step4Data {
  hasAccident: boolean
  accidentDetails: string
  needsRepairs: boolean
  repairDetails: string
}

export function Step4Damage({ onNext, initialData, currentStep, totalSteps, onBack }: Step4Props) {
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

  return (
    <Card 
      className="w-full mx-auto"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={onBack}
    >
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
    </Card>
  )
} 