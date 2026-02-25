Routes
------

### Admin Registration

**Route:** `POST /admin/register`

This route allows the registration of new administrators.

*   If any of the required fields (`name`, `email`, or `password`) is missing in the registration request, the server responds with a 400 Bad Request error.
    
*   Upon receiving a valid registration request, the password is securely hashed using bcrypt with a salt factor of 10.
    
*   The application then checks if an administrator with the provided email already exists in the database.
    
*   If a conflict is detected (i.e., an admin with the same email already exists), a 409 Conflict response is sent with details about the existing account.
    
*   If no conflict is found, the administrator details are inserted into the database.
    
*   A 201 Created response is returned, providing information about the newly registered admin, including the name and email.

### Admin Login

**Route:** `POST /admin/login`

This route handles administrator login. *   If either the `email` or `password` field is missing in the login request, the server responds with a 401 Unauthorized error.
    
*   Upon receiving a valid login request, the application checks if the provided email is registered in the database.
    
*   If the email is not found, a 404 Not Found response is returned, indicating that the email is not registered.
    
*   If the email is found, the stored hashed password is retrieved from the database.
    
*   The stored hashed password is then compared with the provided password using bcrypt.
    
*   If the passwords match, a JWT is generated with an expiration time of 24 hours.
    
*   The server responds with a 200 OK status, providing the admin's email, name, and the generated JWT as part of the response payload.
    
*   In case of invalid passwords, a 401 Unauthorized error is returned.

## Admin Info Update
**Route**
*   `PUT /admin/update/:AdminID`
    
    *   Allows modification of an administrator's name and email.
    *   Verifies uniqueness of the provided email and checks for conflicts before updating.
    *   Returns a 200 OK status upon successful updates.
    *   Potential errors, such as duplicate entries, result in appropriate 409 Conflict or 500 Internal Server Error responses.

## Admin Password Update
**Route** 
*   `PUT /admin/updatePassword/:AdminID`
    
    *   Enables administrators to update their passwords.
    *   Validates the provided AdminID and password, ensuring a match with the stored hashed password using bcrypt.
    *   Returns a 300 Multiple Choices status if the password matches, signaling the need to update with a new password.
    *   Subsequently, the password is hashed, and the database is updated.
    *   The response includes a 200 OK status with information about the updated password.
## Assigning Engineers
### Register Engineer

**Route:** `POST /assign/register`

This route allows the registration of new engineers for project assignments.

* If any of the required fields (`userID` or `projectID`) is missing in the registration request, the server responds with a 400 Bad Request error.

* The application checks whether the project with the specified ID exists.

* If the user is already assigned to the project, a 409 Conflict response is sent.

* Upon successful registration, the engineer is assigned to the project, and a 201 Created response is returned.

### Fetch All Assigned Engineers

**Route:** `GET /assign/fetchAllEngineers`

This route retrieves information about all engineers assigned to projects.

* If there is no data in the `AssignedEngineer` table, a 404 Not Found response is returned.

* The response includes an array with project names and the engineers assigned to each project.

### Fetch Available Engineers by Project ID

**Route:** `GET /fetchAvailableUsers/:projectID`

This route fetches engineers that can be added to a specific project based on the project ID.

* If no available users are found, a 404 Not Found response is returned.

### Fetch All Projects by User ID

**Route:** `GET /fetchProjectsByUserID/:userID`

This route retrieves all projects assigned to a specific engineer based on the user ID.

* If the user ID is missing or invalid, a 400 Bad Request response is returned.

* If no projects are found for the user, a 404 Not Found response is returned.

* The response includes an array with project names and IDs.

### Fetch All Users by Project ID

**Route:** `GET /fetchAllUsersByProjectID/:projectID`

This route retrieves all engineers assigned to a specific project based on the project ID.

* If the project ID is missing or invalid, a 400 Bad Request response is returned.

* If no engineers are assigned to the project, a 404 Not Found response is returned.

* The response includes an array with user IDs and names.

### Delete All Assigned Engineers by Project ID

**Route:** `DELETE /deleteAllAssigned/:projectID`

This route deletes all engineer assignments associated with a specific project.

* If the project ID is missing or invalid, a 400 Bad Request response is returned.

* If no engineers are assigned to the project, a 404 Not Found response is returned.

* Upon successful deletion, a 200 OK response is returned.

### Delete One Assigned Engineer

**Route:** `DELETE /deleteSpecificAssigned/:userID/:projectID`

This route deletes a specific engineer assignment based on user ID and project ID.

