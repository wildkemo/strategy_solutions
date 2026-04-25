/**
 * Order Controller
 * 
 * Handlers for:
 * 
 * 1. Request Service
 *    - Method: POST
 *    - Path: /api/request_service
 *    - Body: { service_type, service_description }
 *    - Description: Creates a service request and sends OTP.
 * 
 * 2. Verify Order OTP
 *    - Method: POST
 *    - Path: /api/verify_otp
 *    - Body: { otp, order_id, ... }
 *    - Description: Verifies the OTP for a pending service request.
 * 
 * 3. Get User Orders
 *    - Method: GET
 *    - Path: /api/get_user_orders OR /api/get_orders
 *    - Description: Retrieves all service requests associated with the user's email.
 * 
 * 4. Get Pending OTP Orders
 *    - Method: GET
 *    - Path: /api/get_pending_otp_orders
 *    - Description: Retrieves service requests awaiting OTP verification.
 * 
 * 5. Get All Orders
 *    - Method: GET
 *    - Path: /api/get_all_orders
 *    - Security: Admin Only
 *    - Description: Retrieves every service request in the system.
 * 
 * 6. Update Order Status
 *    - Method: PUT
 *    - Path: /api/update_order_status
 *    - Security: Admin Only
 *    - Body: { id, status }
 *    - Description: Updates the status of an order.
 * 
 * 7. Confirm Order Activation
 *    - Method: POST
 *    - Path: /api/thank_you-mail
 *    - Security: Admin Only
 *    - Body: { order_id }
 *    - Description: Confirms a verified pending order and sets status to 'Active'.
 * 
 * 8. Complete Order (Alternative)
 *    - Method: POST
 *    - Path: /api/done_mail
 *    - Security: Admin Only
 *    - Body: { order_id }
 *    - Description: Marks a verified order as 'Done'.
 * 
 * 9. Delete Order
 *    - Method: DELETE
 *    - Path: /api/delete_order
 *    - Body: { id, isAdmin }
 *    - Description: Deletes an order (Customers: only Pending; Admins: any).
 */
