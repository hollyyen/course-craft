"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { GraduationCap, Smile, Library, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseWizardState } from "./CourseWizard"

const TONES = [
  { id: "professional", label: "Professional", icon: GraduationCap, desc: "Formal, structured, industry-standard" },
  { id: "friendly", label: "Friendly", icon: Smile, desc: "Conversational, approachable" },
  { id: "academic", label: "Academic", icon: Library, desc: "Research-based, rigorous" },
  { id: "casual", label: "Casual", icon: Zap, desc: "Relaxed, fun, informal" },
  { id: "humorous", label: "Humorous", icon: GraduationCap, desc: "funny, witty, entertaining" }
]

const LEVELS = ["beginner", "intermediate", "advanced"]

export function WizardStep2({
  state,
  updateState,
  nextStep,
  prevStep
}: {
  state: CourseWizardState,
  updateState: (s: Partial<CourseWizardState>) => void,
  nextStep: () => void,
  prevStep: () => void
}) {
  const isComplete = state.targetAudience.length > 3;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="text-muted-foreground mt-1">Tell us how you want the AI to generate the curriculum.</p>
      </div>

      <div className="space-y-4">
        <Label>Course Tone</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TONES.map(tone => (
            <div
              key={tone.id}
              onClick={() => updateState({ tone: tone.id })}
              className={cn(
                "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 transition-all",
                state.tone === tone.id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                  : "hover:border-gray-300 dark:hover:border-gray-700"
              )}
            >
              <tone.icon className={cn("w-8 h-8", state.tone === tone.id ? "text-indigo-600" : "text-gray-500")} />
              <div className="font-semibold">{tone.label}</div>
              <div className="text-xs text-muted-foreground">{tone.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Difficulty Level</Label>
        <div className="flex flex-wrap gap-4">
          {LEVELS.map(level => (
            <div
              key={level}
              onClick={() => updateState({ level })}
              className={cn(
                "cursor-pointer border rounded-full px-6 py-2 capitalize font-medium transition-all",
                state.level === level
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-sm"
                  : "hover:bg-muted"
              )}
            >
              {level}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Label>Number of Chapters</Label>
          <span className="font-bold text-lg text-indigo-600">{state.numChapters}</span>
        </div>
        <Slider
          defaultValue={[state.numChapters]}
          max={12}
          min={3}
          step={1}
          onValueChange={(val) => updateState({ numChapters: (val as number[])[0] })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience</Label>
        <Input
          id="audience"
          placeholder="e.g. College students learning Python for the first time"
          value={state.targetAudience}
          onChange={(e) => updateState({ targetAudience: e.target.value })}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={prevStep} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStep} disabled={!isComplete} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Generate Curriculum <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
