import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { courses, chapters, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, LayoutList, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CourseOverviewPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, params.courseId),
  });

  if (!course) {
    redirect("/dashboard");
  }

  const courseChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, course.id),
    orderBy: [asc(chapters.order)],
  });

  const courseLessons = await db.query.lessons.findMany({
    where: (lessons, { inArray }) => inArray(lessons.chapterId, courseChapters.map(c => c.id)),
    orderBy: [asc(lessons.order)],
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-indigo-100 dark:bg-indigo-900 shadow-sm shrink-0">
            {course.bannerImage ? (
              <Image src={course.bannerImage} alt={course.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-indigo-300">
                <BookOpen className="w-12 h-12" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant={course.isPublished ? "default" : "outline"}>
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline" className="capitalize text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400">
                {course.level} • {course.tone}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <LayoutList className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Curriculum Overview</h2>
        </div>

        <div className="space-y-4">
          {courseChapters.map((chapter) => {
            const chapterLessons = courseLessons.filter(l => l.chapterId === chapter.id);
            return (
              <Card key={chapter.id}>
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-xl border-b pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-muted-foreground font-normal text-sm w-8">
                      {chapter.order.toString().padStart(2, '0')}
                    </span>
                    {chapter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {chapterLessons.map((lesson) => (
                      <Link 
                        key={lesson.id} 
                        href={`/dashboard/course/${course.id}/chapters/${chapter.id}`}
                        className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{lesson.content}</p>
                        </div>
                      </Link>
                    ))}
                    {chapterLessons.length === 0 && (
                      <div className="p-4 text-sm text-muted-foreground italic">
                        No lessons in this chapter yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
