# Report API Documentation

This API provides endpoints for managing reports.

## Endpoints

1. **GET all reports:**

   - URL: `http://127.0.0.1:4000/report`
   - Method: GET
   - No additional data needed.

2. **GET a specific report by ID:**

   - URL: `http://127.0.0.1:4000/report/:id`
   - Replace `:id` with the actual ID you want to retrieve.
   - Method: GET
   - No additional data needed.

3. **Create a New Report:**

   - URL: `http://127.0.0.1:4000/report/upload`
   - Method: POST
   - Body: Form data with the data for the new report, including Picture upload.
     ```
     RequestId: 1
     ProjectID: 1
     ReqStatus: 1
     Picture: <picture_file_data>
     ```

4. **Update a specific report by ID:**

   - URL: `http://127.0.0.1:4000/report/update/:id`
   - Replace `:id` with the actual ID you want to update.
   - Method: PUT
   - Body: Form data with the updated data for the report, including Picture upload.
     ```
     RequestId: 2
     ProjectID: 2
     ReqStatus: 2
     Picture: <updated_picture_file_data>
     ```

5. **DELETE a specific report by ID:**

   - URL: `http://127.0.0.1:4000/report/:id`
   - Replace `:id` with the actual ID you want to delete.
   - Method: DELETE
   - No additional data needed.

6. **GET reports by ProjectID:**

   - URL: `http://127.0.0.1:4000/report/project/:ProjectID`
   - Replace `:ProjectID` with the actual ProjectID you want to retrieve reports for.
   - Method: GET
   - No additional data needed.

7. **Update ReqStatus by ID:**

   - URL: `http://127.0.0.1:4000/report/update-reqstatus/:id`
   - Replace `:id` with the actual ID you want to update.
   - Method: PUT
   - Body: JSON with the updated ReqStatus.
     ```json
     {
       "ReqStatus": 2
     }
     ```

8. **GET Request data by Report ID:**

   - URL: `http://127.0.0.1:4000/report/request/:id`
   - Replace `:id` with the actual ID of the report.
   - Method: GET
   - No additional data needed.
