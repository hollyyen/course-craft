"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, FileText } from "lucide-react"
import type { CourseWizardState } from "./CourseWizard"

const CATEGORIES = [
  "Technology",
  "Business",
  "Design",
  "Marketing",
  "Personal Development",
  "Science",
  "Other"
]

export function WizardStep1({
  state,
  updateState,
  nextStep
}: {
  state: CourseWizardState,
  updateState: (s: Partial<CourseWizardState>) => void,
  nextStep: () => void
}) {
  const isComplete = state.inputType === "text" 
    ? (state.title.length > 3 && state.description.length > 10 && state.category)
    : (state.pdfFile !== null && state.category);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-2xl font-bold">Course Basics</h2>
        <p className="text-muted-foreground mt-1">Let's start with the fundamental details of your course.</p>
      </div>

      <div className="space-y-4">
        <Tabs 
          defaultValue={state.inputType} 
          onValueChange={(val) => updateState({ inputType: val as "text" | "pdf" })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Type a Topic
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" /> Upload a PDF
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Advanced Python for Data Science" 
                value={state.title}
                onChange={(e) => updateState({ title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What is this course about? What will students learn?" 
                value={state.description}
                onChange={(e) => updateState({ description: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-900/50">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-4">
                <FileUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload your PDF</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our AI will read your document and generate a curriculum based entirely on its contents. (Max ~4MB)
              </p>
              
              <Input 
                type="file" 
                accept=".pdf"
                className="max-w-xs mx-auto"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateState({ 
                      pdfFile: file,
                      title: file.name.replace(".pdf", ""),
                      description: "Generated from uploaded PDF document."
                    });
                  }
                }}
              />
              
              {state.pdfFile && (
                <div className="mt-4 text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                  <span>✓</span> {state.pdfFile.name} attached successfully!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2 pt-4">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={state.category as string | undefined} 
            onValueChange={(val) => updateState({ category: val as string })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={nextStep} disabled={!isComplete} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Next Step
        </Button>
      </div>
    </div>
  )
}
