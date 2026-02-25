# User Management API Documentation

This API provides endpoints for user registration, login, edit, delete, and retrieval functionalities.

## Endpoints

1. **Register a new user:**
   - URL: `http://127.0.0.1:4000/users/register`
   - Method: POST
   - Body: JSON with user registration data.
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - File Upload: Include a file in the request with the key `photo` for the user's profile picture.


2. **Login as a user:**
   - URL: `http://127.0.0.1:4000/users/login`
   - Method: POST
   - Body: JSON with user login credentials.
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```

3. **Edit user details:**
   - URL: `http://127.0.0.1:4000/users/:id`
   - Replace `:id` with the actual user ID.
   - Method: PUT
   - Body: JSON with updated user data.
     ```json
     {
       "name": "Updated Name",
       "email": "updated@example.com",
       "password": "newpassword456",
       "contact": "9876543210"
     }
     ```
   - File Upload: Include a file in the request with the key `photo` for the user's profile picture.

4. **Delete a user:**
   - URL: `http://127.0.0.1:4000/users/:id`
   - Replace `:id` with the actual user ID.
   - Method: DELETE

5. **Get user by ID:**
   - URL: `http://127.0.0.1:4000/users/:id`
   - Replace `:id` with the actual user ID.
   - Method: GET
   - Response: JSON with user details.
     ```json
     {
       "UserID": 1,
       "Name": "John Doe",
       "Email": "john@example.com",
       "Contact": "1234567890",
       "Photo": "profile.jpg"
     }

6. **Update Password:**
   - URL: `http://127.0.0.1:4000/users/:id/password-and-email`
   - Replace `:id` with the actual user ID.
   - Method: PUT
   - Body: JSON with updated user data.
     ```json
     {
       "email": "olee@example.com",
       "password": "1234",
     }
     ```
        