* If either the user ID or project ID is missing or invalid, a 400 Bad Request response is returned.

* If the specified project does not exist, a 404 Not Found response is returned.

* If the specified engineer is not assigned to the project, a 404 Not Found response is returned.

* Upon successful deletion, a 200 OK response is returned.

### Delete All Assigned Rows by UserID

**Route:** `DELETE /deleteAllAssignedByUser/:userID`

This route deletes all project assignments associated with a specific user based on the provided user ID.

### Request

*   Method: `DELETE`
*   Endpoint: `/deleteAllAssignedByUser/:userID`
*   Parameters:
    *   `userID` (URL parameter): The ID of the user whose assignments should be deleted.

### Response

*   **Success:**
    
    *   Status Code: `200 OK`
    *   Body: `{ "message": "Successful: <userName> has been deleted from AssignedEngineer table" }`
*   **User Not Found:**
    
    *   Status Code: `404 Not Found`
    *   Body: `{ "message": "404: User with ID <userID> not found" }`
*   **No Assignments Found:**
    
    *   Status Code: `404 Not Found`
    *   Body: `{ "message": "404: <userName> with ID <userID> was not assigned to any project" }`
*   **Bad Request (Invalid User ID):**
    
    *   Status Code: `400 Bad Request`
    *   Body: `{ "message": "Bad Request: User ID is <userID>, type <typeof(userID)>" }`
*   **Internal Server Error:**
    
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "message": "Internal Server Error" }`


## Project APIs
### Create Project

**Route:** `POST /project/create`

This route is used to create a new project.

*   Required Fields: `name`, `details`, `startDate`, `endDate`, `location`, `status`
*   If any of the required fields are missing, the server responds with a 400 Bad Request error.
*   The route validates the date format, ensuring that `startDate` and `endDate` are in the format `YYYY-MM-DD`.
*   If the `startDate` is after the `endDate`, a 400 Bad Request error is returned.
*   The project is created in the database with a default status of "In progress" (status value 0).
*   A 200 OK response is returned upon successful project creation.

### Fetch Project by ID

**Route:** `GET /project/fetchProject/:projectID`

This route retrieves project information based on the provided project ID.

*   If the project ID is missing or not a valid number, a 400 Bad Request error is returned.
*   If no project is found with the specified ID, a 404 Not Found response is returned.
*   Upon success, a 200 OK response is returned with the project details.

### Fetch Project Name by ID

**Route:** `GET /project/fetchName/:projectID`

This route retrieves the name of a project based on the provided project ID.

*   If the project ID is missing or not a valid number, a 400 Bad Request error is returned.
*   If no project is found with the specified ID, a 404 Not Found response is returned.
*   Upon success, a 200 OK response is returned with the project name.

### Fetch All Projects by Status

**Route:** `GET /project/fetchAllProjectByStatus`

This route retrieves all projects based on their status.

*   The `status` parameter is required in the request body.
*   If the status is not a valid number or missing, a 400 Bad Request error is returned.
*   Valid status values: 0 (Upcoming), 1 (On-going), 2 (Completed).
*   If no projects are found with the specified status, a 404 Not Found response is returned.
*   Upon success, a 200 OK response is returned with the list of projects.

### Update Project Status by ID

**Route:** `PUT /project/updateStatus/:projectID`

This route allows updating the status of a project based on the provided project ID.

*   Required Fields: `status` in the request body.
*   If the project ID or status is not a valid number, a 400 Bad Request error is returned.
*   If no project is found with the specified ID, a 404 Not Found response is returned.
*   If the status update results in no changes (status value is already the same), a 304 Not Modified response is returned.
*   Upon successful status update, a 200 OK response is returned.

## Scope of Work APIs

### Create Scope Work

**Route:** `POST /`

This route allows the creation of a new scope work.

#### Request

*   Method: `POST`
*   Endpoint: `/`
*   Body Parameters:
    *   `workName` (string, required): Name of the scope work.
    *   `description` (string): Description of the scope work.
    *   `status` (string): Status of the scope work.
    *   `projectId` (number, required): ID of the project to which the scope work belongs.

#### Response

*   Success:
    *   Status Code: `201 Created`
    *   Body: `{ "message": "Scope work created successfully", "id": <insertedWorkId> }`
*   Bad Request:
    *   Status Code: `400 Bad Request`
    *   Body: `{ "message": "Bad Request: Missing required fields", "projectId": <providedProjectId> || null, "workName": <providedWorkName> || null }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Get Scope Work by ID

