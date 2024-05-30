//middleware.ts
import authConfig from "@/authConfig";

import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  console.log("ROUTE: ", req.nextUrl.pathname);
  console.log("Is Logged In", isLoggedIn);
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
