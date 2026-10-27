import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { chapters, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChapterPage(props: { params: Promise<{ courseId: string, chapterId: string }> }) {
  const params = await props.params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, params.chapterId),
  });

  if (!chapter) {
    redirect(`/dashboard/course/${params.courseId}`);
  }

  const chapterLessons = await db.query.lessons.findMany({
    where: eq(lessons.chapterId, chapter.id),
    orderBy: [asc(lessons.order)],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link href={`/dashboard/course/${params.courseId}`}>
          <Button variant="ghost" className="mb-4 pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Course
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Chapter {chapter.order}: {chapter.title}</h1>
      </div>

      <div className="space-y-6">
        {chapterLessons.map((lesson) => (
          <Card key={lesson.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <PlayCircle className="text-indigo-600" />
                Lesson {chapter.order}.{lesson.order}: {lesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">{lesson.content}</p>
                {/* A rich text editor or video player could go here */}
              </div>
            </CardContent>
          </Card>
        ))}
        {chapterLessons.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card shadow-sm">
            No lessons available in this chapter.
          </div>
        )}
      </div>
    </div>
  );
}
