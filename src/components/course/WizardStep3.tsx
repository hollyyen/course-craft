"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Edit2, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { CourseWizardState } from "./CourseWizard"

export function WizardStep3({
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
  const [isLoading, setIsLoading] = useState(!state.generatedOutline)
  const [editingChapter, setEditingChapter] = useState<number | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ cIdx: number, lIdx: number } | null>(null)

  const generateCourse = async () => {
    setIsLoading(true)
    try {
      let body: any;
      let headers: any = {};
      
      if (state.inputType === "pdf" && state.pdfFile) {
        const formData = new FormData();
        formData.append("pdfFile", state.pdfFile);
        formData.append("state", JSON.stringify(state));
        body = formData;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify(state);
      }

      const res = await fetch("/api/generate/course", {
        method: "POST",
        headers,
        body
      })
      if (!res.ok) throw new Error("Failed to generate course")
      const data = await res.json()
      updateState({ generatedOutline: data })
      toast.success("Curriculum generated successfully!")
    } catch (error) {
      toast.error("Error generating curriculum. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!state.generatedOutline) {
      generateCourse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="text-center space-y-4 py-12">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">AI is drafting your curriculum...</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're putting together the perfect syllabus for {state.targetAudience} at a {state.level} level.
          </p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!state.generatedOutline) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Something went wrong.</h2>
        <Button onClick={generateCourse}>Try Again</Button>
      </div>
    )
  }

  const handleTitleChange = (newTitle: string) => {
    updateState({ generatedOutline: { ...state.generatedOutline, title: newTitle } })
  }

  const handleDescChange = (newDesc: string) => {
    updateState({ generatedOutline: { ...state.generatedOutline, description: newDesc } })
  }

  const handleChapterChange = (cIdx: number, newTitle: string) => {
    const newOutline = { ...state.generatedOutline }
    newOutline.chapters[cIdx].title = newTitle
    updateState({ generatedOutline: newOutline })
  }

  const handleLessonChange = (cIdx: number, lIdx: number, field: 'title' | 'summary', val: string) => {
    const newOutline = { ...state.generatedOutline }
    newOutline.chapters[cIdx].lessons[lIdx][field] = val
    updateState({ generatedOutline: newOutline })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Review Curriculum</h2>
          <p className="text-muted-foreground mt-1">Make any adjustments before publishing.</p>
        </div>
        <Button onClick={generateCourse} variant="outline" size="sm" className="hidden sm:flex">
          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
        </Button>
      </div>

      <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border">
        <div className="space-y-2">
          <Label>Refined Title</Label>
          <Input 
            value={state.generatedOutline.title} 
            onChange={(e) => handleTitleChange(e.target.value)}
            className="font-semibold text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Refined Description</Label>
          <Textarea 
            value={state.generatedOutline.description} 
            onChange={(e) => handleDescChange(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Chapters & Lessons</h3>
        {state.generatedOutline.chapters.map((chapter: any, cIdx: number) => (
          <div key={cIdx} className="border rounded-lg p-4 space-y-4 bg-card shadow-sm">
            <div className="flex items-center gap-2">
              {editingChapter === cIdx ? (
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={chapter.title} 
                    onChange={(e) => handleChapterChange(cIdx, e.target.value)}
                    className="flex-1 font-bold"
                  />
                  <Button size="icon" variant="ghost" onClick={() => setEditingChapter(null)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between group">
                  <h4 className="font-bold text-lg">{chapter.title}</h4>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => setEditingChapter(cIdx)}>
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900 ml-2">
              {chapter.lessons.map((lesson: any, lIdx: number) => {
                const isEditing = editingLesson?.cIdx === cIdx && editingLesson?.lIdx === lIdx
                return (
                  <div key={lIdx} className="bg-muted/50 p-3 rounded-md group">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input 
                          value={lesson.title} 
                          onChange={(e) => handleLessonChange(cIdx, lIdx, 'title', e.target.value)}
                          className="font-medium h-8"
                        />
                        <Textarea 
                          value={lesson.summary} 
                          onChange={(e) => handleLessonChange(cIdx, lIdx, 'summary', e.target.value)}
                          className="text-sm h-16"
                        />
                        <Button size="sm" variant="ghost" onClick={() => setEditingLesson(null)} className="w-full">
                          Done
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-sm">{lesson.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{lesson.summary}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-6 w-6" onClick={() => setEditingLesson({ cIdx, lIdx })}>
                          <Edit2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={prevStep} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Continue to Publish <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
