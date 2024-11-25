"use client"

import React from "react"
import { useState } from "react"
import { Step1VehicleInfo, Step1Data } from "@/components/trade-in/Step1VehicleInfo"
import { Step2VehicleSpecs, Step2Data } from "@/components/trade-in/Step2VehicleSpecs"
import { Step3Financing, Step3Data } from "@/components/trade-in/Step3Financing"
import { Step4Damage, Step4Data } from "@/components/trade-in/Step4Damage"
import { Step5Additional, Step5Data } from "@/components/trade-in/Step5Additional"
import { Step6Contact, Step6Data } from "@/components/trade-in/Step6Contact"
import { ReportPage } from "@/components/trade-in/ReportPage"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicleInfo, setVehicleInfo] = useState<Step1Data | null>(null)
  const [vehicleSpecs, setVehicleSpecs] = useState<Step2Data | null>(null)
  const [financingData, setFinancingData] = useState<Step3Data | null>(null)
  const [damageData, setDamageData] = useState<Step4Data | null>(null)
  const [additionalData, setAdditionalData] = useState<Step5Data | null>(null)
  const [contactData, setContactData] = useState<Step6Data | null>(null)

  const totalSteps = 6

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStep1Complete = (data: Step1Data) => {
    console.log('Step 1 data received:', data)
    setVehicleInfo(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: Step2Data) => {
    console.log('Step 2 data received:', data)
    setVehicleSpecs(data)
    setCurrentStep(3)
  }

  const handleStep3Complete = (data: Step3Data) => {
    console.log('Step 3 data received:', data)
    setFinancingData(data)
    setCurrentStep(4)
  }

  const handleStep4Complete = (data: Step4Data) => {
    console.log('Step 4 data received:', data)
    setDamageData(data)
    setCurrentStep(5)
  }

  const handleStep5Complete = (data: Step5Data) => {
    console.log('Step 5 data received:', data)
    setAdditionalData(data)
    setCurrentStep(6)
  }

  const handleStep6Complete = (data: Step6Data) => {
    console.log('Step 6 data received:', data)
    setContactData(data)
    setCurrentStep(7)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-[540px] mx-auto">
        {currentStep === 1 && (
          <Step1VehicleInfo
            onNext={handleStep1Complete}
            initialData={vehicleInfo || undefined}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && vehicleInfo && (
          <Step2VehicleSpecs
            onNext={handleStep2Complete}
            initialData={vehicleSpecs || undefined}
            vehicleInfo={vehicleInfo}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3Financing
            onNext={handleStep3Complete}
            currentStep={3}
            totalSteps={totalSteps}
            onBack={() => setCurrentStep(2)}
            vehicleInfo={vehicleInfo || undefined}
            vehicleSpecs={vehicleSpecs || undefined}
          />
        )}
        {currentStep === 4 && (
          <Step4Damage
            onNext={handleStep4Complete}
            currentStep={4}
            totalSteps={totalSteps}
            onBack={() => setCurrentStep(3)}
            vehicleInfo={vehicleInfo || undefined}
            vehicleSpecs={vehicleSpecs || undefined}
            financingData={financingData || undefined}
          />
        )}
        {currentStep === 5 && (
          <Step5Additional
            onNext={handleStep5Complete}
            currentStep={5}
            totalSteps={totalSteps}
            onBack={() => setCurrentStep(4)}
            vehicleInfo={vehicleInfo || undefined}
            vehicleSpecs={vehicleSpecs || undefined}
            financingData={financingData || undefined}
            damageData={damageData || undefined}
          />
        )}
        {currentStep === 6 && (
          <Step6Contact
            onNext={handleStep6Complete}
            currentStep={6}
            totalSteps={totalSteps}
            onBack={() => setCurrentStep(5)}
            vehicleInfo={vehicleInfo || undefined}
            vehicleSpecs={vehicleSpecs || undefined}
            financingData={financingData || undefined}
            damageData={damageData || undefined}
            additionalData={additionalData || undefined}
          />
        )}
        {currentStep === 7 && vehicleInfo && (
          <ReportPage
            vehicleData={{
              year: vehicleInfo.year,
              make: vehicleInfo.make,
              model: vehicleInfo.model,
              trim: vehicleInfo.trim,
              condition: "Good"
            }}
            estimatedValue={{
              min: (vehicleInfo.vehicleBasePrice + vehicleInfo.vehiclePriceAdjustment) * 0.9,
              max: vehicleInfo.vehicleBasePrice + vehicleInfo.vehiclePriceAdjustment,
              blackBookValue: vehicleInfo.vehicleBasePrice,
              taxSavings: vehicleInfo.vehicleBasePrice * 0.13
            }}
            currentStep={7}
            totalSteps={7}
            onBack={() => setCurrentStep(6)}
            vehicleInfo={vehicleInfo || undefined}
            vehicleSpecs={vehicleSpecs || undefined}
            financingData={financingData || undefined}
            damageData={damageData || undefined}
            additionalData={additionalData || undefined}
            contactData={contactData || undefined}
          />
        )}
      </div>
    </main>
  )
} 