# Trade-In Estimate Widget

## Objective
To build a trade-in estimate widget that allows users to input vehicle details and receive a trade-in value estimate based on Canadian Black Book data. The widget will provide a step-by-step guided experience, gathering all necessary information to calculate an accurate estimate and offering users the next steps to assess credit eligibility.

## Technical Requirements

- **Database Integration**: Access to vehicle database (e.g., Open Vehicle Database) to fetch make, model, and trim data.
- **API Integration**: Integrate with Canadian Black Book for real-time trade-in estimate values.
- **Multilingual Support**: Ability to toggle between English and French, translating all text accordingly.
- **Translation Files**: A folder containing different translation files for all steps and text to ensure easy management of multilingual support.
- **Frontend Framework**: Implement using Next.js with Tailwind CSS.
- **Form Validation**: Real-time validation on all steps (e.g., mileage must be a number, email format check).
- **Responsive Design**: Ensure the widget follows a mobile-first approach and is fully responsive for mobile, tablet, and desktop views.
- **Error Handling**: Gracefully handle errors in data fetching or submission with user-friendly error messages.
- **Icons**: Use Lucide icons for a consistent and modern visual experience.
- **UI Components**: Use Shadcn for building UI components.

## User Flow and Wireframes
The widget consists of six main steps with an additional final report page. Here are the details of each step, based on the wireframes provided:

### Step 1: Initial Vehicle Information (1 of 6)
- **Title**: Get Your Trade-In Value
- **Content**: Explain that values are based on Canadian Black Book data.
- **Fields**:
  - **Current Vehicle (dropdown)**: Allows users to select the Year, Make, Model, and Trim of the vehicle. This data should be fetched from a pre-existing database (e.g., Open Vehicle Database).
  - **Vehicle Mileage (KM) (input field)**: Numeric input for entering the vehicle's mileage.
  - **Vehicle Condition (dropdown)**: Options include "Excellent," "Good," "Fair," etc.
- **Button**: "Next" - Proceeds to Step 2.
- **Other**: Text below button stating, "*It takes less than 1 minute."
- **Multilingual Support**: Button to toggle between "English" and "Français."

### Step 2: Vehicle Specifications (2 of 6)
- **Title**: Your Vehicle
- **Content**: Display vehicle details previously entered with an option to "Edit."
- **Fields**:
  - **Exterior Colour (color options)**: Options include "Agate Black," "Blue Jeans," "Oxford White," "Rapid Red."
  - **Interior Colour (color options)**: Options include "Kingville," "Wood Brown."
  - **Vehicle Options (checkboxes)**: Engine options like "3.5L EcoBoost V6" and "3.0L V6 Turbo Diesel."
- **Button**: "Next" - Proceeds to Step 3.

### Step 3: Financing Status (3 of 6)
- **Title**: Vehicle Financing Status
- **Question**: "Is your vehicle currently Financed or Leased?"
- **Options (radio buttons)**:
  - Financed
  - Leased
  - Own Outright
- **Button**: "Next" - Proceeds to Step 4.

### Step 4: Damage & Repair (4 of 6)
- **Title**: Damage & Repair
- **Questions**:
  - "Has your vehicle ever been in an accident?" (Yes/No radio buttons)
    - If Yes, provide a text input to describe the damage.
  - "Is there currently any outstanding repairs that need to be fixed?" (Yes/No radio buttons)
    - If Yes, provide a text input for current outstanding repairs needed.
- **Button**: "Next" - Proceeds to Step 5.

### Step 5: Additional Details (5 of 6)
- **Title**: Additional Details
- **Questions**:
  - "Does it come with a set of Winter Tires?" (Yes/No radio buttons)
  - "Does your vehicle come with the two original sets of keys/remotes?" (Yes/No radio buttons)
  - "Does your vehicle have any major modifications (engine, suspension, exterior, exhaust etc.)?" (Yes/No radio buttons)
    - If Yes, provide a text input to describe the modifications.
- **Button**: "Next" - Proceeds to Step 6.

### Step 6: Contact Information (6 of 6)
- **Title**: Contact Info
- **Fields**:
  - First Name (text input)
  - Last Name (text input)
  - Phone (text input with country code placeholder)
  - Email (text input for email address)
- **Accept Terms of Service (checkbox)**: Required to submit the form.
- **Button**: "Get My Trade-In Value" - Proceeds to Report page.

### Report Page: Estimate Result
- **Title**: Congratulations, Your Estimate is Ready!
- **Summary**:
  - Vehicle Details: Display vehicle's make, model, year, and trim.
  - Estimated Vehicle Value: Display an estimated trade-in value range (e.g., "$57,660 - $65,695").
  - Condition: Display the condition entered by the user.
  - Total Trade-In Benefit: Display total estimated savings, including tax benefits.
  - Black Book Trade-In Value: Display the Black Book trade-in value.
  - Tax Savings: Display estimated tax savings amount.
- **Next Steps**:
  - Credit Score Button: "Get My Free Equifax Credit Score" - Offers users to obtain a credit score snapshot.
  - Note: Inform users that "This will NOT impact your Credit."

## Assumptions and Constraints

### Assumptions:
- The user will need internet connectivity to access the trade-in estimate data.
- All form fields are required unless specified (e.g., damage details are only needed if the vehicle has been in an accident).

### Constraints:
- Limited to English and French.
- Dependent on Canadian Black Book data, which may affect international scalability.

## Acceptance Criteria
- The widget must correctly display each step as outlined in the wireframes.
- Estimated values must be accurate according to Canadian Black Book data.
- The report page should provide a clear, user-friendly summary of the trade-in estimate with next steps.
- Multilingual support should be fully functional.