//middleware.ts
import authConfig from "@/authConfig";

import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  //check if we are in public route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  //authRoutes
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    // Do nothing and allow the request to proceed
    return;
  }

  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // If user is not logged in or is not in the Public route redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
