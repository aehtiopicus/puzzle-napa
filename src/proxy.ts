import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  // Set custom headers for use in Server Components
  requestHeaders.set("x-url", request.nextUrl.origin);
  requestHeaders.set("x-pathname", pathname);

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log(`[Proxy] ${request.method} ${pathname}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
