"use client"

import { Step1VehicleInfo } from "@/components/trade-in/Step1VehicleInfo"

export default function TradePage() {
  const handleNext = (data: any) => {
    console.log('Vehicle data:', data)
    // Handle the next step here
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-[540px] mx-auto">
        <Step1VehicleInfo 
          onNext={handleNext}
          currentStep={1}
          totalSteps={6}
          onClose={() => console.log('Close clicked')}
          onLanguageChange={(lang) => console.log('Language changed to:', lang)}
        />
      </div>
    </main>
  )
} 