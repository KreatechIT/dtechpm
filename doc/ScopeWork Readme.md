# Scope Work API Documentation

This API provides endpoints for managing scope works.

## Endpoints

1. **GET all scope works:**
   - URL: `http://127.0.0.1:4000/scope-works`
   - Method: GET
   - No additional data needed.

2. **GET a specific scope work by ID:**
   - URL: `http://127.0.0.1:4000/scope-works/:id`
   - Replace `:id` with the actual ID you want to retrieve.
   - Method: GET
   - No additional data needed.

3. **Create a new scope work:**
   - URL: `http://127.0.0.1:4000/scope-works`
   - Method: POST
   - Body: JSON with the data for the new scope work.
     ```json
     {
       "Work_Name": "New Scope Work",
       "description": "This is a new scope work",
       "status": 1,
       "projectId": 1
     }
     ```

4. **Update a specific scope work by ID:**
   - URL: `http://127.0.0.1:4000/scope-works/:id`
   - Replace `:id` with the actual ID you want to update.
   - Method: PUT
   - Body: JSON with the updated data for the scope work.
     ```json
     {
       "Work_Name": "Updated Scope Work",
       "description": "This is the updated scope work",
       "status": 2,
       "projectId": 1
     }
     ```

5. **DELETE a specific scope work by ID:**
   - URL: `http://127.0.0.1:4000/scope-works/:id`
   - Replace `:id` with the actual ID you want to delete.
   - Method: DELETE
   - No additional data needed.

6. **GET scope works by project ID:**
   - URL: http://127.0.0.1:4000/scope-works/project/:id
   - Replace :id with the project ID.
   - Method: GET
   - No additional data needed.