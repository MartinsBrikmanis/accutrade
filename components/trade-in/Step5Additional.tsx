import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { StepHeader } from "./StepHeader"

interface Step5Props {
  onNext: (data: Step5Data) => void
  initialData?: Step5Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step5Data {
  hasWinterTires: boolean
  hasOriginalKeys: boolean
  hasModifications: boolean
  modificationDetails: string
}

export function Step5Additional({ onNext, initialData, currentStep, totalSteps, onBack }: Step5Props) {
  const [formData, setFormData] = useState<Step5Data>(initialData || {
    hasWinterTires: false,
    hasOriginalKeys: false,
    hasModifications: false,
    modificationDetails: "",
  })

  const [errors, setErrors] = useState({
    modificationDetails: "",
  })

  const validate = () => {
    const newErrors = {
      modificationDetails: "",
    }

    if (formData.hasModifications && !formData.modificationDetails.trim()) {
      newErrors.modificationDetails = "Please provide modification details"
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
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
      />
      <CardHeader className="px-[30px] text-left">
        <CardTitle className="font-manrope text-[21px] font-extrabold text-black leading-normal">
          Additional Details
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          Tell us more about your vehicle's features
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Winter Tires */}
          <div className="space-y-4">
            <Label className="text-[16px]">
              Does it come with a set of Winter Tires?
            </Label>
            <RadioGroup
              value={formData.hasWinterTires ? "yes" : "no"}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, hasWinterTires: value === "yes" }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="winter-yes" />
                <Label htmlFor="winter-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="winter-no" />
                <Label htmlFor="winter-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Original Keys */}
          <div className="space-y-4">
            <Label className="text-[16px]">
              Does your vehicle come with the two original sets of keys/remotes?
            </Label>
            <RadioGroup
              value={formData.hasOriginalKeys ? "yes" : "no"}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, hasOriginalKeys: value === "yes" }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="keys-yes" />
                <Label htmlFor="keys-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="keys-no" />
                <Label htmlFor="keys-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Modifications */}
          <div className="space-y-4">
            <Label className="text-[16px]">
              Does your vehicle have any major modifications (engine, suspension, exterior, exhaust etc.)?
            </Label>
            <RadioGroup
              value={formData.hasModifications ? "yes" : "no"}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  hasModifications: value === "yes",
                  modificationDetails: value === "no" ? "" : prev.modificationDetails
                }))
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="mods-yes" />
                <Label htmlFor="mods-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="mods-no" />
                <Label htmlFor="mods-no">No</Label>
              </div>
            </RadioGroup>

            {formData.hasModifications && (
              <div className="space-y-2">
                <Label htmlFor="modification-details">
                  Please describe the modifications
                </Label>
                <Textarea
                  id="modification-details"
                  placeholder="Enter modification details..."
                  value={formData.modificationDetails}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, modificationDetails: e.target.value }))
                  }
                  className={errors.modificationDetails ? "border-destructive" : ""}
                />
                {errors.modificationDetails && (
                  <p className="text-sm text-destructive">{errors.modificationDetails}</p>
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