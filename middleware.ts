import { auth } from "@/auth";

export default auth((req) => {
  console.log("ROUTE: ", req.nextUrl.pathname);
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
