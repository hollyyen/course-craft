import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

/**
 * Returns the DB row for the signed-in Clerk user, creating it if missing.
 * Returns null only when nobody is signed in.
 * Upsert on clerk_id makes it safe if two requests arrive at the same time.
 */
export async function getOrCreateDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User";

  const [row] = await db
    .insert(users)
    .values({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name,
      imageUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name,
        imageUrl: clerkUser.imageUrl,
      },
    })
    .returning();

  return row;
}
