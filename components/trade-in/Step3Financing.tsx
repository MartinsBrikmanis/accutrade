import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { StepHeader } from "./StepHeader"

interface Step3Props {
  onNext: (data: Step3Data) => void
  initialData?: Step3Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step3Data {
  financingStatus: "financed" | "leased" | "owned"
}

const FINANCING_OPTIONS = [
  { id: "financed", label: "Financed" },
  { id: "leased", label: "Leased" },
  { id: "owned", label: "Own Outright" },
] as const

export function Step3Financing({ onNext, initialData, currentStep, totalSteps, onBack }: Step3Props) {
  const [financingStatus, setFinancingStatus] = useState<Step3Data["financingStatus"]>(
    initialData?.financingStatus || "owned"
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ financingStatus })
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
    </Card>
  )
} 