**Route:** `GET /:id`

This route retrieves scope work information based on the provided ID.

#### Request

*   Method: `GET`
*   Endpoint: `/:id`
*   URL Parameter:
    *   `id` (number, required): ID of the scope work.

#### Response

*   Success:
    *   Status Code: `200 OK`
    *   Body: `{ "Work_Name": "<workName>", "Description": "<description>", "Status": "<status>", "ProjectID": <projectId> }`
*   Not Found:
    *   Status Code: `404 Not Found`
    *   Body: `{ "message": "Scope work not found" }`
*   Bad Request:
    *   Status Code: `400 Bad Request`
    *   Body: `{ "error": "Work ID is required." }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Update Scope Work

**Route:** `PUT /:id`

This route allows updating the details of a scope work.

#### Request

*   Method: `PUT`
*   Endpoint: `/:id`
*   URL Parameter:
    *   `id` (number, required): ID of the scope work.
*   Body Parameters:
    *   `workName` (string, required): Updated name of the scope work.
    *   `description` (string): Updated description of the scope work.

#### Response

*   Success:
    *   Status Code: `201 Created`
    *   Body: `{ "message": "Scope work updated successfully" }`
*   Bad Request:
    *   Status Code: `400 Bad Request`
    *   Body: `{ "error": "<error message>" }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Update Scope Work Status

**Route:** `PUT /statusUpdate/:id`

This route allows updating the status of a scope work.

#### Request

*   Method: `PUT`
*   Endpoint: `/statusUpdate/:id`
*   URL Parameter:
    *   `id` (number, required): ID of the scope work.
*   Body Parameters:
    *   `status` (string, required): Updated status of the scope work.

#### Response

*   Success:
    *   Status Code: `200 OK`
    *   Body: `{ "message": "Scope of work Status Updated successfully" }`
*   Bad Request:
    *   Status Code: `400 Bad Request`
    *   Body: `{ "message": "<error message>" }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Delete Scope Work

**Route:** `DELETE /:id`

This route allows the deletion of a scope work.

#### Request

*   Method: `DELETE`
*   Endpoint: `/:id`
*   URL Parameter:
    *   `id` (number, required): ID of the scope work.

#### Response

*   Success:
    *   Status Code: `200 OK`
    *   Body: `{ "message": "Scope of work <workName> deleted successfully" }`
*   Not Found:
    *   Status Code: `404 Not Found`
    *   Body: `{ "message": "404: Scope of Work not found" }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Get All Scope Work

**Route:** `GET /`

This route retrieves information about all scope works.

#### Request

*   Method: `GET`
*   Endpoint: `/`

#### Response

*   Success:
    *   Status Code: `200 OK`
    *   Body: `[ { "Work_Name": "<workName1>", "Description": "<description1>", "Status": "<status1>", "ProjectID": <projectId1> }, { "Work_Name": "<workName2>", "Description": "<description2>", "Status": "<status2>", "ProjectID": <projectId2> }, ... ]`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Get Scope Work by Project ID

**Route:** `GET /project/:ProjectId`

This route retrieves scope works based on the provided Project ID.

#### Request

*   Method: `GET`
*   Endpoint: `/project/:ProjectId`
*   URL Parameter:
    *   `ProjectId` (number, required): ID of the project.

#### Response

*   Success:
    *   Status Code: `200 OK`
    *   Body: `[ { "Work_Name": "<workName1>", "Description": "<description1>", "Status": "<status1>", "ProjectID": <projectId1> }, { "Work_Name": "<workName2>", "Description": "<description2>", "Status": "<status2>", "ProjectID": <projectId2> }, ... ]`
*   Bad Request:
    *   Status Code: `400 Bad Request`
    *   Body: `{ "message": "Bad Request: ProjectID is <ProjectId || null>" }`
*   Not Found:
    *   Status Code: `404 Not Found`
    *   Body: `{ "message": "Scope work not found" }`
*   Internal Server Error:
    *   Status Code: `500 Internal Server Error`
    *   Body: `{ "error": "<error message>" }`

### Add Work Quality

**Route:** `POST /workQuality`

This route allows the addition of work quality reports for a specific project and scope of work.

*   Required Fields: `ProjectID`, `WorkID`, `WorkName`, `TotalWork`, `Allignment`, `Accesories`, `SiliconIn`, `SiliconOut`, `Behaviour`, `Coment`.
*   If any of the required fields are missing, a `400 Bad Request` error is returned.
*   Checks for the existence of the specified `ProjectID` and `WorkID`.
*   If the specified project or scope of work does not exist, appropriate error responses are returned.
*   Creates a new work quality report in the database.
*   Returns a `201 Created` response with information about the newly created work quality report.

