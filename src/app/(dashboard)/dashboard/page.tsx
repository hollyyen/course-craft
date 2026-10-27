import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, BookOpen, Sparkles } from "lucide-react";

import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { getOrCreateDbUser } from "@/lib/user";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all courses for the user
  const userCourses = await db.query.courses.findMany({
    where: eq(courses.userId, user.id),
    orderBy: [desc(courses.createdAt)],
    with: {
      // Need chapter count, but Drizzle relation query doesn't natively do count in `with` easily in findMany
      // We'll fetch chapters and compute count for now, or just fetch all and group.
      // Since it's a simple app, we can fetch chapters alongside or do a separate query.
    },
  });

  const courseIds = userCourses.map(c => c.id);

  let totalChapters = 0;
  const chapterCountsMap = new Map<string, number>();

  if (courseIds.length > 0) {
    const counts = await db
      .select({
        courseId: chapters.courseId,
        count: sql<number>`count(${chapters.id})`.mapWith(Number)
      })
      .from(chapters)
      .where(inArray(chapters.courseId, courseIds))
      .groupBy(chapters.courseId);

    counts.forEach(c => {
      chapterCountsMap.set(c.courseId, c.count);
      totalChapters += c.count;
    });
  }

  const publishedCount = userCourses.filter((c) => c.isPublished).length;
  const draftCount = userCourses.length - publishedCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <Link href="/dashboard/course/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Courses</div>
          <div className="text-3xl font-bold mt-2">{userCourses.length}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Published</div>
          <div className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{publishedCount}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Drafts</div>
          <div className="text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400">{draftCount}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Chapters</div>
          <div className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">{totalChapters}</div>
        </div>
      </div>

      {userCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center mt-8 bg-card shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
            <BookOpen className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">No courses yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            You haven't created any courses yet. Start building your first AI-powered course now!
          </p>
          <Link href="/dashboard/course/new" className="mt-6">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {userCourses.map((course) => {
            const courseChaptersCount = chapterCountsMap.get(course.id) || 0;
            return (
              <CourseCard key={course.id} course={course} chapterCount={courseChaptersCount} />
            );
          })}
        </div>
      )}
    </div>
  );
}
