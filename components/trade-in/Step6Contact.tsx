import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft } from "lucide-react"
import { StepHeader } from "./StepHeader"

interface Step6Props {
  onNext: (data: Step6Data) => void
  initialData?: Step6Data
  currentStep?: number
  totalSteps?: number
  onBack?: () => void
}

export interface Step6Data {
  firstName: string
  lastName: string
  phone: string
  email: string
  acceptTerms: boolean
}

export function Step6Contact({ onNext, initialData, currentStep, totalSteps, onBack }: Step6Props) {
  const [formData, setFormData] = useState<Step6Data>(initialData || {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    acceptTerms: "",
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone)
  }

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      acceptTerms: "",
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms of service"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <StepHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
      />
      <CardHeader className="px-[30px] text-left">
        <CardTitle className="font-manrope text-[21px] font-extrabold text-black leading-normal">
          Contact Information
        </CardTitle>
        <p className="text-black text-[16px] font-normal leading-[120%]">
          We'll send your estimate to your email
        </p>
      </CardHeader>
      <CardContent className="px-[30px] py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[16px]">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, firstName: e.target.value }))
                }
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[16px]">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, lastName: e.target.value }))
                }
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[16px]">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, phone: e.target.value }))
              }
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[16px]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Terms of Service */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms of service
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">{errors.acceptTerms}</p>
            )}
          </div>

          <div className="!mt-[30px]">
            <Button type="submit" className="w-full">
              Get My Trade-In Value
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 