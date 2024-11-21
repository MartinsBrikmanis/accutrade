"use client"

import { useState } from "react"
import { Step1VehicleInfo, Step1Data } from "@/components/trade-in/Step1VehicleInfo"
import { Step2VehicleSpecs, Step2Data } from "@/components/trade-in/Step2VehicleSpecs"
import { Step3Financing, Step3Data } from "@/components/trade-in/Step3Financing"
import { Step4Damage, Step4Data } from "@/components/trade-in/Step4Damage"
import { Step5Additional, Step5Data } from "@/components/trade-in/Step5Additional"
import { Step6Contact, Step6Data } from "@/components/trade-in/Step6Contact"
import { ReportPage } from "@/components/trade-in/ReportPage"

export default function TradePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicleData, setVehicleData] = useState<Step1Data | null>(null)
  const [vehicleSpecs, setVehicleSpecs] = useState<Step2Data | null>(null)
  const [financingData, setFinancingData] = useState<Step3Data | null>(null)
  const [damageData, setDamageData] = useState<Step4Data | null>(null)
  const [additionalData, setAdditionalData] = useState<Step5Data | null>(null)
  const [contactData, setContactData] = useState<Step6Data | null>(null)

  const handleNext = (data: any) => {
    if (currentStep === 1) {
      setVehicleData(data)
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setVehicleSpecs(data)
      setCurrentStep(3)
    } else if (currentStep === 3) {
      setFinancingData(data)
      setCurrentStep(4)
    } else if (currentStep === 4) {
      setDamageData(data)
      setCurrentStep(5)
    } else if (currentStep === 5) {
      setAdditionalData(data)
      setCurrentStep(6)
    } else if (currentStep === 6) {
      setContactData(data)
      setCurrentStep(7)
    }
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
            onNext={handleNext}
            vehicleInfo={vehicleData}
            currentStep={2}
            totalSteps={6}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Financing
            onNext={handleNext}
            currentStep={3}
            totalSteps={6}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4Damage
            onNext={handleNext}
            currentStep={4}
            totalSteps={6}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5Additional
            onNext={handleNext}
            currentStep={5}
            totalSteps={6}
            onBack={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 6 && (
          <Step6Contact
            onNext={handleNext}
            currentStep={6}
            totalSteps={6}
            onBack={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 7 && vehicleData && (
          <ReportPage
            vehicleData={{
              year: vehicleData.year,
              make: vehicleData.make,
              model: vehicleData.model,
              trim: vehicleData.trim,
              condition: "Good"
            }}
            estimatedValue={{
              min: vehicleData.vehicleBasePrice * 0.9,
              max: vehicleData.vehicleBasePrice * 1.1,
              blackBookValue: vehicleData.vehicleBasePrice,
              taxSavings: vehicleData.vehicleBasePrice * 0.13
            }}
            currentStep={7}
            totalSteps={7}
            onBack={() => setCurrentStep(6)}
          />
        )}
      </div>
    </main>
  )
} 