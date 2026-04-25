/**
 * Admin Authorization Middleware
 * 
 * Purpose: 
 * - Verifies that the authenticated user has administrative privileges.
 * - Used to protect routes labeled "Security: Admin Only" in API-ROUTES.md.
 * 
 * Logic:
 * - Extracts JWT payload.
 * - Checks if payload.admin is true.
 * - Returns 401/403 if check fails, otherwise calls next().
 */
