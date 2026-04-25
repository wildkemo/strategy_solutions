/**
 * User Controller
 * 
 * Handlers for:
 * 
 * 1. Register (Initiate)
 *    - Method: POST
 *    - Path: /api/register
 *    - Body: { name, email }
 *    - Description: Validates registration data and sends an OTP to initiate process.
 * 
 * 2. Create Customer (Finalize)
 *    - Method: POST
 *    - Path: /api/insert_new_customer
 *    - Body: { name, email, phone, company_name, password }
 *    - Description: Creates a new record in the customers table.
 * 
 * 3. Update User Info
 *    - Method: PATCH
 *    - Path: /api/update_user_info
 *    - Body: { name, phone, password (optional), company_name, currentPassword }
 *    - Description: Updates the profile of the currently logged-in customer.
 * 
 * 4. Get All Users
 *    - Method: GET
 *    - Path: /api/get_all_users
 *    - Security: Admin Only
 *    - Description: Returns a list of all registered customers.
 * 
 * 5. Delete User
 *    - Method: DELETE
 *    - Path: /api/delete_user
 *    - Security: Admin Only
 *    - Body: { id, email (optional) }
 *    - Description: Deletes a customer record and associated orders.
 * 
 * 6. Delete Account (Self)
 *    - Method: DELETE
 *    - Path: /api/delete_account
 *    - Body: { otp, purpose }
 *    - Description: Allows a logged-in user to delete their own account after OTP verification.
 */