### Get Work Quality by ID

**Route:** `GET /workQuality/:id`

This route retrieves information about a specific work quality report based on the provided ID.

*   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality report is found with the specified ID, a `404 Not Found` response is returned.
*   Returns a `200 OK` response with details of the work quality report.

### Update Work Quality

**Route:** `PUT /workQuality/:id`

This route allows the modification of a work quality report based on the provided ID.

*   Required Fields: `TotalWork`, `Allignment`, `Accesories`, `SiliconIn`, `SiliconOut`, `Behaviour`, `Coment` in the request body.
*   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
*   Checks for the existence of the specified work quality report.
*   If the report is not found, a `404 Not Found` response is returned.
*   If no modifications are required, a `201 Created` response is returned.
*   Upon successful update, returns a `200 OK` response.

### Delete Work Quality

**Route:** `DELETE /workQuality/:id`

This route allows the deletion of a specific work quality report based on the provided ID.

*   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality report is found with the specified ID, a `404 Not Found` response is returned.
*   Upon successful deletion, returns a `200 OK` response.

## Work Quality APIs

### Get All Work Quality

**Route:** `GET /workQuality`

This route retrieves information about all work quality reports.

*   If no reports exist, a `404 Not Found` response is returned.
*   Returns a `200 OK` response with an array of work quality reports.

### Get Work Quality by Project

**Route:** `GET /workQuality/project/:id`

This route retrieves all work quality reports associated with a specific project based on the provided project ID.

*   If the provided project ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality reports are found for the project, a `404 Not Found` response is returned.
*   Returns a `200 OK` response with an array of work quality reports.

### Get Work Quality by Scope Work ID

**Route:** `GET /workQuality/scopeWork/:scopeWorkID`

This route retrieves work quality reports associated with a specific scope of work based on the provided scope work ID.

*   If the provided scope work ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality reports are found for the scope of work, a `404 Not Found` response is returned.
*   Returns a `200 OK` response with an array of work quality reports.

**Error Handling**
------------------

The application maintains robust error handling across various functionalities, ensuring informative HTTP status codes and messages. Specifically:

*   **Registration: (`POST /admin/register`)**
    
    *   If essential fields are missing during registration, a 400 Bad Request error is returned.
    *   In case of an attempt to register with an existing email, a 409 Conflict response is generated, providing details about the conflicting account.
    *   Internal server errors during registration trigger a 500 Internal Server Error response.
*   **Login: (`POST /admin/login`)**
    
    *   If either the email or password is missing during login, a 401 Unauthorized error is returned, specifying the missing required fields.
    *   When attempting to log in with a non-existent email, a 404 Not Found response is returned.
    *   For invalid passwords during login, a 401 Unauthorized error is generated.
    *   Internal server errors during login result in a 500 Internal Server Error response.
*   **Update Information (`PUT /admin/update/:AdminID`):**
    
    *   If the provided AdminID is missing during the update, a 400 Bad Request error is returned.
    *   In case of a conflicting email during the update, a 409 Conflict response is generated, indicating the presence of another account with the same email.
    *   Internal server errors during the update trigger a 500 Internal Server Error response.
*   **Update Password (`PUT /admin/updatePassword/:AdminID`):**
    
    *   If the provided AdminID is missing during the password update, a 400 Bad Request error is returned.
    *   When attempting to update the password for a non-existent account, a 404 Not Found response is returned.
    *   For errors during password validation, such as bcrypt errors, a 500 Internal Server Error response is generated.
    *   Internal server errors during the password update result in a 500 Internal Server Error response.
    * **Registration (`POST /assign/register`):**
  - If essential fields are missing during registration, a 400 Bad Request error is returned.
  - In case of an attempt to register with an existing assignment, a 409 Conflict response is generated.
  - Internal server errors during registration trigger a 500 Internal Server Error response.

* **Fetch All Assigned Engineers (`GET /assign/fetchAllEngineers`):**
  - If there is no data in the `AssignedEngineer` table, a 404 Not Found response is returned.

* **Fetch Available Engineers by Project ID (`GET /assign/fetchAvailableUsers/:projectID`):**
  - If no available users are found, a 404 Not Found response is returned.

* **Fetch All Projects by User ID (`GET /assign/fetchProjectsByUserID/:userID`):**
  - If the user ID is missing or invalid, a 400 Bad Request response is returned.
  - If no projects are found for the user, a 404 Not Found response is returned.

