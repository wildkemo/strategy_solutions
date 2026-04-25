/**
 * Authentication Check Middleware
 * 
 * Purpose:
 * - A lightweight check to ensure a valid 'access_token' is present before reaching API handlers.
 * - If access_token is expired, attempts to use refresh_token to rotate.
 * - Used by routes that require an active session but aren't covered by the global navigation middleware.
 */
