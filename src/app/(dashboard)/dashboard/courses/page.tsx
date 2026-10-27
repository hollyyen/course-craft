import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";

import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { getOrCreateDbUser } from "@/lib/user";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { CourseCard } from "@/components/dashboard/CourseCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MyCoursesPage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userCourses = await db.query.courses.findMany({
    where: eq(courses.userId, user.id),
    orderBy: [desc(courses.createdAt)],
  });

  const courseIds = userCourses.map(c => c.id);
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

    counts.forEach(c => chapterCountsMap.set(c.courseId, c.count));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <p className="text-muted-foreground">Manage and view all the courses you have created.</p>
      </div>

      {userCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center mt-8 bg-card shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
            <BookOpen className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">No courses found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            You haven't created any courses yet.
          </p>
          <Link href="/dashboard/course/new" className="mt-6">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
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
