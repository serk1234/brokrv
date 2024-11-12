import { NextResponse } from "next/server";

export function middleware(request) {
  // Clone the request headers and add a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "d69aaffb-80d2-451d-b6f5-d4b2765dc59d");

  // Use the appropriate URL for testing or production
  const newUrl = new URL(`http://localhost:3000${request.nextUrl.pathname}${request.nextUrl.search}`);

  // Rewrite the request to the localhost URL
  return NextResponse.rewrite(newUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/integrations/:path*",
};
