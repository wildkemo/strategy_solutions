/**
 * Auth Controller
 * 
 * Handlers for:
 * 
 * 1. Login
 *    - Method: POST
 *    - Path: /api/login
 *    - Body: { email, password }
 *    - Description: Authenticates users and sets access_token and refresh_token HTTP-only cookies.
 * 
 * 2. Logout
 *    - Method: POST
 *    - Path: /api/logout
 *    - Description: Clears access_token and refresh_token cookies.
 * 
 * 3. Session Check
 *    - Method: GET
 *    - Path: /api/session
 *    - Description: Verifies access_token. Triggers rotation if expired but refresh_token is valid.
 * 
 * 4. Token Refresh
 *    - Method: POST
 *    - Path: /api/refresh_token
 *    - Description: Uses refresh_token to issue a new access_token.
 * 
 * 5. Get Current User
 *    - Method: GET
 *    - Path: /api/get_current_user
 *    - Description: Retrieves profile info using access_token.
 */
