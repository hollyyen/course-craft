import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { courses } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Course = InferSelectModel<typeof courses>;

export function CourseCard({ course, chapterCount }: { course: Course; chapterCount: number }) {
  return (
    <Link href={`/dashboard/course/${course.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group cursor-pointer">
        <div className="relative w-full h-40 bg-indigo-100 dark:bg-indigo-950/50">
          {course.bannerImage ? (
            <Image
              src={course.bannerImage}
              alt={course.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-indigo-300 dark:text-indigo-700">
              <BookOpen className="w-12 h-12" />
            </div>
          )}
        </div>
        <CardHeader className="p-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {course.category}
            </Badge>
            <Badge variant={course.isPublished ? "default" : "outline"} className="text-[10px] uppercase">
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <BookOpen className="w-4 h-4" />
            <span>
              {chapterCount} {chapterCount === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          <Badge variant="outline" className="text-xs capitalize border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20">
            {course.level}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
