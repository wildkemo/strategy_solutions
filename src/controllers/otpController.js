/**
 * OTP Controller
 * 
 * Handlers for:
 * 
 * 1. Send OTP
 *    - Method: POST
 *    - Path: /api/send_otp
 *    - Body: { email (optional), purpose }
 *    - Description: Generates and sends a 6-digit OTP for a specific purpose.
 * 
 * 2. Verify Generic OTP
 *    - Method: POST
 *    - Path: /api/verify
 *    - Body: { otp, email, purpose }
 *    - Description: Verifies an OTP for any purpose and email.
 * 
 * 3. Reset Password
 *    - Method: POST
 *    - Path: /api/reset_password
 *    - Body: { email, otp, password }
 *    - Description: Resets a user's password after verifying the OTP.
 */