* **Fetch All Users by Project ID (`GET /assign/fetchAllUsersByProjectID/:projectID`):**
  - If the project ID is missing or invalid, a 400 Bad Request response is returned.
  - If no engineers are assigned to the project, a 404 Not Found response is returned.

* **Delete All Assigned Engineers by Project ID (`DELETE /assign/deleteAllAssigned/:projectID`):**
  - If the project ID is missing or invalid, a 400 Bad Request response is returned.
  - If no engineers are assigned to the project, a 404 Not Found response is returned.
  - Upon successful deletion, a 200 OK response is returned.

* **Delete One Assigned Engineer (`DELETE /assign/deleteSpecificAssigned/:userID/:projectID`):**
  - If either the user ID or project ID is missing or invalid, a 400 Bad Request response is returned.
* **Delete All Assigned Rows by UserID (`DELETE /assign/deleteAllAssignedByUser/:userID`):**
  - If the provided `userID` is not a valid number, a `400 Bad Request` error is returned, specifying the invalid data type.
  - If no user is found with the specified `userID`, a `404 Not Found` response is returned, indicating the absence of the user.
  - If the specified user has not been assigned to any projects, a `404 Not Found` response is returned, providing information about the absence of assignments.
  - Upon successful deletion of assignments, a `200 OK` response is returned, confirming the deletion and providing additional information in the response body.
  - In case of an internal server error during the deletion process, a `500 Internal Server Error` response is returned, indicating an issue on the server side.

*   **Create Scope Work (`POST /`):**
    
    *   If essential fields are missing, a `400 Bad Request` error is returned.
    *   In case of internal server errors during creation, a `500 Internal Server Error` response is generated.
*   **Get Scope Work by ID (`GET /:id`):**
    
    *   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
    *   If no scope work is found with the specified ID, a `404 Not Found` response is returned.
*   **Update Scope Work (`PUT /:id`):**
    
    *   If essential fields are missing during the update, a `400 Bad Request` error is returned.
    *   In case of internal server errors during the update, a `500 Internal Server Error` response is generated.
*   **Update Scope Work Status (`PUT /statusUpdate/:id`):**
    
    *   If essential fields are missing or invalid during the status update, a `400 Bad Request` error is returned.
    *   In case of internal server errors during the status update, a `500 Internal Server Error` response is generated.
*   **Delete Scope Work (`DELETE /:id`):**
    
    *   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
    *   If no scope work is found with the specified ID, a `404 Not Found` response is returned.
    *   In case of internal server errors during deletion, a `500 Internal Server Error` response is generated.
*   **Get All Scope Work (`GET /`):**
    
    *   In case of internal server errors during retrieval, a `500 Internal Server Error` response is generated.
*   **Get Scope Work by Project ID (`GET /project/:ProjectId`):**
    
    *   If the provided Project ID is missing or invalid, a `400 Bad Request` error is returned.
    *   If no scope works are found for the project, a `404 Not Found` response is returned.
    *   In case of internal server errors during retrieval, a `500 Internal Server Error` response is generated.

*   **Create Work Quality (`POST /workQuality`):**

*   If essential fields are missing, a `400 Bad Request` error is returned.
*   In case of internal server errors during creation, a `500 Internal Server Error` response is generated.

* **Get Work Quality by ID (`GET /workQuality/:id`):**

*   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality is found with the specified ID, a `404 Not Found` response is returned.

* **Update Work Quality (`PUT /workQuality/:id`):**

*   If essential fields are missing during the update, a `400 Bad Request` error is returned.
*   In case of internal server errors during the update, a `500 Internal Server Error` response is generated.

* **Delete Work Quality (`DELETE /workQuality/:id`):**

*   If the provided ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality is found with the specified ID, a `404 Not Found` response is returned.
*   In case of internal server errors during deletion, a `500 Internal Server Error` response is generated.

* **Get All Work Quality (`GET /workQuality`):**

*   In case of internal server errors during retrieval, a `500 Internal Server Error` response is generated.

* **Get Work Quality by Project ID (`GET /workQuality/project/:ProjectId`):**

*   If the provided Project ID is missing or invalid, a `400 Bad Request` error is returned.
*   If no work quality is found for the project, a `404 Not Found` response is returned.
*   In case of internal server errors during retrieval, a `500 Internal Server Error` response is generated.

These comprehensive error handling mechanisms enhance the overall reliability and user experience of the application.