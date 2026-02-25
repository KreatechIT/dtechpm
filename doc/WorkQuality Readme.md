# Work Quality API Documentation

This API provides endpoints for managing work qualities.

## Endpoints

1. **GET all work qualities:**
   - URL: `http://127.0.0.1:4000/work-qualities`
   - Method: GET
   - No additional data needed.

2. **GET a specific work quality by ID:**
   - URL: `http://127.0.0.1:4000/work-qualities/:id`
   - Replace `:id` with the actual ID you want to retrieve.
   - Method: GET
   - No additional data needed.

### 3.Create a New Work Quality

- URL: `http://127.0.0.1:4000/work-qualities`
- Method: POST
- Body: JSON with the data for the new work quality.

  ```json
  {
    "ProjectID": 1,
    "WorkID": 1,
    "WorkName": "ami",
    "TotalWork": "some total work",
    "Allignment": 0,
    "Accesories": 0,
    "SiliconIn": 0,
    "SiliconOut": 0,
    "Behaviour": "some behavior",
    "Coment": "some comment"
  }

4. **Update a specific work quality by ID:**
   - URL: `http://127.0.0.1:4000/work-qualities/:id`
   - Replace `:id` with the actual ID you want to update.
   - Method: PUT
   - Body: JSON with the updated data for the work quality.
     ```json
     {
       "materialName": "Updated Material",
       "rate": 120,
       "quantity": "15 units",
       "quality": "Excellent",
       "remarks": "This is the updated work quality",
       "projectId": 1,
       "workId": 1
     }
     ```

5. **DELETE a specific work quality by ID:**
   - URL: `http://127.0.0.1:4000/work-qualities/:id`
   - Replace `:id` with the actual ID you want to delete.
   - Method: DELETE
   - No additional data needed.

6. **GET  works quality by project ID:**
   - URL: http://127.0.0.1:4000/work-qualities/project/:id
   - Replace :id with the project ID.
   - Method: GET
   - No additional data needed.   