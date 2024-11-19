"use client"

import { Step1VehicleInfo, Step1Data } from "@/components/trade-in/Step1VehicleInfo"
import { Step2VehicleSpecs, Step2Data } from "@/components/trade-in/Step2VehicleSpecs"
import { Step3Financing, Step3Data } from "@/components/trade-in/Step3Financing"
import { Step4Damage, Step4Data } from "@/components/trade-in/Step4Damage"
import { Step5Additional, Step5Data } from "@/components/trade-in/Step5Additional"
import { Step6Contact, Step6Data } from "@/components/trade-in/Step6Contact"
import { ReportPage } from "@/components/trade-in/ReportPage"
import { useState } from "react"

export default function TradeInPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<{
    step1?: Step1Data
    step2?: Step2Data
    step3?: Step3Data
    step4?: Step4Data
    step5?: Step5Data
    step6?: Step6Data
  }>({})

  const handleStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, step1: data }))
    setCurrentStep(2)
  }

  const handleStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }))
    setCurrentStep(3)
  }

  const handleStep3Submit = (data: Step3Data) => {
    setFormData(prev => ({ ...prev, step3: data }))
    setCurrentStep(4)
  }

  const handleStep4Submit = (data: Step4Data) => {
    setFormData(prev => ({ ...prev, step4: data }))
    setCurrentStep(5)
  }

  const handleStep5Submit = (data: Step5Data) => {
    setFormData(prev => ({ ...prev, step5: data }))
    setCurrentStep(6)
  }

  const handleStep6Submit = async (data: Step6Data) => {
    setFormData(prev => ({ ...prev, step6: data }))
    // Here you would typically make an API call to get the estimate
    // For now, we'll simulate it
    setCurrentStep(7) // Show report
  }

  // Mock data for the report (replace with actual API response)
  const mockEstimateData = {
    vehicleData: {
      year: formData.step1?.year || "",
      make: formData.step1?.make || "",
      model: formData.step1?.model || "",
      trim: formData.step1?.trim || "",
      condition: formData.step1?.condition || "",
    },
    estimatedValue: {
      min: 57660,
      max: 65695,
      blackBookValue: 60000,
      taxSavings: 7800,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentStep === 1 && (
        <Step1VehicleInfo 
          onNext={handleStep1Submit} 
          initialData={formData.step1}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 2 && (
        <Step2VehicleSpecs 
          onNext={handleStep2Submit} 
          initialData={formData.step2}
          vehicleInfo={formData.step1}
          onBack={() => setCurrentStep(1)}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 3 && (
        <Step3Financing 
          onNext={handleStep3Submit} 
          initialData={formData.step3}
          onBack={() => setCurrentStep(2)}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 4 && (
        <Step4Damage 
          onNext={handleStep4Submit} 
          initialData={formData.step4}
          onBack={() => setCurrentStep(3)}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 5 && (
        <Step5Additional 
          onNext={handleStep5Submit} 
          initialData={formData.step5}
          onBack={() => setCurrentStep(4)}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 6 && (
        <Step6Contact 
          onNext={handleStep6Submit} 
          initialData={formData.step6}
          onBack={() => setCurrentStep(5)}
          currentStep={currentStep}
          totalSteps={6}
        />
      )}
      {currentStep === 7 && (
        <ReportPage
          vehicleData={mockEstimateData.vehicleData}
          estimatedValue={mockEstimateData.estimatedValue}
        />
      )}
    </div>
  )
} 