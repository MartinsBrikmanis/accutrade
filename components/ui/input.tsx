import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
  error?: string
  label?: string
  description?: string
  onClear?: () => void
  showClearButton?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    wrapperClassName, 
    error, 
    label, 
    description, 
    onClear,
    showClearButton,
    ...props 
  }, ref) => {
    return (
      <div 
        className={cn(
          "min-w-[465px] min-h-[45px] bg-white rounded-[6px]",
          wrapperClassName
        )}
      >
        <div className="px-4 py-0 flex items-center gap-2 h-11">
          <div className="flex-grow flex items-center gap-2.5">
            <input
              type={type}
              className={cn(
                "flex w-full bg-transparent text-[#343B4B] text-base leading-[22px]",
                "placeholder:text-[#8E8E93]",
                "focus:outline-none focus:ring-0",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500",
                className
              )}
              ref={ref}
              {...props}
            />
            {label && (
              <span className="text-[#343B4B] text-base leading-[22px]">
                {label}
              </span>
            )}
          </div>
          
          {showClearButton && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center justify-center w-[17px] h-[17px]"
            >
              <X 
                className="w-4 h-4 text-[#8E8E93]" 
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {description && (
          <p className="text-sm text-[#8E8E93] mt-1 px-4">{description}</p>
        )}
        
        {error && (
          <p className="text-sm text-red-500 mt-1 px-4">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
