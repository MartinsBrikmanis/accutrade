import Image from "next/image"
import { X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepHeaderProps {
  onClose?: () => void
  onLanguageChange?: (lang: 'en' | 'fr') => void
  currentLanguage?: 'en' | 'fr'
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  hideCounter?: boolean
}

export function StepHeader({ 
  onClose, 
  onLanguageChange, 
  currentLanguage = 'en',
  currentStep = 1,
  totalSteps = 6,
  onBack,
  hideCounter = false
}: StepHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-[30px] py-4">
        <Image
          src="/asset/accutrade-logo.png"
          alt="Accutrade"
          width={143}
          height={24}
          className="h-6 w-auto"
        />

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => onLanguageChange?.('en')}
              className={`py-[3px] px-[8px] rounded-full text-[12px] ${
                currentLanguage === 'en'
                  ? 'bg-[#4b69a0] text-white'
                  : 'bg-white text-black'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange?.('fr')}
              className={`py-[3px] px-[8px] rounded-full text-[12px] ${
                currentLanguage === 'fr'
                  ? 'bg-[#4b69a0] text-white'
                  : 'bg-white text-black'
              }`}
            >
              Français
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-transparent"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-black opacity-75" />
          </Button>
        </div>
      </div>
      
      {!hideCounter && (
        <div className="px-[30px] pb-4 flex items-center gap-2">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 hover:bg-transparent"
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5 text-black opacity-75" />
            </Button>
          )}
          <span className="text-black text-[14px] font-bold leading-[20px]">
            {currentStep} of {totalSteps}
          </span>
        </div>
      )}
    </div>
  )
} 