import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/utils";

// const { auth } = NextAuth(authConfig);
import { auth } from "@/auth";

export default auth((request) => {
  const { nextUrl } = request;

  const isLoggedIn = !!request.auth;

  const publicRoutes = ["/", "/search", "/feedback"];
  const authRoutes = ["/login", "/register", "/verification"];
  const privateRoutes = ["/clinic", "/profile"];
  const apiAuthRoutes = ["/api/auth"];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isApiAuthRoute = apiAuthRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isApiAuthRoute) {
    return null;
  }

  // Prevent user from accessing login and register page if already logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPrivateRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  if (!isLoggedIn && nextUrl.pathname.includes("/search/clinic/schedule/")) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return null;
});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc|feedback)(.*)"],
};
