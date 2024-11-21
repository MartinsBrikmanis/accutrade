import Image from "next/image"
import { X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepHeaderProps {
  onClose?: () => void
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  hideCounter?: boolean
}

export function StepHeader({ 
  onClose, 
  currentStep = 1,
  totalSteps = 6,
  onBack,
  hideCounter = false
}: StepHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-[30px] py-4">
        <div className="relative h-[30px]">
          <Image
            src="/asset/accutrade-logo.png"
            alt="AccuTrade Logo"
            width={150}
            height={30}
            priority
            style={{
              height: '30px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
        <div className="flex items-center gap-4">
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