export const vehicleOptions = [
  "2022 Audi A3 Komfort 40 4D Sedan Qtro",
  "2022 Audi A3 Progressiv 40 4D Sedan Qtro",
  "2022 Audi A3 Technik 40 4D Sedan Qtro",
  "2022 Audi A4 Komfort 40 4D Sedan Qtro",
  "2022 Audi A4 Komfort 45 4D Sedan Qtro",
  "2022 Audi A4 Komfort 45 4D Wagon Allroad at",
  "2022 Audi A4 Progressiv 45 4D Sedan Qtro",
  "2022 Audi A4 Progressiv 45 4D Wagon Allroad at",
  "2022 Audi A4 Technik 45 4D Sedan Qtro",
  "2022 Audi A4 Technik 45 4D Wagon Allroad at",
  "2022 Audi A5 Komfort 45 4D Sportback",
  "2022 Audi A5 Progressiv 45 2D Cabriolet"
];

export const vehicleConditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
]

// Generate years from current year to 20 years back
const currentYear = new Date().getFullYear()
export const vehicleYears = Array.from(
  { length: 20 },
  (_, i) => (currentYear - i).toString()
)

// These are sample makes and models - you'll want to replace these with your actual database data
export const vehicleMakes = [
  { value: "toyota", label: "Toyota" },
  { value: "honda", label: "Honda" },
  { value: "ford", label: "Ford" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "bmw", label: "BMW" },
]

export const vehicleModels: Record<string, Array<{ value: string; label: string }>> = {
  toyota: [
    { value: "camry", label: "Camry" },
    { value: "corolla", label: "Corolla" },
    { value: "rav4", label: "RAV4" },
  ],
  honda: [
    { value: "civic", label: "Civic" },
    { value: "accord", label: "Accord" },
    { value: "cr-v", label: "CR-V" },
  ],
  ford: [
    { value: "f150", label: "F-150" },
    { value: "escape", label: "Escape" },
    { value: "mustang", label: "Mustang" },
  ],
} 