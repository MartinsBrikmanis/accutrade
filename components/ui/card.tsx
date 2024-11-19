import * as React from "react"
import { cn } from "@/lib/utils"
import { StepHeader } from "@/components/trade-in/StepHeader"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean
  onClose?: () => void
  onLanguageChange?: (lang: 'en' | 'fr') => void
  currentLanguage?: 'en' | 'fr'
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
  hideCounter?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, showHeader = true, onClose, onLanguageChange, currentLanguage, currentStep, totalSteps, onBack, hideCounter, ...props }, ref) => (
    <div className="mx-auto" style={{ width: '540px' }}>
      <div
        ref={ref}
        className={cn(
          "bg-[#F2F2F7] shadow-sm w-full",
          className
        )}
        {...props}
      >
        {showHeader && (
          <StepHeader
            onClose={onClose}
            onLanguageChange={onLanguageChange}
            currentLanguage={currentLanguage}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={onBack}
            hideCounter={hideCounter}
          />
        )}
        {props.children}
      </div>
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-manrope text-[21px] font-extrabold text-black leading-normal",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
