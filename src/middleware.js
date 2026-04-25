/**
 * Global Middleware
 * 
 * File Path: src/middleware.js
 * Purpose: Centralized request interceptor for authentication enforcement, 
 * role-based access control (RBAC), and session-aware navigation.
 * 
 * 1. Configuration & Scope
 * - Matcher Path: "/((?!api|_next|.*\\..*).*)"
 *   - Description: Intercepts all routes EXCEPT api/, _next/, and static files.
 * - Secret Management: Uses TextEncoder for process.env.JWT_ACCESS_SECRET and 
 *   process.env.JWT_REFRESH_SECRET (jose library compatibility).
 * 
 * 2. Key Logic & Redirection Flows
 * 
 * A. Authenticated Navigation Protection:
 * - Target: /login, /register
 * - Behavior: Redirect to /services if valid access_token exists.
 * - Resilience: If access_token is missing/expired, check refresh_token.
 * 
 * B. Public Route Whitelisting:
 * - Whitelist: /, /login, /register, /about, /contact, /forgot-password, /services*
 * - Behavior: Bypass authentication checks for these paths.
 * 
 * C. Private Route Protection:
 * - Target: Non-whitelisted routes (e.g., /profile, /my-orders).
 * - Requirement: Valid access_token cookie.
 * - Redirection: Redirect to /login if token is missing/invalid (and refresh fails).
 * 
 * D. Role-Based Access Control (Admin Dashboard):
 * - Target: /blank_admin*
 * - Verification: Extracts JWT payload from access_token and checks 'admin' boolean claim.
 * - Enforcement: Redirect to /services if payload.admin is false.
 * 
 * E. Token Expiry & Error Handling:
 * - Behavior: Attempt token rotation using refresh_token if access_token fails. 
 *   Redirect to /login if rotation also fails.
 */
