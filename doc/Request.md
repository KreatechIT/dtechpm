# Request API Documentation

This API provides endpoints for managing requests.

## Endpoints

1. **GET all requests:**

   - URL: `http://127.0.0.1:4000/request`
   - Method: GET
   - No additional data needed.

2. **GET a specific request by ID:**

   - URL: `http://127.0.0.1:4000/request/:id`
   - Replace `:id` with the actual ID you want to retrieve.
   - Method: GET
   - No additional data needed.

3. **Create a New Request:**

   - URL: `http://127.0.0.1:4000/request`
   - Method: POST
   - Body: JSON with the data for the new request.
     ```json
     {
       "ProjectID": 1,
       "AssignID": 1,
       "ReqStatus": "Pending",
       "Picture": "picture_filename.jpg"
     }
     ```

4. **Update a specific request by ID:**

   - URL: `http://127.0.0.1:4000/request/update/:id`
   - Replace `:id` with the actual ID you want to update.
   - Method: PUT
   - Body: JSON with the updated data for the request, including Picture upload.
     ```json
     {
       "ProjectID": 2,
       "AssignID": 2,
       "ReqStatus": "Completed"
     }
     ```
   - Picture should be uploaded as a file in the request.

5. **DELETE a specific request by ID:**

   - URL: `http://127.0.0.1:4000/request/:id`
   - Replace `:id` with the actual ID you want to delete.
   - Method: DELETE
   - No additional data needed.

6. **GET requests by ProjectID:**

   - URL: `http://127.0.0.1:4000/request/project/:ProjectID`
   - Replace `:ProjectID` with the actual ProjectID you want to retrieve requests for.
   - Method: GET
   - No additional data needed.

7. **Update ReqStatus by ProjectID:**
   - URL: `http://127.0.0.1:4000/request//update/reqstatus/:id`
   - Replace `:ProjectID` with the actual ProjectID you want to update ReqStatus for.
   - Method: PUT
   - Body: JSON with the updated ReqStatus.
     ```json
     {
       "ReqStatus": "NewStatus"
     }
     ```
