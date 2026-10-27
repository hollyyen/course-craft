"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ImagePlus, Loader2, Rocket } from "lucide-react"
import { toast } from "sonner"
import type { CourseWizardState } from "./CourseWizard"

export function WizardStep4({
  state,
  updateState,
  prevStep
}: {
  state: CourseWizardState,
  updateState: (s: Partial<CourseWizardState>) => void,
  prevStep: () => void
}) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)

  const handleUploadSuccess = (result: any) => {
    updateState({ bannerImage: result.info.secure_url })
  }

  const handlePublish = async (isPublished: boolean) => {
    setIsPublishing(true)
    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, isPublished })
      })

      if (!res.ok) throw new Error("Failed to create course")
      
      const { courseId } = await res.json()
      toast.success(isPublished ? "Course published!" : "Course saved as draft!")
      router.push(`/dashboard/course/${courseId}`)
    } catch (error) {
      toast.error("Something went wrong.")
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div>
        <h2 className="text-2xl font-bold">Banner & Publish</h2>
        <p className="text-muted-foreground mt-1">Add a cover image and publish your course.</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] bg-slate-50 dark:bg-slate-900/50">
          {state.bannerImage ? (
            <div className="relative w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-sm">
              <Image 
                src={state.bannerImage} 
                alt="Course Banner" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <CldUploadWidget 
                  uploadPreset="course_banners" 
                  onSuccess={handleUploadSuccess}
                  onClose={() => document.body.style.overflow = 'unset'}
                  options={{ folder: "course-builder/banners" }}
                >
                  {({ open }) => (
                    <Button onClick={() => open()} variant="secondary">
                      Change Image
                    </Button>
                  )}
                </CldUploadWidget>
              </div>
            </div>
          ) : (
            <CldUploadWidget 
              uploadPreset="course_banners" 
              onSuccess={handleUploadSuccess}
              onClose={() => document.body.style.overflow = 'unset'}
              options={{ folder: "course-builder/banners" }}
            >
              {({ open }) => (
                <div 
                  onClick={() => open()}
                  className="flex flex-col items-center justify-center cursor-pointer space-y-4 hover:opacity-70 transition-opacity"
                >
                  <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <ImagePlus className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-lg">Click to upload banner</p>
                    <p className="text-sm text-muted-foreground mt-1">Recommended: 1920x1080 (16:9)</p>
                  </div>
                </div>
              )}
            </CldUploadWidget>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button onClick={prevStep} variant="outline" disabled={isPublishing}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={() => handlePublish(false)} 
            variant="secondary"
            disabled={isPublishing}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={() => handlePublish(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            Publish Course
          </Button>
        </div>
      </div>
    </div>
  )
}
