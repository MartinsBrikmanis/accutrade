"use client"

import { useState } from "react"
import { Step1VehicleInfo, Step1Data } from "@/components/trade-in/Step1VehicleInfo"
import { Step2VehicleSpecs } from "@/components/trade-in/Step2VehicleSpecs"

export default function TradePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicleData, setVehicleData] = useState<Step1Data | null>(null)

  const handleNext = (data: Step1Data) => {
    setVehicleData(data)
    setCurrentStep(2)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-[540px] mx-auto">
        {currentStep === 1 && (
          <Step1VehicleInfo 
            onNext={handleNext}
            currentStep={1}
            totalSteps={6}
            onClose={() => console.log('Close clicked')}
            onLanguageChange={(lang) => console.log('Language changed to:', lang)}
          />
        )}
        {currentStep === 2 && vehicleData && (
          <Step2VehicleSpecs
            onNext={(data) => console.log('Step 2 data:', data)}
            vehicleInfo={vehicleData}
            currentStep={2}
            totalSteps={6}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </div>
    </main>
  )
} 