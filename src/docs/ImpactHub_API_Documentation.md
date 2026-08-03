# ImpactHub Backend API

Backend API documentation for the ImpactHub Volunteer & NGO Impact Tracker.

Base URL:  
[https://impacthub-backend-production-2d9e.up.railway.app/api/v1](https://impacthub-backend-production-2d9e.up.railway.app/api/v1)

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Certificates](#certificates)
- [Impact Profile](#impact-profile)
- [Notifications](#notifications)
- [Reports](#reports)
- [NGO](#ngo)
- [Opportunity](#opportunity)
- [Application](#application)
- [Contribution](#contribution)

## Authentication

### Register

#### Register User

`POST` `{{baseUrl}}/auth/register`

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Creates a new user account.

##### Endpoint

POST /auth/register

##### Description

Registers a new user in the ImpactHub system and returns a JWT token upon successful registration.

##### Request Body

``` json
{
  "firstname": "Osondu",
  "lastname": "Gabriel",
  "email": "gabriel@example.com",
  "password": "Password123!",
  "phone": "+237687123456"
}
```

##### Success Response (201 Created)

``` json
{
  "status": "success",
  "data": {
    "user": {
      "id": "UUID",
      "firstname": "Osondu",
      "lastname": "Gabriel",
      "email": "gabriel@example.com",
      "phone": "+237687123456"
    },
    "token": "JWT_TOKEN"
  }
}
```

##### Validation Rules

- Email must be unique.
    
- Phone number must be unique.
    
- Password must contain:
    
    - At least one uppercase letter
        
    - At least one lowercase letter
        
    - At least one number
        
    - At least one special character
        

##### Possible Errors

- **400 Bad Request** – Validation failed.
    
- **409 Conflict** – User already exists.
    

**500 Internal Server Error** – Unexpected server error.

---

#### Forgot Password

`POST` `{{baseUrl}}/auth/forgot-password`

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Generates a one-time password (OTP) for password recovery and sends it to the user's registered email address.

If the email exists, a reset token is generated, securely hashed, stored in the database with an expiration time of 10 minutes, and sent to the user's email.

---

##### Endpoint

**POST** `{{baseUrl}}/auth/forgot-password`

---

##### Authentication

No authentication required.

---

##### Request Headers

| Header | Value |
| --- | --- |
| Content-Type | application/json |

---

##### Request Body

``` json
{
  "email": "testvolunteer01@example.com"
}
```

---

##### Success Response

**Status Code:** `200 OK`

``` json
{
  "status": "success",
  "message": "Reset token sent to email"
}
```

---

##### Error Responses

###### User Not Found

**Status Code:** `404 Not Found`

``` json
{
  "status": "failed",
  "message": "No user found with that email"
}
```

---

###### Email Sending Failed

**Status Code:** `500 Internal Server Error`

``` json
{
  "status": "failed",
  "message": "Error sending email. Please try again later"
}
```

---

##### Notes

- A 6-digit OTP is generated for password recovery.
    
- The OTP is hashed before being stored in the database.
    
- The reset token expires after **10 minutes**.
    
- The plain OTP is only sent to the user's email and is never stored in plain text.
    

---

##### Tested

---

#### Login

`POST` `{{baseUrl}}/auth/login`

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Authenticates an existing user using their email and password.

If the credentials are valid, the API returns the authenticated user's profile information and a JSON Web Token (JWT). This token is required to access all protected endpoints in the ImpactHub API.

---

##### Endpoint

**POST** `/api/v1/auth/login`

---

##### Authentication

No authentication required.

---

##### Request Headers

| Header | Value |
| --- | --- |
| Content-Type | application/json |

---

##### Request Body

``` json
{
  "email": "testvolunteer01@example.com",
  "password": "Test@1234"
}
```

---

##### Success Response

**Status Code:** `200 OK`

``` json
{
  "status": "success",
  "data": {
    "user": {
      "id": "<USER_ID>",
      "firstname": "Test",
      "lastname": "Volunteer",
      "email": "testvolunteer01@example.com",
      "phone": "+237681234570",
      "role": "volunteer",
      "isActive": true,
      "lastLogin": "2026-08-02T01:49:43.025Z",
      "createdAt": "2026-08-02T01:43:51.874Z",
      "updatedAt": "2026-08-02T01:49:43.025Z"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

---

##### Error Responses

###### Invalid Email or Password

**Status Code:** `400 Bad Request`

``` json
{
  "status": "failed",
  "message": "Incorrect Email or Password"
}
```

---

###### User Not Registered

Occurs when the user account exists but has not yet been assigned the Volunteer or NGO Admin role.

**Status Code:** `400 Bad Request`

``` json
{
  "status": "failed",
  "message": "User not registered as Volunteer or NGO Admin"
}
```

---

##### Notes

- Passwords are securely verified using **bcrypt**.
    
- A successful login updates the user's **lastLogin** timestamp.
    
- The returned JWT should be included in the `Authorization` header for all protected endpoints.
    

Example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

##### Tested

✅ Successfully tested using Postman.

---

#### Reset Password

`POST` `{{baseUrl}}/auth/reset-password/{{token}}`

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Resets a user's password using a valid password reset token.

The reset token is generated during the **Forgot Password** process and is sent to the user's registered email address. The token is hashed and validated before allowing the password to be changed.

---

##### Endpoint

**POST** `/api/v1/auth/reset-password/:token`

---

##### Authentication

No authentication required.

---

##### Path Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| token | String | Password reset token received via email |

---

##### Request Headers

| Header | Value |
| --- | --- |
| Content-Type | application/json |

---

##### Request Body

``` json
{
    "password": "NewPassword@123"
}
```

---

##### Success Response

**201 Created**

``` json
{
    "status": "success",
    "token": "<JWT_TOKEN>"
}
```

---

##### Error Responses

###### Invalid or Expired Token

``` json
{
    "status": "failed",
    "message": "Invalid or Expired Token"
}
```

---

##### Notes

- Reset tokens expire after **10 minutes**.
    
- Passwords are automatically hashed before storage.
    
- A new JWT access token is generated after a successful password reset.

---

#### Change Password

`PATCH` ``

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Allows an authenticated user to change their password by providing their current password and a new password.

---

##### Endpoint

**PATCH** `/api/v1/auth/change-password`

> **Note:** Replace `PATCH` with the actual HTTP method used in your routes if different. 
  

---

##### Authentication

Bearer Token Required

```
Authorization: Bearer <JWT_TOKEN>
```

---

##### Request Headers

| Header | Value |
| --- | --- |
| Authorization | Bearer Token |
| Content-Type | application/json |

---

##### Request Body

``` json
{
    "oldPassword": "OldPassword@123",
    "newPassword": "NewPassword@123"
}
```

---

##### Success Response

``` json
{
    "status": "success",
    "message": "Password changed successfully"
}
```

---

##### Error Responses

###### Incorrect Current Password

``` json
{
    "status": "failed",
    "error": "Password Incorrect",
    "message": "Enter Current Password"
}
```

###### User Not Found

``` json
{
    "status": "failed",
    "message": "User not found"
}
```

---

##### Notes

- User must already be authenticated.
    
- Current password must be correct.
    
- New password is hashed before being stored.

---

#### Register admin

`POST` `{{baseUrl}}/auth/register-admin`

Promotes an authenticated user to the **Platform Administrator** role.

Only authorized users should have access to this endpoint.

---

##### Endpoint

**POST** `/api/v1/auth/register-admin`

---

##### Authentication

Bearer Token Required

```
Authorization: Bearer <JWT_TOKEN>
```

---

##### Success Response

``` json
{
    "status": "success",
    "message": "Platform Admin created successfully"
}
```

---

##### Error Responses

``` json
{
    "status": "failed",
    "message": "Unauthorized"
}
```

---

##### Notes

- Changes the authenticated user's role to **platform-admin**.
    
- Intended for system administrators.

---

#### Register NGO

`POST` `{{baseUrl}}/auth/register-ngo-admin`

Promotes an authenticated user to the **NGO Administrator** role.

Only authorized users should have access to this endpoint.

---

##### Endpoint

**POST** `/api/v1/auth/register-ngo-admin`

---

##### Authentication

Bearer Token Required

```
Authorization: Bearer <JWT_TOKEN>
```

---

##### Success Response

``` json
{
    "status": "success",
    "message": "NGO Admin created successfully"
}
```

---

##### Error Responses

``` json
{
    "status": "failed",
    "message": "Unauthorized"
}
```

---

##### Notes

- Changes the authenticated user's role to **NGO-admin**.
    
- Intended for NGO account administrators.

---

#### Logout

`GET` ``

Logs the authenticated user out of the application by invalidating the current JWT access token.

The token is added to a Redis blacklist until it expires, preventing further use.

---

##### Endpoint

**POST** `/api/v1/auth/logout`

---

##### Authentication

Bearer Token Required

```
Authorization: Bearer <JWT_TOKEN>
```

---

##### Success Response

``` json
{
    "status": "success",
    "message": "logged out successfully"
}
```

---

##### Error Responses

``` json
{
    "status": "failed",
    "message": "Invalid or expired token"
}
```

---

##### Notes

- Requires Redis to be configured.
    
- Blacklists the JWT until its expiration time.
    
- The user must log in again to obtain a new access token.

---

## Users

### Volunteer

#### Register volunteer

`POST` `{{baseUrl}}/volunteer/register`

Registers the authenticated user as a volunteer and creates a volunteer profile using the user's account information.

##### Endpoint

`POST {{baseUrl}}/volunteer/register`

##### Authentication

Bearer Token required.

##### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{token}} |

##### Request Body

No request body is required.

##### Success Response (201 Created)

``` json
{
    "status": "success",
    "data": {
        "id": "...",
        "userId": "...",
        "firstname": "Test",
        "lastname": "Volunteer",
        "email": "test@example.com",
        "phone": "+237681234570"
    }
}
```

##### Error Responses

###### 400 Bad Request

``` json
{
    "status": "failed",
    "message": "Volunteer already Exists"
}
```

###### 401 Unauthorized

Returned when no authentication token is supplied.

###### 403 Forbidden

Returned when the authenticated user is not assigned the **user** role.

---

## Certificates

### Generate certificate

`POST` `{{baseUrl}}/certificates`

Generates a volunteer certificate after verifying that the volunteer has a verified contribution for the selected opportunity. A QR code and PDF certificate are generated automatically, the certificate is saved, and a notification is sent to the volunteer.

- **URL:** `/certificates`
    
- **Method:** `POST`
    
- **Access:** Internal / Authorized Service
    

##### Request Body

``` json
{
  "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
  "ngoId": 1,
  "opportunityId": 1,
  "verifiedHours": 12
}
```

##### Success Response (201 Created)

``` json
{
  "success": true,
  "message": "Certificate generated successfully",
  "data": {
    "certificate": {
      "id": "c24e9548-17f5-4668-a99a-58736aed479c",
      "issuedAt": "2026-08-02T16:28:29.726Z",
      "certificateId": "IH-2026-49QSS58C",
      "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
      "ngoId": 1,
      "opportunityId": 1,
      "verifiedHours": 12,
      "qrCode": "src/public/qr/IH-2026-49QSS58C.png",
      "pdfUrl": "src/public/certificates/IH-2026-49QSS58C.pdf",
      "status": "GENERATED",
      "createdAt": "2026-08-02T16:28:29.728Z",
      "updatedAt": "2026-08-02T16:28:29.728Z"
    },
    "volunteerName": "Test Volunteer",
    "ngoName": "red Future Foundation",
    "opportunityTitle": "Community dump Cleanup Volunteer"
  }
}
```

##### Possible Error Responses

**Volunteer not found**

``` json
{
  "success": false,
  "message": "Volunteer not found"
}
```

**NGO not found**

``` json
{
  "success": false,
  "message": "NGO not found"
}
```

**Opportunity not found**

``` json
{
  "success": false,
  "message": "Opportunity not found"
}
```

**Contribution not verified**

``` json
{
  "success": false,
  "message": "Volunteer contribution has not been verified."
}
```

**Certificate already exists**

``` json
{
  "success": false,
  "message": "Certificate has already been generated."
}
```

##### Notes

- The volunteer must exist.
    
- The NGO must exist.
    
- The opportunity must exist.
    
- The volunteer must have a **verified** contribution for the specified opportunity.
    
- Only one certificate can be generated per volunteer per opportunity.
    
- A unique certificate ID is generated automatically.
    
- A QR code is generated for certificate verification.
    
- A PDF certificate is generated and stored.
    
- A notification is automatically created for the volunteer after successful certificate generation.

---

### Get certificates

`GET` `{{baseUrl}}/certificates`

Retrieves all certificates that have been generated in the system.

- **URL:** `/certificates`
    
- **Method:** `GET`
    
- **Access:** Public _(Currently no authentication middleware is applied. This can be protected later if required.)_
    

##### Success Response (200 OK)

``` json
{
  "success": true,
  "data": [
    {
      "id": "c24e9548-17f5-4668-a99a-58736aed479c",
      "certificateId": "IH-2026-49QSS58C",
      "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
      "ngoId": 1,
      "opportunityId": 1,
      "verifiedHours": 12,
      "qrCode": "src/public/qr/IH-2026-49QSS58C.png",
      "pdfUrl": "src/public/certificates/IH-2026-49QSS58C.pdf",
      "status": "GENERATED",
      "issuedAt": "2026-08-02T16:28:29.726Z",
      "createdAt": "2026-08-02T16:28:29.728Z",
      "updatedAt": "2026-08-02T16:28:29.728Z"
    }
  ]
}
```

##### Notes

- Returns an array of all certificates stored in the database.
    
- Each certificate contains:
    
    - Unique certificate ID
        
    - Volunteer ID
        
    - NGO ID
        
    - Opportunity ID
        
    - Verified volunteer hours
        
    - QR code file path
        
    - PDF certificate file path
        
    - Current certificate status
        
    - Issue date
        
    - Creation and last update timestamps
        
- If no certificates exist, the endpoint returns an empty array:
    

``` json
{
  "success": true,
  "data": []
}
```

---

### Get a certificate

`GET` `{{baseUrl}}/certificates/c24e9548-17f5-4668-a99a-58736aed479c`

Retrieves the details of a single certificate using its database ID.

- **URL:** `/certificates/:id`
    
- **Method:** `GET`
    
- **Access:** Public _(Currently no authentication middleware is applied.)_
    

##### URL Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | UUID | Database ID of the certificate |

##### Example Request

``` http
GET /api/v1/certificates/c24e9548-17f5-4668-a99a-58736aed479c
```

##### Success Response (200 OK)

``` json
{
  "success": true,
  "data": {
    "id": "c24e9548-17f5-4668-a99a-58736aed479c",
    "certificateId": "IH-2026-49QSS58C",
    "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
    "ngoId": 1,
    "opportunityId": 1,
    "verifiedHours": 12,
    "qrCode": "src/public/qr/IH-2026-49QSS58C.png",
    "pdfUrl": "src/public/certificates/IH-2026-49QSS58C.pdf",
    "status": "GENERATED",
    "issuedAt": "2026-08-02T16:28:29.726Z",
    "createdAt": "2026-08-02T16:28:29.728Z",
    "updatedAt": "2026-08-02T16:28:29.728Z"
  }
}
```

##### Error Response (404 Not Found)

``` json
{
  "success": false,
  "message": "Certificate not found"
}
```

##### Notes

- Retrieves a single certificate using its database UUID.
    
- Returns all certificate details, including:
    
    - Certificate ID
        
    - Volunteer ID
        
    - NGO ID
        
    - Opportunity ID
        
    - Verified volunteer hours
        
    - QR code location
        
    - PDF certificate location
        
    - Certificate status
        
    - Issue date
        
    - Creation and update timestamps
        
- If the certificate does not exist, a **404 Not Found** response is returned.

---

### Download certificate

`GET` `{{baseUrl}}/certificates/c24e9548-17f5-4668-a99a-58736aed479c/download`

Returns the file path of a generated certificate PDF.

- **URL:** `{{baseUrl}}/certificates/:id/download`
    
- **Method:** `GET`
    
- **Access:** Public _(Currently no authentication middleware is applied.)_
    

##### URL Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | UUID | Database ID of the certificate |

##### Example Request

``` http
GET {{baseUrl}}/certificates/c24e9548-17f5-4668-a99a-58736aed479c/download
```

##### Success Response (200 OK)

``` json
{
  "success": true,
  "pdfUrl": "src/public/certificates/IH-2026-49QSS58C.pdf"
}
```

##### Error Response (500 Internal Server Error)

``` json
{
  "success": false,
  "message": "Certificate Not Found"
}
```

##### Notes

- Retrieves the generated PDF file path for a certificate.
    
- The certificate must already exist.
    
- The returned `pdfUrl` can be used by the frontend to download or display the certificate.
    
- If the certificate ID is invalid or does not exist, the endpoint returns an error.

---

### Verify certificate

`GET` `{{baseUrl}}/certificates/verify/IH-2026-49QSS58C`

Verifies the authenticity of a certificate using its unique certificate ID. This endpoint is intended to be accessed when a QR code on the certificate is scanned.

- **URL:** `{{baseUrl}}/certificates/verify/:certificateId`
    
- **Method:** `GET`
    
- **Access:** Public _(Currently no authentication middleware is applied.)_
    

##### URL Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `certificateId` | String | Unique certificate identifier (e.g. `IH-2026-49QSS58C`) |

##### Example Request

``` http
GET {{baseUrl}}/certificates/verify/IH-2026-49QSS58C
```

##### Success Response (200 OK)

``` json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "id": "c24e9548-17f5-4668-a99a-58736aed479c",
    "certificateId": "IH-2026-49QSS58C",
    "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
    "ngoId": 1,
    "opportunityId": 1,
    "verifiedHours": 12,
    "qrCode": "src/public/qr/IH-2026-49QSS58C.png",
    "pdfUrl": "src/public/certificates/IH-2026-49QSS58C.pdf",
    "status": "GENERATED",
    "issuedAt": "2026-08-02T16:28:29.726Z",
    "createdAt": "2026-08-02T16:28:29.728Z",
    "updatedAt": "2026-08-02T16:28:29.728Z"
  }
}
```

##### Error Response (404 Not Found)

``` json
{
  "success": false,
  "message": "Invalid certificate"
}
```

##### Notes

- Each generated certificate has a unique `certificateId`.
    
- The QR code embedded in the certificate points to this endpoint.
    
- A successful response confirms that the certificate is authentic and was issued by ImpactHub.
    
- If no certificate matches the supplied `certificateId`, the endpoint returns a **404 Not Found** response.

---

### Mark as download

`PATCH` `{{baseUrl}}/certificates/c24e9548-17f5-4668-a99a-58736aed479c/download`

Marks a certificate as downloaded after the volunteer successfully downloads it. The certificate status changes from `GENERATED` to `DOWNLOADED`.

- **Method:** `PATCH`
    
- **Endpoint:** `{{baseUrl}}/certificates/:id/download`
    

##### URL Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | UUID | Database ID of the certificate |

##### Headers

| Key | Value |
| --- | --- |
| Content-Type | application/json |

> **Note:** No request body is required. 
  

##### Success Response (200 OK)

``` json
{
  "success": true,
  "message": "Certificate downloaded",
  "data": {
    "id": "c24e9548-17f5-4668-a99a-58736aed479c",
    "certificateId": "IH-2026-49QSS58C",
    "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
    "ngoId": 1,
    "opportunityId": 1,
    "verifiedHours": 12,
    "qrCode": "src\\public\\qr\\IH-2026-49QSS58C.png",
    "pdfUrl": "src\\public\\certificates\\IH-2026-49QSS58C.pdf",
    "status": "DOWNLOADED",
    "issuedAt": "2026-08-02T16:28:29.726Z",
    "createdAt": "2026-08-02T16:28:29.728Z",
    "updatedAt": "2026-08-02T16:40:35.305Z"
  }
}
```

##### Error Response (404 Not Found)

``` json
{
  "success": false,
  "message": "Certificate Not Found"
}
```

##### Description

This endpoint:

- Finds a certificate by its database ID.
    
- Updates the certificate status from `GENERATED` to `DOWNLOADED`.
    
- Saves the updated record.
    
- Returns the updated certificate information.

---

### Archive certificate

`DELETE` `{{baseUrl}}/certificates/c24e9548-17f5-4668-a99a-58736aed479c`

Archives a certificate instead of permanently deleting it. The certificate status is updated to `ARCHIVED` while preserving the certificate record in the database.

- **Method:** `DELETE`
    
- **Endpoint:** `{{baseUrl}}/certificates/:id`
    

##### URL Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | UUID | Database ID of the certificate |

##### Headers

| Key | Value |
| --- | --- |
| Content-Type | application/json |

> **Note:** No request body is required. 
  

##### Success Response (200 OK)

``` json
{
  "success": true,
  "message": "Certificate archived successfully"
}
```

##### Error Response (404 Not Found)

``` json
{
  "success": false,
  "message": "Certificate Not Found"
}
```

##### Description

This endpoint:

- Finds a certificate by its database ID.
    
- Updates the certificate status to `ARCHIVED`.
    
- Preserves the certificate record instead of permanently deleting it.
    
- Returns a success message after the certificate has been archived.

---

## Impact Profile

### Get impact profile

`GET` `{{baseUrl}}/impact-profile`

Retrieves the authenticated volunteer's impact profile, including verified hours, completed opportunities, verified NGOs, profile visibility, and shareable link.

---

#### Endpoint

``` http
GET {{baseUrl}}/impact-profile
```

---

#### Description

This endpoint returns the volunteer's impact profile.

The profile is automatically created after the volunteer receives their first verified certificate.

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "data": {
        "id": "296d0456-f99e-4239-bf62-c6cd5e30ee57",
        "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
        "verifiedHours": 12,
        "completedOpportunities": 1,
        "verifiedNgos": 1,
        "shareableLink": "Z5EJB9P7S349N0S",
        "isPublic": false,
        "createdAt": "2026-08-02T19:02:15.835Z",
        "updatedAt": "2026-08-02T19:02:15.835Z"
    }
}
```

---

#### Error Response (404 Not Found)

``` json
{
    "success": false,
    "message": "Impact profile not found"
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Impact profile ID |
| volunteerId | UUID | Volunteer's ID |
| verifiedHours | Integer | Total verified volunteer hours |
| completedOpportunities | Integer | Total completed volunteer opportunities |
| verifiedNgos | Integer | Number of unique NGOs the volunteer has served |
| shareableLink | String | Public profile sharing link |
| isPublic | Boolean | Indicates whether the profile is publicly accessible |
| createdAt | Date | Profile creation timestamp |
| updatedAt | Date | Last profile update timestamp |

---

#### Notes

- This endpoint is intended for authenticated volunteers.
    
- The impact profile is automatically created when the volunteer earns their first certificate.
    
- The profile is automatically updated whenever additional verified contributions result in new certificates.
    
- By default, `isPublic` is set to `false`.
    
- The `shareableLink` is automatically generated when the profile is first created.

---

### Toggle profile sharing

`PATCH` `{{baseUrl}}/impact-profile/share`

Enables or disables public access to the authenticated volunteer's Impact Profile.

---

#### Endpoint

``` http
PATCH {{baseUrl}}/impact-profile/share
```

---

#### Description

This endpoint toggles the profile's visibility.

- If the profile is currently private (`isPublic = false`), it becomes public.
    
- If the profile is currently public (`isPublic = true`), it becomes private.
    

This allows volunteers to control whether others can access their profile using the shareable link.

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "message": "Profile sharing updated",
    "data": {
        "id": "296d0456-f99e-4239-bf62-c6cd5e30ee57",
        "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
        "verifiedHours": 12,
        "completedOpportunities": 1,
        "verifiedNgos": 1,
        "shareableLink": "Z5EJB9P7S349N0S",
        "isPublic": true,
        "createdAt": "2026-08-02T19:02:15.835Z",
        "updatedAt": "2026-08-02T19:15:10.220Z"
    }
}
```

> **Note:** The `isPublic` value may be either `true` or `false`, depending on its previous state. 
  

---

#### Error Response (404 Not Found)

``` json
{
    "success": false,
    "message": "Impact Profile not found"
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Impact Profile ID |
| volunteerId | UUID | Volunteer's ID |
| verifiedHours | Integer | Total verified volunteer hours |
| completedOpportunities | Integer | Total completed volunteer opportunities |
| verifiedNgos | Integer | Number of unique NGOs served |
| shareableLink | String | Public profile sharing link |
| isPublic | Boolean | Indicates whether the profile is publicly accessible |
| createdAt | Date | Profile creation timestamp |
| updatedAt | Date | Last profile update timestamp |

---

#### Notes

- This endpoint toggles the current sharing status.
    
- No request body is required.
    
- A public profile can be accessed using its shareable link.
    
- Setting `isPublic` to `false` prevents the profile from being viewed through the public share link.

---

### Regenerate shareable link

`PATCH` `{{baseUrl}}/impact-profile/regenerate-link`

Generates a new public shareable link for the authenticated volunteer's Impact Profile.

---

#### Endpoint

``` http
PATCH {{baseUrl}}/impact-profile/regenerate-link
```

---

#### Description

This endpoint generates a new unique shareable link for the volunteer's Impact Profile.

Once a new link is generated, the previous shareable link becomes invalid.

---

#### Request Body

No request body is required.

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "data": {
        "id": "296d0456-f99e-4239-bf62-c6cd5e30ee57",
        "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
        "verifiedHours": 12,
        "completedOpportunities": 1,
        "verifiedNgos": 1,
        "shareableLink": "7JRDNP4V4NBLC28",
        "isPublic": true,
        "createdAt": "2026-08-02T19:02:15.835Z",
        "updatedAt": "2026-08-02T19:12:32.709Z"
    },
    "message": "Shareable Link regenerated"
}
```

---

#### Error Response (404 Not Found)

``` json
{
    "success": false,
    "message": "Impact profile not found"
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Impact Profile ID |
| volunteerId | UUID | ID of the volunteer who owns the profile |
| verifiedHours | Integer | Total verified volunteer hours |
| completedOpportunities | Integer | Total completed volunteer opportunities |
| verifiedNgos | Integer | Number of unique NGOs the volunteer has served |
| shareableLink | String | Newly generated public profile link |
| isPublic | Boolean | Indicates whether the profile is publicly accessible |
| createdAt | DateTime | Date and time the profile was created |
| updatedAt | DateTime | Date and time the profile was last updated |

---

#### Notes

- No request body is required.
    
- A new unique shareable link is generated every time this endpoint is called.
    
- The previously generated link becomes invalid immediately.
    
- Regenerating the link does **not** change the profile's sharing status (`isPublic`).
    
- The volunteer's impact statistics remain unchanged.

---

### Get profile using link

`GET` `{{baseUrl}}/impact-profile/share/7JRDNP4V4NBLC28`

Retrieves a volunteer's public Impact Profile using their shareable link.

---

#### Endpoint

``` http
GET {{baseUrl}}/impact-profile/share/:shareableLink
```

##### Example

``` http
GET {{baseUrl}}/impact-profile/share/7JRDNP4V4NBLC28
```

---

#### Description

This endpoint allows anyone with a valid public shareable link to view a volunteer's Impact Profile.

The profile is only returned if:

- The shareable link exists.
    
- The volunteer has enabled public profile sharing (`isPublic = true`).
    

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "data": {
        "id": "296d0456-f99e-4239-bf62-c6cd5e30ee57",
        "volunteerId": "dda326eb-c5c1-48cb-a341-564675cc032d",
        "verifiedHours": 12,
        "completedOpportunities": 1,
        "verifiedNgos": 1,
        "shareableLink": "7JRDNP4V4NBLC28",
        "isPublic": true,
        "createdAt": "2026-08-02T19:02:15.835Z",
        "updatedAt": "2026-08-02T19:12:32.709Z"
    }
}
```

---

#### Error Response (404 Not Found)

``` json
{
    "success": false,
    "message": "Public profile not found"
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Impact Profile ID |
| volunteerId | UUID | ID of the volunteer who owns the profile |
| verifiedHours | Integer | Total verified volunteer hours |
| completedOpportunities | Integer | Total completed volunteer opportunities |
| verifiedNgos | Integer | Number of unique NGOs the volunteer has served |
| shareableLink | String | Public profile share link |
| isPublic | Boolean | Indicates whether the profile is publicly accessible |
| createdAt | DateTime | Date and time the profile was created |
| updatedAt | DateTime | Date and time the profile was last updated |

---

#### Notes

- This endpoint does **not** require authentication.
    
- Only profiles with `isPublic` set to `true` can be accessed.
    
- If the shareable link is invalid or the profile has been made private, the API returns a **404 Not Found** response.
    
- Volunteers can generate a new shareable link at any time, which immediately invalidates the previous one.

---

## Notifications

### Get notification

`GET` `{{baseUrl}}/notifications`

Retrieves all notifications belonging to the authenticated user. Notifications are returned from newest to oldest.

- **Method:** `GET`
    
- **Endpoint:** `{{baseUrl}}/notifications`
    

##### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer |

##### Success Response (200 OK)

``` json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "7deabd9c-d995-44db-b9bc-cdbc1ca01d75",
      "userId": "09d86b68-d546-41e3-9e0c-33cc70395f55",
      "title": "Certificate Available",
      "message": "Congratulations! Your certificate has been generated and is now available for download",
      "type": "CERTIFICATE_AVAILABLE",
      "isRead": false,
      "createdAt": "2026-08-02T16:28:29.747Z",
      "updatedAt": "2026-08-02T16:28:29.747Z"
    }
  ]
}
```

##### Error Response (401 Unauthorized)

``` json
{
  "success": false,
  "message": "Unauthorized"
}
```

##### Description

This endpoint:

- Retrieves all notifications for the authenticated user.
    
- Returns notifications sorted from newest to oldest.
    
- Includes the notification title, message, type, read status, and timestamps.
    
- Returns the total number of notifications in the `count` field.

---

### Mark notification as Read

`PATCH` `{{baseUrl}}/notifications/7deabd9c-d995-44db-b9bc-cdbc1ca01d75/read`

Marks a specific notification as read.

##### Endpoint

``` http
PATCH {{baseUrl}}/notifications/:id/read
```

##### Example Request

``` http
PATCH {{baseUrl}}/notifications/7deabd9c-d995-44db-b9bc-cdbc1ca01d75/read
```

##### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{token}} |

##### Path Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| id | UUID | The notification ID |

##### Success Response (200)

``` json
{
    "success": true,
    "message": "Notification mark as read",
    "data": {
        "id": "7deabd9c-d995-44db-b9bc-cdbc1ca01d75",
        "userId": "09d86b68-d546-41e3-9e0c-33cc70395f55",
        "title": "Certificate Available",
        "message": "Congratulations! Your certificate has been generated and is now available for download",
        "type": "CERTIFICATE_AVAILABLE",
        "isRead": true,
        "createdAt": "2026-08-02T16:28:29.747Z",
        "updatedAt": "2026-08-02T16:56:28.035Z"
    }
}
```

##### Response Fields

| Field | Description |
| --- | --- |
| success | Indicates whether the request was successful |
| message | Operation status message |
| data | Updated notification object |
| data.id | Notification UUID |
| data.userId | User who owns the notification |
| data.title | Notification title |
| data.message | Notification content |
| data.type | Notification type |
| data.isRead | Read status (`true`) |
| data.createdAt | Notification creation timestamp |
| data.updatedAt | Timestamp of the update |

##### Error Responses

###### Notification Not Found (404)

``` json
{
    "success": false,
    "message": "Notification not found"
}
```

###### Internal Server Error (500)

``` json
{
    "success": false,
    "message": "Internal Server Error"
}
```

---

### Mark all notifications as read

`PATCH` `{{baseUrl}}/notifications/read-all`

Marks **all notifications** belonging to the authenticated user as read.

---

#### Endpoint

**PATCH** `{{baseUrl}}/notifications/read-all`

---

#### Authentication

**Required**

Include a valid Bearer Token.

``` http
Authorization: Bearer <your_access_token>
```

---

#### Request Body

No request body is required.

---

#### Successful Response (200 OK)

``` json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

#### Error Responses

##### 401 Unauthorized

``` json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

##### 500 Internal Server Error

``` json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

#### Notes

- Marks every notification belonging to the authenticated user as **read**.
    
- Notifications already marked as read remain unchanged.
    
- This endpoint does not delete any notifications.

---

### Delete notifications

`DELETE` `{{baseUrl}}/notifications/7deabd9c-d995-44db-b9bc-cdbc1ca01d75`

Deletes a specific notification permanently.

---

#### Endpoint

**DELETE** `{{baseUrl}}/notifications/:id`

---

#### Authentication

**Required**

Include a valid Bearer Token.

``` http
Authorization: Bearer <your_access_token>
```

---

#### Path Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | UUID | The ID of the notification to delete |

---

#### Example Request

``` http
DELETE {{baseUrl}}/notifications/7deabd9c-d995-44db-b9bc-cdbc1ca01d75
```

---

#### Successful Response (200 OK)

``` json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

#### Error Responses

##### 404 Not Found

``` json
{
  "success": false,
  "message": "Notification not found"
}
```

---

##### 401 Unauthorized

``` json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

##### 500 Internal Server Error

``` json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

#### Notes

- Permanently removes the specified notification from the database.
    
- This action cannot be undone.
    
- If the notification ID does not exist, a **404 Not Found** response is returned.

---

## Reports

### Get dashboard statistics

`GET` `{{baseUrl}}/dashboards`

Retrieves key platform statistics for display on the administrator dashboard.

---

#### Endpoint

``` http
GET {{baseUrl}}/dashboards
```

---

#### Description

This endpoint returns a summary of the platform's current statistics, including:

- Total registered volunteers
    
- Total registered NGOs
    
- Total volunteer opportunities
    
- Total certificates generated
    
- Total verified volunteer hours
    

These statistics are generated dynamically from the database.

---

#### Request Body

No request body is required.

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "message": "Dashboard statistics generated",
    "data": {
        "totalVolunteer": 1,
        "totalNGO": 1,
        "totalOpportunities": 1,
        "totalCertificate": 1,
        "verifiedHours": 12
    }
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| totalVolunteer | Integer | Total number of registered volunteers |
| totalNGO | Integer | Total number of registered NGOs |
| totalOpportunities | Integer | Total number of volunteer opportunities |
| totalCertificate | Integer | Total number of certificates generated |
| verifiedHours | Integer | Total verified volunteer hours across all volunteers |

---

#### Error Response (500 Internal Server Error)

``` json
{
    "success": false,
    "message": "Internal Server Error"
}
```

---

#### Notes

- This endpoint is intended for the platform administrator dashboard.
    
- All statistics are calculated in real time from the database.
    
- No request body is required.
    
- The endpoint does not modify any data.
    
- The returned values automatically reflect newly created volunteers, NGOs, opportunities, certificates, and verified contributions.

---

### Get report

`GET` `{{baseUrl}}/reports`

Retrieves a comprehensive platform report containing dashboard statistics and additional analytics for administrators.

---

#### Endpoint

``` http
GET {{baseUrl}}/reports
```

---

#### Description

This endpoint generates a platform-wide report by aggregating data from volunteers, NGOs, opportunities, contributions, and certificates.

In addition to the dashboard statistics, it includes:

- Number of active volunteer opportunities
    
- Number of verified volunteer contributions
    

The report is generated dynamically each time the endpoint is called.

---

#### Request Body

No request body is required.

---

#### Success Response (200 OK)

``` json
{
    "success": true,
    "message": "Platform Report generated",
    "data": {
        "totalVolunteer": 1,
        "totalNGO": 1,
        "totalOpportunities": 1,
        "totalCertificate": 1,
        "verifiedHours": 12,
        "activeOpportunities": 0,
        "completedContributions": 1
    }
}
```

---

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| totalVolunteer | Integer | Total number of registered volunteers |
| totalNGO | Integer | Total number of registered NGOs |
| totalOpportunities | Integer | Total number of volunteer opportunities |
| totalCertificate | Integer | Total number of certificates generated |
| verifiedHours | Integer | Total verified volunteer hours across all volunteers |
| activeOpportunities | Integer | Total number of opportunities currently marked as **open** |
| completedContributions | Integer | Total number of verified volunteer contributions |

---

#### Error Response (500 Internal Server Error)

``` json
{
    "success": false,
    "message": "Internal Server Error"
}
```

---

#### Notes

- This endpoint is intended for platform administrators.
    
- The report is generated in real time from the database.
    
- No request body is required.
    
- The endpoint is read-only and does not modify any data.
    
- Dashboard statistics are included together with additional platform analytics in a single response.

---

## NGO

### Register NGO

`POST` `{{baseUrl}}/ngos`

**Headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

Creates a new NGO profile for the authenticated NGO Administrator.

> Authentication Required: Yes (Bearer Token) 
  
> Authorization Required: NGO-admin 
  

---

#### Endpoint

**POST** `{{baseUrl}}/ngos`

---

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{ngoAdminToken}} |
| Content-Type | application/json |

---

#### Request Body

``` json
{
  "name": "Red Future Foundation",
  "registrationNumber": "RC123456",
  "contactPerson": "Jane Doe",
  "email": "jane1@greenfuture.org",
  "phone": "08012346678",
  "address": "12 Unity Road, Lagos"
}
```

---

#### Success Response

**201 Created**

``` json
{
  "success": true,
  "ngo": {
    "verificationStatus": "pending",
    "id": 1,
    "name": "Red Future Foundation",
    "registrationNumber": "RC123456",
    "contactPerson": "Jane Doe",
    "email": "jane1@greenfuture.org",
    "phone": "08012346678",
    "address": "12 Unity Road, Lagos",
    "userId": "4428bca5-fdce-4669-be1c-5d21ecdf238f",
    "verificationDocuments": null,
    "createdAt": "2026-08-02T03:32:00.591Z",
    "updatedAt": "2026-08-02T03:32:00.591Z"
  }
}
```

---

#### Error Responses

##### 400 Bad Request

``` json
{
  "success": false,
  "error": "This user already has an NGO profile"
}
```

##### 401 Unauthorized

``` json
{
  "status": "failed",
  "message": "Error, Not authorized to access this route"
}
```

##### 403 Forbidden

``` json
{
  "status": "failed",
  "message": "Error, role volunteer is not authorized to access this route"
}
```

---

#### Notes

- Each NGO administrator can register only one NGO profile.
    
- Every newly created NGO starts with a `pending` verification status.
    
- Only users with the `NGO-admin` role can access this endpoint.

---

### verify NGO

`POST` `{{baseUrl}}/ngos/verify`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `{{bearer_token_17z3}}` |

Approves or rejects an NGO registration.

> Authentication Required: Yes (Bearer Token) 
  
> Authorization Required: platform-admin 
  

---

#### Endpoint

**POST** `{{baseUrl}}/ngos/verify`

---

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{platformAdminToken}} |
| Content-Type | application/json |

---

#### Request Body

Approve an NGO:

``` json
{
  "ngoId": 1,
  "decision": "approved"
}
```

Reject an NGO:

``` json
{
  "ngoId": 1,
  "decision": "rejected"
}
```

---

#### Success Response

**200 OK**

``` json
{
  "success": true,
  "ngo": {
    "id": 1,
    "name": "Red Future Foundation",
    "registrationNumber": "RC123456",
    "contactPerson": "Jane Doe",
    "email": "jane1@greenfuture.org",
    "phone": "08099887766",
    "address": "12 Unity Road, Lagos",
    "verificationStatus": "approved",
    "userId": "4428bca5-fdce-4669-be1c-5d21ecdf238f",
    "verificationDocuments": null,
    "createdAt": "2026-08-02T03:32:00.591Z",
    "updatedAt": "2026-08-02T04:00:00.000Z"
  }
}
```

---

#### Error Responses

##### 400 Bad Request

``` json
{
  "success": false,
  "error": "NGO not found"
}
```

---

##### 401 Unauthorized

``` json
{
  "status": "failed",
  "message": "Error, Not authorized to access this route"
}
```

---

##### 403 Forbidden

``` json
{
  "status": "failed",
  "message": "Error, role NGO-admin is not authorized to access this route"
}
```

---

#### Notes

- Only Platform Administrators can approve or reject NGO registrations.
    
- The `decision` field accepts either:
    
    - `"approved"`
        
    - `"rejected"`
        
- The NGO's `verificationStatus` is updated accordingly.

---

### Get my NGO

`GET` `http://localhost:5000/ngo`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

Retrieves the NGO profile belonging to the authenticated NGO Administrator.

> Authentication Required: Yes (Bearer Token) 
  
> Authorization Required: NGO-admin 
  

---

#### Endpoint

**GET** `{{baseUrl}}/ngos`

---

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{ngoAdminToken}} |

---

#### Request Body

None

---

#### Success Response

**200 OK**

``` json
{
  "success": true,
  "ngo": {
    "id": 1,
    "name": "Red Future Foundation",
    "registrationNumber": "RC123456",
    "contactPerson": "Jane Doe",
    "email": "jane1@greenfuture.org",
    "phone": "08012346678",
    "address": "12 Unity Road, Lagos",
    "verificationStatus": "pending",
    "userId": "4428bca5-fdce-4669-be1c-5d21ecdf238f",
    "verificationDocuments": null,
    "createdAt": "2026-08-02T03:32:00.591Z",
    "updatedAt": "2026-08-02T03:32:00.591Z"
  }
}
```

---

#### Error Responses

##### 401 Unauthorized

``` json
{
  "status": "failed",
  "message": "Error, Not authorized to access this route"
}
```

##### 403 Forbidden

``` json
{
  "status": "failed",
  "message": "Error, role volunteer is not authorized to access this route"
}
```

##### 404 Not Found

``` json
{
  "success": false,
  "error": "NGO profile not found"
}
```

---

#### Notes

- Returns the NGO profile associated with the currently authenticated NGO administrator.
    
- Requires a valid JWT Bearer token.
    
- Only NGO administrators can access this endpoint.

---

### update ngo

`PUT` `{{baseUrl}}/ngos`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

Updates the authenticated NGO Administrator's NGO profile.

> Authentication Required: Yes (Bearer Token) 
  
> Authorization Required: NGO-admin 
  

---

#### Endpoint

**PUT** `{{baseUrl}}/ngos`

---

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{ngoAdminToken}} |
| Content-Type | application/json |

---

#### Request Body

You may update one or more fields.

Example:

``` json
{
  "phone": "08099887766"
}
```

You can also update multiple fields:

``` json
{
  "contactPerson": "John Doe",
  "phone": "08099887766",
  "address": "45 Freedom Way, Abuja"
}
```

---

#### Success Response

**200 OK**

``` json
{
  "success": true,
  "ngo": {
    "id": 1,
    "name": "Red Future Foundation",
    "registrationNumber": "RC123456",
    "contactPerson": "Jane Doe",
    "email": "jane1@greenfuture.org",
    "phone": "08099887766",
    "address": "12 Unity Road, Lagos",
    "verificationStatus": "pending",
    "userId": "4428bca5-fdce-4669-be1c-5d21ecdf238f",
    "verificationDocuments": null,
    "createdAt": "2026-08-02T03:32:00.591Z",
    "updatedAt": "2026-08-02T03:40:00.000Z"
  }
}
```

---

#### Error Responses

##### 400 Bad Request

``` json
{
  "success": false,
  "error": "NGO profile not found"
}
```

##### 401 Unauthorized

``` json
{
  "status": "failed",
  "message": "Error, Not authorized to access this route"
}
```

##### 403 Forbidden

``` json
{
  "status": "failed",
  "message": "Error, role volunteer is not authorized to access this route"
}
```

---

#### Notes

- Only the authenticated NGO administrator can update their NGO profile.
    
- Any combination of editable fields may be provided.
    
- Fields omitted from the request remain unchanged.

---

## Opportunity

### Create opportunity

`POST` `{{baseUrl}}/opportunities`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{json_web_token_11ug}}` |

Creates a new volunteer opportunity under the authenticated NGO Administrator's verified NGO.

> Authentication Required: Yes (Bearer Token) 
  
> Authorization Required: NGO-admin 
  

---

#### Endpoint

**POST** `{{baseUrl}}/opportunities`

---

#### Headers

| Key | Value |
| --- | --- |
| Authorization | Bearer {{ngoAdminToken}} |
| Content-Type | application/json |

---

#### Request Body

``` json
{
  "title": "Community Dump Cleanup Volunteer",
  "description": "Help clean up the community refuse dump",
  "category": "Environment",
  "location": "Abuja",
  "date": "2026-08-15",
  "capacity": 20,
  "applicationDeadline": "2026-08-01",
  "requiredSkills": ["Teamwork"],
  "duration": "1 Day",
  "timeCommitment": "6 hrs",
  "compensation": "Unpaid"
}
```

---

#### Success Response

**201 Created**

``` json
{
  "success": true,
  "opportunity": {
    "...": "Opportunity object"
  }
}
```

---

#### Error Responses

##### 400 Bad Request

``` json
{
  "success": false,
  "error": "You must have an NGO profile first"
}
```

``` json
{
  "success": false,
  "error": "Your NGO must be verified before creating opportunities"
}
```

##### 401 Unauthorized

``` json
{
  "status": "failed",
  "message": "Error, Not authorized to access this route"
}
```

##### 403 Forbidden

``` json
{
  "status": "failed",
  "message": "Error, role volunteer is not authorized to access this route"
}
```

---

#### Notes

- Only authenticated NGO administrators can create opportunities.
    
- The authenticated NGO must be verified before creating opportunities.
    
- The opportunity is automatically linked to the NGO owned by the logged-in user.

---

### Browse opportunities

`GET` `{{baseUrl}}/opportunities`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### Get one opportunity

`GET` `{{baseUrl}}/opportunities/6`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### Update opportunity

`PUT` `{{baseUrl}}/opportunities/6`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

**Request Body**

```json
{
  "capacity": 20
}
```

---

### Publish opportunity

`PATCH` `{{baseUrl}}/opportunities/6/publish`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### Close opportunity

`PATCH` `{{baseUrl}}/opportunities/6/close`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### Delete opportunity

`DELETE` `{{baseUrl}}/opportunities/7`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### create opportunity for delete

`POST` `{{baseUrl}}/opportunities`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

**Request Body**

```json
{
  "title": "Community hall Cleanup Volunteer",
  "description": "Help clean up the local hall",
  "category": "Environment",
  "location": "Lagos",
  "date": "2026-08-15",
  "capacity": 40,
  "applicationDeadline": "2026-08-01",
  "requiredSkills": [
    "Teamwork"
  ],
  "duration": "1 Day",
  "timeCommitment": "4 hrs",
  "compensation": "Unpaid"
}
```

---

### Create opportunity for application

`POST` `{{baseUrl}}/opportunities`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

**Request Body**

```json
{
  "title": "Community venue Cleanup Volunteer",
  "description": "Help clean up the local venue",
  "category": "Environment",
  "location": "Lagos",
  "date": "2026-08-15",
  "capacity": 30,
  "applicationDeadline": "2026-08-01",
  "requiredSkills": [
    "Teamwork"
  ],
  "duration": "1 Day",
  "timeCommitment": "4 hrs",
  "compensation": "Unpaid"
}
```

---

### create opportunity for application withdrawal

`POST` `{{baseUrl}}/opportunities`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `{{bearer_token_0lrk}}` |

**Request Body**

```json
{
  "title": "Community Cleanup Volunteer work",
  "description": "Help clean up the community park",
  "category": "Environment",
  "location": "Lagos",
  "date": "2026-08-15",
  "capacity": 10,
  "applicationDeadline": "2026-08-01",
  "requiredSkills": [
    "Teamwork"
  ],
  "duration": "1 Day",
  "timeCommitment": "4 hrs",
  "compensation": "Unpaid"
}
```

---

## Application

### Submit application

`POST` `{{baseUrl}}/applications`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{json_web_token_0ntw}}` |

