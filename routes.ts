/**
 * Array of routes thta are accessible to the public
 * This routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * Array of routes thta are used for authentication
 * This routes will redirect users to /settings
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/error",
  "/auth/reset",
];

/**
 * Prefix for API authentication Routes
 * Routes that start with this prefix are used for authenticaton purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after login in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
