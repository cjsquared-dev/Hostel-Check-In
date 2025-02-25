import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { addHours, isAfter } from "date-fns";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.ENVIRONMENT === "production" ? true : false,
  });

  console.log("Token:", token);

// Check if the token is expired
  if (token && token.exp) {
    const tokenExpiration = new Date(token.exp * 1000); // Convert to milliseconds
    const currentTime = new Date();
    if (isAfter(currentTime, tokenExpiration)) {
      // Token is expired, return a 401 response
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow the seed page to be accessed without authentication
  if (req.nextUrl.pathname.startsWith("/seed")) {
    return NextResponse.next();
  }

  // Redirect to login if the user is not authenticated and trying to access dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists, add userId to the request headers
  if (token && token.userId) {
    const response = NextResponse.next();
    response.headers.set("x-user-id", String(token.userId));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|seed).*)",
  ],
};