**Request Body**

```json
{
  "opportunityId": 8
}
```

---

### List applications

`GET` `{{baseUrl}}/applications`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `{{bearer_token_0lrk}}` |

---

### Accept applications

`PATCH` `{{baseUrl}}/applications/2/accept`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `{{bearer_token_0lrk}}` |

---

### New Request

`PATCH` `{{baseUrl}}/applications/2/reject`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `{{bearer_token_0lrk}}` |

---

### submit application for testing withdrawal

`POST` `{{baseUrl}}/applications`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{json_web_token_0ntw}}` |

**Request Body**

```json
{
  "opportunityId": 9
}
```

---

### Withdraw application

`PATCH` `{{baseUrl}}/applications/3/withdraw`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{json_web_token_0ntw}}` |

---

## Contribution

### Log hours

`POST` `{{baseUrl}}/contributions`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{json_web_token_0ntw}}` |

**Request Body**

```json
{
  "opportunityId": 8,
  "hoursLogged": 4.5,
  "evidence": "https://example.com/proof.jpg"
}
```

---

### List contributions

`GET` `{{baseUrl}}/contributions`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### verify contribution

`PATCH` `{{baseUrl}}/contributions/4/verify`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---

### reject contribution

`PATCH` `{{baseUrl}}/contributions/4/reject`

**Headers**

| Header | Value |
|---|---|
| `Authorization` | `Bearer {{supabase_service_role_api_key_11ug}}` |

---
