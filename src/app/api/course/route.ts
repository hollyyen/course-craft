import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters, lessons } from "@/db/schema";
import { getOrCreateDbUser } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, level, tone, bannerImage, isPublished, generatedOutline } = body;

    // Insert Course
    const [course] = await db.insert(courses).values({
      userId: dbUser.id,
      title: generatedOutline.title || title,
      description: generatedOutline.description || description,
      category,
      level,
      tone,
      bannerImage,
      isPublished: isPublished || false,
    }).returning();

    // Insert Chapters and Lessons
    let chapterOrder = 1;
    for (const chapterData of generatedOutline.chapters) {
      const [chapter] = await db.insert(chapters).values({
        courseId: course.id,
        title: chapterData.title,
        order: chapterOrder++,
      }).returning();

      let lessonOrder = 1;
      const lessonsToInsert = chapterData.lessons.map((lessonData: any) => ({
        chapterId: chapter.id,
        title: lessonData.title,
        content: lessonData.summary, // Initially set summary as content
        order: lessonOrder++,
      }));
      
      if (lessonsToInsert.length > 0) {
        await db.insert(lessons).values(lessonsToInsert);
      }
    }

    return NextResponse.json({ courseId: course.id });
  } catch (error) {
    console.error("[CREATE_COURSE_ERROR]", error);
    return new NextResponse("Failed to create course", { status: 500 });
  }
}
