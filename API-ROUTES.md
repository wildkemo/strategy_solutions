# Strategy Solutions API Documentation

This document provides a comprehensive overview of all API routes and middleware in the Strategy Solutions project.

## Table of Contents

1. [Middleware](#middleware)
2. [Authentication & Session](#authentication--session)
3. [User Management](#user-management)
4. [Admin Management](#admin-management)
5. [Service Management](#service-management)
6. [Order Management](#order-management)
7. [OTP & Verification](#otp--verification)

---

## Middleware

### Global Middleware

- **File Path:** `src/middleware.js`
- **Purpose:** Centralized request interceptor for authentication enforcement, role-based access control (RBAC), and session-aware navigation.

#### 1. Configuration & Scope

- **Matcher Path:** `"/((?!api|_next|.*\\..*).*)"`
  - **Description:** Intercepts all application routes _except_ for:
    - Internal Next.js files (`_next/`).
    - API route handlers (`api/`).
    - Static assets (files containing a `.` in the path, e.g., `favicon.ico`, `logo.png`).
- **Secret Management:** Uses a `TextEncoder` to process `process.env.JWT_ACCESS_SECRET` and `process.env.JWT_REFRESH_SECRET` for compatibility with the Edge Runtime via the `jose` library.

#### 2. Key Logic & Redirection Flows

##### A. Authenticated Navigation Protection

- **Target:** `/login`, `/register`
- **Behavior:** If a user possesses a valid `access_token` and attempts to access the login or registration pages, they are automatically redirected to the `/services` portal.
- **Resilience:** If the `access_token` is missing or expired, the middleware checks for a `refresh_token`. If found and valid, it allows the background refresh process; otherwise, it allows the request to proceed to the login page.

##### B. Public Route Whitelisting

- **Whitelist:** `/`, `/login`, `/register`, `/about`, `/contact`, `/forgot-password`, and all sub-paths of `/services`.
- **Behavior:** Requests to these paths bypass further authentication checks, allowing public visitors to view marketing content and service catalogs.

##### C. Private Route Protection

- **Target:** Any route not listed in the whitelist (e.g., `/profile`, `/my-orders`, `/blank_customer`).
- **Requirement:** A valid `access_token` cookie must be present.
- **Redirection:** If the token is missing, the user is redirected to `/login`.

### Role-Based Access Control (Admin Dashboard)

- **Target:** `/admin_dashboard` and its sub-routes.
- **Verification Process:**
  1. Extracts the JWT payload from `access_token` using `jwtVerify`.
  2. Inspects the `admin` boolean claim within the payload.
- **Enforcement:**
  - If `payload.admin` is `false` (regular customer), the request is redirected to `/services`.
  - If `payload.admin` is `true`, the request is permitted.

##### E. Token Expiry & Error Handling

- **Behavior:** If JWT verification fails during a request to a protected or admin-only route (due to expiration, signature mismatch, or tampering), the system attempts to rotate tokens using the `refresh_token`. If that fails, the user is redirected to `/login`.

---

## Authentication & Session

### Login

- **Path:** `/api/login`
- **Method:** `POST`
- **Body:** `{ email, password }`
- **Description:** Authenticates users and sets two HTTP-only cookies: `access_token` (short-lived, e.g., 15m) and `refresh_token` (long-lived, e.g., 7 days).
- **Responses:**
  - `200 Success`: Returns `status: 'success'`, `isAdmin: boolean`, and sets the cookies.
  - `200 Error`: Returns `status: 'error'` for 'Email not registered' or 'Invalid password'.
  - `500 Error`: Internal server error.

### Logout

- **Path:** `/api/logout`
- **Method:** `POST`
- **Description:** Clears both the `access_token` and `refresh_token` cookies.
- **Responses:**
  - `200 Success`: Returns `success: true`.

### Session Check

- **Path:** `/api/session`
- **Method:** `GET`
- **Description:** Verifies the `access_token`. If expired but `refresh_token` is valid, it triggers a token rotation.
- **Responses:**
  - `200 Success`: Returns `{ isAuthenticated: boolean, user: { id, email } }`.

### Token Refresh

- **Path:** `/api/refresh_token`
- **Method:** `POST`
- **Description:** Uses the `refresh_token` cookie to issue a new `access_token`.
- **Responses:**
  - `200 Success`: Returns `{ ok: true }` and sets the new `access_token` cookie.
  - `401 Unauthorized`: If `refresh_token` is invalid or expired.

### Get Current User

- **Path:** `/api/get_current_user`
- **Method:** `GET`
- **Description:** Retrieves the profile information for the currently logged-in user or admin using the `access_token`.
- **Responses:**
  - `200 Success`: Returns `{ user: { id, email, name, isAdmin, ... } }`.
  - `200 Null`: Returns `{ user: null }` if not authenticated.
  - `401 Unauthorized`: If session check fails.

---

## User Management

### Register (Initiate)

- **Path:** `/api/register`
- **Method:** `POST`
- **Body:** `{ name, email }`
- **Description:** Validates registration data and sends an OTP to the provided email to initiate the registration process.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'OTP sent to your email'`.
  - `400 Error`: Invalid name or email format.
  - `409 Conflict`: Email already registered.

### Create Customer (Finalize)

- **Path:** `/api/insert_new_customer`
- **Method:** `POST`
- **Body:** `{ name, email, phone, company_name, password }`
- **Description:** Validates all customer data, hashes the password, and creates a new record in the `customers` table.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Customer created', id: insertId`.
  - `400 Error`: Missing fields or validation failure.
  - `409 Conflict`: Email already registered.

### Update User Info

- **Path:** `/api/update_user_info`
- **Method:** `PATCH`
- **Body:** `{ name, phone, password (optional), company_name, currentPassword }`
- **Description:** Updates the profile of the currently logged-in customer. Requires the current password for verification.
- **Responses:**
  - `200 Success`: Returns `status: 'success'`.
  - `401 Unauthorized`: Not logged in.
  - `403 Forbidden`: Wrong current password.
  - `404 Not Found`: User not found.

### Get All Users

- **Path:** `/api/get_all_users`
- **Method:** `GET`
- **Security:** Admin Only (verified via session).
- **Description:** Returns a list of all registered customers (passwords omitted).
- **Responses:**
  - `200 Success`: JSON array of users.
  - `401 Unauthorized`: Not logged in as admin.

### Delete User

- **Path:** `/api/delete_user`
- **Method:** `DELETE`
- **Security:** Admin Only.
- **Body:** `{ id, email (optional) }`
- **Description:** Deletes a customer record and all their associated orders.
- **Responses:**
  - `200 Success`: Returns `message: 'User deleted successfully', user: data`.
  - `401 Unauthorized`: Not logged in as admin.
  - `404 Not Found`: User not found.

### Delete Account (Self)

- **Path:** `/api/delete_account`
- **Method:** `DELETE`
- **Body:** `{ otp, purpose }`
- **Description:** Allows a logged-in user to delete their own account and all associated data after OTP verification.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Account deleted successfully.'`.
  - `400 Error`: Invalid/incorrect OTP or OTP expired.
  - `401 Unauthorized`: Not logged in.

---

## Admin Management

### Get All Admins

- **Path:** `/api/get_admins`
- **Method:** `GET`
- **Security:** Admin Only.
- **Description:** Returns a list of all administrator accounts.
- **Responses:**
  - `200 Success`: JSON array of admin objects.
  - `401 Unauthorized`: Not logged in as admin.

### Add Admin

- **Path:** `/api/add_admin`
- **Method:** `POST`
- **Security:** Admin Only.
- **Body:** `{ name, email, password }`
- **Description:** Creates a new administrator account.
- **Responses:**
  - `201 Created`: Returns `message: 'Admin created successfully', adminId: id`.
  - `401 Unauthorized`: Not logged in as admin.
  - `409 Conflict`: Admin email already exists.

---

## Service Management

### Get Services

- **Path:** `/api/get_services`
- **Method:** `GET`
- **Description:** Retrieves all available services provided by Strategy Solutions.
- **Responses:**
  - `200 Success`: JSON array of service objects.

### Add Service

- **Path:** `/api/add_service`
- **Method:** `POST`
- **Security:** Admin Only.
- **Body:** `FormData` (title, description, category, icon, features (JSON), image (File))
- **Description:** Adds a new service to the catalog and saves the uploaded image to the server.
- **Responses:**
  - `200 Success`: Returns `status: 'success', service: object`.
  - `400 Error`: Missing fields or invalid data.
  - `401 Unauthorized`: Not logged in as admin.

### Update Service

- **Path:** `/api/update_services`
- **Method:** `PUT`
- **Security:** Admin Only.
- **Body:** `FormData` (id, title, description, category, icon, features (JSON), image (File, optional))
- **Description:** Updates an existing service. If a new image is provided, the old image is deleted.
- **Responses:**
  - `200 Success`: Returns `status: 'success', service: updatedObject`.
  - `400/404/500 Errors`: Validation, missing record, or server error.

### Delete Service

- **Path:** `/api/delete_services`
- **Method:** `DELETE`
- **Security:** Admin Only.
- **Body:** `{ id }`
- **Description:** Deletes a service record and its associated image file from the server.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Service deleted successfully'`.
  - `404 Not Found`: Service not found.

### Get Image

- **Path:** `/api/image/[filename]`
- **Method:** `GET`
- **Description:** Serves images stored in the `uploads/` directory with appropriate content-type headers.
- **Responses:**
  - `200 Success`: Image binary stream.
  - `404 Not Found`: File not found.

---

## Order Management

### Request Service

- **Path:** `/api/request_service`
- **Method:** `POST`
- **Body:** `{ service_type, service_description }`
- **Description:** Creates a service request in 'Pending' status and sends an OTP to the user for confirmation.
- **Responses:**
  - `201 Created`: Returns `status: 'otp_sent', request_id: id, message: 'Order placed, OTP sent.'`.
  - `401 Unauthorized`: Not logged in.

### Verify Order OTP

- **Path:** `/api/verify_otp`
- **Method:** `POST`
- **Body:** `{ otp, order_id, ... }`
- **Description:** Verifies the OTP for a pending service request. If successful, sets status to 'Pending' (but confirmed) and sends a "Thank You" email.
- **Responses:**
  - `200 Success`: Returns `status: 'success'`.
  - `401/410 Errors`: Incorrect OTP or OTP expired.

### Get User Orders

- **Path:** `/api/get_user_orders` OR `/api/get_orders`
- **Method:** `GET`
- **Description:** Retrieves all service requests associated with the currently logged-in user's email.
- **Responses:**
  - `200 Success`: Returns `{ orders: [...] }`.

### Get Pending OTP Orders

- **Path:** `/api/get_pending_otp_orders`
- **Method:** `GET`
- **Description:** Retrieves service requests for the user that are awaiting OTP verification.
- **Responses:**
  - `200 Success`: Returns `{ status: 'success', pendingOrders: [...] }`.

### Get All Orders

- **Path:** `/api/get_all_orders`
- **Method:** `GET`
- **Security:** Admin Only.
- **Description:** Retrieves every service request in the system.
- **Responses:**
  - `200 Success`: JSON array of all orders.

### Update Order Status

- **Path:** `/api/update_order_status`
- **Method:** `PUT`
- **Security:** Admin Only.
- **Body:** `{ id, status }`
- **Description:** Updates the status of an order (e.g., 'Active', 'Done'). If changed to 'Done', sends a completion email to the customer.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Status updated...'`.

### Confirm Order Activation

- **Path:** `/api/thank_you-mail`
- **Method:** `POST`
- **Security:** Admin Only.
- **Body:** `{ order_id }`
- **Description:** Confirms a verified pending order, sets status to 'Active', and sends an "Order Received/Activation" email.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Order confirmed and email sent'`.

### Complete Order (Alternative)

- **Path:** `/api/done_mail`
- **Method:** `POST`
- **Security:** Admin Only.
- **Body:** `{ order_id }`
- **Description:** Marks a verified order as 'Done' and sends a completion email.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'Order marked as done and email sent'`.

### Delete Order

- **Path:** `/api/delete_order`
- **Method:** `DELETE`
- **Body:** `{ id, isAdmin }`
- **Description:** Deletes an order. Customers can only delete 'Pending' orders. Admins can delete any order if `isAdmin: true` is provided.
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'order deleted successfully'`.
  - `400 Error`: Attempting to delete non-pending order as customer.

---

## OTP & Verification

### Send OTP

- **Path:** `/api/send_otp`
- **Method:** `POST`
- **Body:** `{ email (optional if logged in), purpose }`
- **Description:** Generates and sends a 6-digit OTP for a specific purpose (e.g., 'Reset Password', 'Delete Account').
- **Responses:**
  - `200 Success`: Returns `status: 'success', message: 'OTP sent successfully'`.

### Verify Generic OTP

- **Path:** `/api/verify`
- **Method:** `POST`
- **Body:** `{ otp, email, purpose }`
- **Description:** A generic endpoint to verify an OTP for any given purpose and email. Deletes the OTP record upon successful verification.
- **Responses:**
  - `200 Success`: Returns `status: "success"`.
  - `400/401 Errors`: Expired or incorrect OTP.

### Reset Password

- **Path:** `/api/reset_password`
- **Method:** `POST`
- **Body:** `{ email, otp, password }`
- **Description:** Resets a user's password after verifying the OTP provided for the 'Reset Password' purpose.
- **Responses:**
  - `200 Success`: Returns `status: "success", message: 'Password reset successfully'`.
  - `400/404 Errors`: Invalid OTP, expired OTP, or user not found.
