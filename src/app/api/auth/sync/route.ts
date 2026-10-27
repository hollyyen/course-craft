import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new NextResponse("User not found in Clerk", { status: 404 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!existingUser) {
      await db.insert(users).values({
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
        imageUrl: user.imageUrl,
      });
    } else {
      // Optional: Update user details if they changed
      await db.update(users).set({
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
        imageUrl: user.imageUrl,
      }).where(eq(users.clerkId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AUTH_SYNC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
