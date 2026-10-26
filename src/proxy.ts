import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { HOME_BY_ROLE, ROUTE_RULES } from "@/lib/rbac";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);
  if (pathname === "/") {
    const to = session ? HOME_BY_ROLE[session.role] : "/login";
    return NextResponse.redirect(new URL(to, req.url));
  }

  const rule = ROUTE_RULES.find((r) => pathname.startsWith(r.prefix));

  // Halaman terproteksi tapi belum login
  if (rule && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Sudah login tapi role tidak cocok → lempar ke halaman miliknya
  if (rule && session && !rule.roles.includes(session.role)) {
    return NextResponse.redirect(new URL(HOME_BY_ROLE[session.role], req.url));
  }

  // Sudah login, jangan buka login/register lagi
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(HOME_BY_ROLE[session.role], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};