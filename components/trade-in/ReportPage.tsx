import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Info, CreditCard, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { StepHeader } from "./StepHeader"

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
}

export function ReportPage({ 
  vehicleData, 
  estimatedValue,
  currentStep,
  totalSteps,
  onBack 
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
    <div className="mx-auto" style={{ width: '540px' }}>
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
                    Black Book® trade-in value
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
                Know What You Can Afford Before You Buy
              </h3>
              <p className="text-[16px] text-muted-foreground mb-6">
                Obtain your Free Equifax Credit snapshot to determine your eligibility to financing the vehicle you've been eyeing
              </p>
              
              <Button className="w-full h-auto py-4 bg-[#8146F6] hover:bg-[#8146F6]/90 text-[16px]">
                Get My Free Equifax Credit Score
              </Button>

              <Image 
                src="/asset/button-sub-text-2.svg"
                alt="This will NOT impact your Credit"
                width={200}
                height={20}
                className="mx-auto mt-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 