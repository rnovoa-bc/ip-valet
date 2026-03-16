import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  console.log("Proxy executed:", request.nextUrl.pathname);
  const auth = request.cookies.get("library-auth");

  if (
    !auth &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/api/login")
  ) {
    console.log("No auth cookie found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.+svg).*)"],
};
