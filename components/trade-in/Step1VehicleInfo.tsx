import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { vehicleOptions } from "@/app/assets/constants/vehicle-options"

interface Step1Props {
  onNext: (data: Step1Data) => void
  initialData?: Step1Data
  onClose?: () => void
  onLanguageChange?: (lang: 'en' | 'fr') => void
  currentLanguage?: 'en' | 'fr'
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
  condition: string
}

export function Step1VehicleInfo({ 
  onNext, 
  initialData, 
  onClose,
  onLanguageChange,
  currentLanguage,
  currentStep,
  totalSteps,
  onBack
}: Step1Props) {
  const [formData, setFormData] = useState<Step1Data>(initialData || {
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    condition: "",
  })

  const [vehicleSearch, setVehicleSearch] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleVehicleSelection = (value: string) => {
    setVehicleSearch(value)
    // Parse the selected value to update the form data
    const [year, make, model, ...trimParts] = value.split(" ")
    setFormData({
      ...formData,
      year,
      make,
      model,
      trim: trimParts.join(" ")
    })
  }

  return (
    <Card 
      className="w-full mx-auto"
      onClose={onClose}
      onLanguageChange={onLanguageChange}
      currentLanguage={currentLanguage}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={onBack}
    >
      <CardHeader className="px-[30px] text-left">
        <CardTitle className="font-manrope text-[21px] font-extrabold text-black leading-normal">
          Get Your Trade-In Value
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          Values based on Canadian Black Book data
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-[24px]">
            {/* Vehicle Search */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-search" className="text-[16px]">
                Current Vehicle (Year, Make, Model and Trim)
              </Label>
              <Select
                value={vehicleSearch}
                onValueChange={handleVehicleSelection}
              >
                <SelectTrigger id="vehicle-search">
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleOptions.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mileage Input */}
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-[16px]">Vehicle Mileage (KM)</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter vehicle mileage"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              />
            </div>

            {/* Condition Selection */}
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-[16px]">Vehicle Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-[30px]">
            <Button type="submit" className="w-full">
              Next
            </Button>
            <Image 
              src="/asset/button-sub-text-1.svg"
              alt="It takes less than 1 minute"
              width={200}
              height={20}
              className="mx-auto mt-4"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 