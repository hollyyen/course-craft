"use client"

import { useState } from "react"
import { WizardStep1 } from "./WizardStep1"
import { WizardStep2 } from "./WizardStep2"
import { WizardStep3 } from "./WizardStep3"
import { WizardStep4 } from "./WizardStep4"

export type CourseWizardState = {
  inputType: "text" | "pdf";
  pdfFile: File | null;
  title: string;
  description: string;
  category: string;
  tone: string;
  level: string;
  numChapters: number;
  targetAudience: string;
  generatedOutline: any; // The JSON from Gemini
  bannerImage: string;
}

export function CourseWizard() {
  const [step, setStep] = useState(1)
  const [wizardState, setWizardState] = useState<CourseWizardState>({
    inputType: "text",
    pdfFile: null,
    title: "",
    description: "",
    category: "",
    tone: "professional",
    level: "beginner",
    numChapters: 5,
    targetAudience: "",
    generatedOutline: null,
    bannerImage: "",
  })

  const updateState = (updates: Partial<CourseWizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create a New Course</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? "text-indigo-600 font-semibold" : ""}>Basics</span>
          <span>→</span>
          <span className={step >= 2 ? "text-indigo-600 font-semibold" : ""}>Preferences</span>
          <span>→</span>
          <span className={step >= 3 ? "text-indigo-600 font-semibold" : ""}>Curriculum</span>
          <span>→</span>
          <span className={step >= 4 ? "text-indigo-600 font-semibold" : ""}>Publish</span>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6 min-h-[500px]">
        {step === 1 && (
          <WizardStep1 state={wizardState} updateState={updateState} nextStep={nextStep} />
        )}
        {step === 2 && (
          <WizardStep2 state={wizardState} updateState={updateState} nextStep={nextStep} prevStep={prevStep} />
        )}
        {step === 3 && (
          <WizardStep3 state={wizardState} updateState={updateState} nextStep={nextStep} prevStep={prevStep} />
        )}
        {step === 4 && (
          <WizardStep4 state={wizardState} updateState={updateState} prevStep={prevStep} />
        )}
      </div>
    </div>
  )
}
