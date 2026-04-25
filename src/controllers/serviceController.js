/**
 * Service Controller
 * 
 * Handlers for:
 * 
 * 1. Get Services
 *    - Method: GET
 *    - Path: /api/get_services
 *    - Description: Retrieves all available services.
 * 
 * 2. Add Service
 *    - Method: POST
 *    - Path: /api/add_service
 *    - Security: Admin Only
 *    - Body: FormData (title, description, category, icon, features (JSON), image (File))
 *    - Description: Adds a new service and saves uploaded image.
 * 
 * 3. Update Service
 *    - Method: PUT
 *    - Path: /api/update_services
 *    - Security: Admin Only
 *    - Body: FormData (id, title, description, category, icon, features (JSON), image (File, optional))
 *    - Description: Updates an existing service and its image.
 * 
 * 4. Delete Service
 *    - Method: DELETE
 *    - Path: /api/delete_services
 *    - Security: Admin Only
 *    - Body: { id }
 *    - Description: Deletes a service record and its associated image file.
 * 
 * 5. Get Image
 *    - Method: GET
 *    - Path: /api/image/[filename]
 *    - Description: Serves images stored in the uploads/ directory.
 */
