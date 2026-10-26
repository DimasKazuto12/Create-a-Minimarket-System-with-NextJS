import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { decrypt, SESSION_COOKIE, type Role } from "./session";

export async function getCachedSession() {
  "use cache: private";
  cacheLife("minutes");
  cacheTag("session");


  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decrypt(token);
}

export async function getSession() {
  return getCachedSession();
}

// Pakai di setiap Server Action. Middleware saja tidak cukup,
// karena Server Action bisa dipanggil langsung.
export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!roles.includes(session.role)) throw new Error("Akses ditolak");
  return session;
}