# Impacthub Application-backend

ImpactHub is a backend platform that connects volunteers with NGOs (non-governmental organizations) and helps track the real-world impact of volunteer work. Volunteers can browse and apply for opportunities posted by verified NGOs, log the hours they contribute, and build a verifiable Impact Profile they can share with others. NGOs can post opportunities, review and manage applications, and verify volunteer contributions. Once a contribution is verified, the platform can generate a shareable digital certificate as proof of the volunteer's work.

# Features

## Base URL

```text
https://impacthub-backend-production-2d9e.up.railway.app/api/v1
```

---

## User Roles & Permissions

The platform supports three distinct user roles:

- **Volunteer**: Registers, browses opportunities, applies, logs hours, and builds an Impact Profile.
- **NGO Administrator (`NGO-admin`)**: Registers and manages an NGO profile, posts opportunities, reviews applications, and verifies volunteer contributions.
- **Platform Administrator (`platform-admin`)**: Verifies/approves NGO registrations and oversees the platform.

---

## Authentication & Access

The backend is a RESTful JSON API secured with **JWT (JSON Web Token)** authentication.

- Protected endpoints require an `Authorization: Bearer <token>` header.
- Access to specific actions is restricted based on the user's assigned role (`Volunteer`, `NGO-admin`, or `platform-admin`).
- It also makes use of Nodemailer for access reset.

---

## Pre-requirement

- Node.js (v16.x or later)
- PostgreSQL (v13 or later)
- redis server/database
- Git
- A code editor (VS Code recommended)

# Installation

- Clone the repository

```bash
- Git clone https://github.com/your-org/impacthub.git
- npm install
```

- create a .env file using the .env.example and fill out the parameters.
- run the application

```bash
- npm run dev
```

# Project Structure

```
├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── models/ # Database models (User, NGO, Opportunity, etc.)
│ │ ├── routes/ # API endpoints
│ │ ├── middleware/ # Auth, validation, error handling
│ │ ├── services/ # Business logic (certificate generation, etc.)
│ │ └── utils/ # Helpers (QR, email, etc.)
│ ├── migrations/ # Database migrations
│ ├── tests/ # Unit and integration tests
│ |
│ └── package.json
|
├── uploads/
| ├── avatars/
| └── documents/
|
├── .gitignore
├── .env # Environment variables
├── README.md
├── package-lock.json
└── package.json
```

## API Endpoints Reference

### Authentication Module

| Method | Endpoint                      | Description                                              |
| :----- | :---------------------------- | :------------------------------------------------------- |
| `POST` | `/auth/register`              | Register a new user account                              |
| `POST` | `/auth/forgot-password`       | Request a password reset OTP via email                   |
| `POST` | `/auth/login`                 | Authenticate a user and return a JWT                     |
| `POST` | `/auth/reset-password/:token` | Reset password using a valid reset token                 |
| `POST` | `/auth/change-password`       | Change password for the authenticated user               |
| `POST` | `/auth/register-admin`        | Promote the authenticated user to Platform Administrator |
| `POST` | `/auth/register-ngo-admin`    | Promote the authenticated user to NGO Administrator      |
| `POST` | `/auth/logout`                | Log out the authenticated user by blacklisting the JWT   |

---

#### Examples:

- POST /auth/register

```bash
  {
  "firstname": "Mary",
  "lastname": "Johnson",
  "email": "mary@example.com",
  "password": "Password123!",
  "phone": "+237687123456"
  }
```

success returns user details + token.

- /auth/forgot-password

```bash
  {
  "email": "testvolunteer01@example.com"
  }
```

no authenication required, an email would be sent with OTP details

- /auth/login

```bash
  {
  "email": "testvolunteer01@example.com",
  "password": "Test@1234"
  }
```

no authenication required

- /auth/reset-password/:token
  /auth/reset-password/663084

  ```bash
  {
  "password": "NewPassword@123"
  }
  ```

  no authenication required
  - /auth/change-password

  ```bash
    {
    "oldPassword": "OldPassword@123",
    "newPassword": "NewPassword@123"
    }
  ```

  authorization token needed.

- /auth/register-admin.
  authorization token from registration needed. No request Body

- /auth/register-ngo-admin
  authorization token from registration needed. No request Body

- /auth/logout
  authorization token from login needed. No request Body. token is blacklisted.

### Volunteer Module

| Method   | Endpoint              | Description                                    |
| :------- | :-------------------- | :--------------------------------------------- |
| `POST`   | `/volunteer/register` | Register the authenticated user as a volunteer |
| `PUT`    | `/volunteer/update`   | Update volunteer profile.                      |
| `GET`    | `/volunteer`          | Gets the Volunteer profile of the current user |
| `DELETE` | `/volunteer/delete`   | Deletes the volunteer's profile                |
| `GET`    | `/volunteers`         | Gets a list of all the registered volunteers   |

#### Examples

- /volunteer/register
  authorization token from registration needed. No request Body

- /auth/volunteer/update

```bash
  {
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "98765432-b12c-34d5-e678-987654321000",
  "prof_title": "Senior Software Engineer",
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0199",
  "state": "California",
  "country": "United States",
  "skills": [
  "JavaScript",
  "Node.js",
  "PostgreSQL",
  "Project Management"
  ],
  "about": "Passionate software engineer with over 5 years of experience looking to contribute to open-source community projects.",
  "experience": "Lead developer at TechCorp for 3 years, managing a team of 5 engineers. Managed multiple volunteer initiatives for non-profits.",
  "avatar_url": "https://example.com/avatars/janedoe.jpg",
  "website_url": "https://janedoe.dev",
  "cv_url": "https://example.com/cvs/janedoe_resume.pdf",
  "created_at": "2026-08-06T09:52:00.000Z",
  "updated_at": "2026-08-06T09:52:00.000Z"
  }
```

     authorization token from login needed. All or any of the above fields can be updated.

- /auth/volunteer
  authorization token from login needed.

- /volunteer/delete
  authorization token from login needed.

- /volunteers
  authorization token from login needed.

## User Module

| Method   | Endpoint                 | Description                                           |
| :------- | :----------------------- | :---------------------------------------------------- |
| `POST`   | `/users/create-user`     | Registers a user account.Platform-admin authorized    |
| `PUT`    | `/users/update-user/:id` | Update user account profile.Platform-admin authorized |
| `GET`    | `/users/all-users`       | Gets a list of all users. Platform-admin authorized   |
| `DELETE` | `/users/delete-user/:id` | Deletes the user.Platform-admin authorized            |
| `GET`    | `/users/user/:id`        | Gets one user.Platform-admin authorized               |

#### Examples

- /users/create-user

```bash
{
    "firstname": "Lilian",
    "lastname": "James",
    "email": "lilian@gmail.com",
    "phone": "08064071111",
    "password": "@Lilianismyname11",
    "role": "volunteer"
}
```

authorization token from login needed.

- /users/update-user/:id
  /users/update-user/whekfbjjfndfsjhdn

  ```bash
  {
  "id": "98765432-b12c-34d5-e678-987654321000",
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0199",
  "role": "volunteer",
  "isActive": true,
  }
  ```

  authorization token from login needed.

- /users/all-users
  authorization token from login needed.

- /users/delete-user/:id
  /users/delete-user/whekfbjjfndfsjhdn
  authorization token from login needed.

- /users/user/:id
  /users/user/whekfbjjfndfsjhdn
  authorization token from login needed.

### Certification Module

| Method | Endpoint                    | Description                                                |
| :----- | :-------------------------- | :--------------------------------------------------------- |
| `POST` | `/certification/register`   | creates a new certification for volunteer (volunteer only) |
| `PUT`  | `/certification/update/:id` | updates certification for volunteer (volunteer only)       |
| `GET`  | `/certification/`           | Get the NGO profile of the authenticated NGO Administrator |
| `PUT`  | `/certification/`           | Update the authenticated NGO Administrator's NGO profile   |

### NGO Module

| Method | Endpoint       | Description                                                      |
| :----- | :------------- | :--------------------------------------------------------------- |
| `POST` | `/ngos`        | Create a new NGO profile for the authenticated NGO Administrator |
| `POST` | `/ngos/verify` | Approve or reject an NGO registration (platform-admin only)      |
| `GET`  | `/ngo`         | Get the NGO profile of the authenticated NGO Administrator       |
| `PUT`  | `/ngos`        | Update the authenticated NGO Administrator's NGO profile         |

---

### Opportunity Module

| Method   | Endpoint                     | Description                                                |
| :------- | :--------------------------- | :--------------------------------------------------------- |
| `POST`   | `/opportunities`             | Create a new volunteer opportunity under the NGO           |
| `GET`    | `/opportunities`             | Browse/list all volunteer opportunities                    |
| `GET`    | `/opportunities/:id`         | Get details of a single opportunity                        |
| `PUT`    | `/opportunities/:id`         | Update an existing opportunity                             |
| `PATCH`  | `/opportunities/:id/publish` | Publish an opportunity so it becomes visible to volunteers |
| `PATCH`  | `/opportunities/:id/close`   | Close an opportunity to new applications                   |
| `DELETE` | `/opportunities/:id`         | Delete an opportunity                                      |

---

### Application Module

| Method  | Endpoint                     | Description                            |
| :------ | :--------------------------- | :------------------------------------- |
| `POST`  | `/applications`              | Apply for an opportunity               |
| `GET`   | `/applications`              | Get logged-in volunteer's applications |
| `PATCH` | `/applications/:id/withdraw` | Withdraw an application                |
| `PATCH` | `/applications/:id/accept`   | NGO accepts a volunteer's application  |
| `PATCH` | `/applications/:id/reject`   | NGO rejects a volunteer's application  |

---

### Contribution Module

| Method  | Endpoint                    | Description                       |
| :------ | :-------------------------- | :-------------------------------- |
| `POST`  | `/contributions`            | Log volunteer contribution        |
| `GET`   | `/contributions`            | List/get contributions (NGO view) |
| `PATCH` | `/contributions/:id/verify` | NGO verifies a contribution       |
| `PATCH` | `/contributions/:id/reject` | NGO rejects a contribution        |

---

### Certificate Module

| Method  | Endpoint                              | Description                                            |
| :------ | :------------------------------------ | :----------------------------------------------------- |
| `POST`  | `/certificates`                       | Generate a certificate after contribution verification |
| `GET`   | `/certificates`                       | Get all certificates                                   |
| `GET`   | `/certificates/:id`                   | Get a single certificate by database ID                |
| `GET`   | `/certificates/verify/:certificateId` | Verify certificate authenticity using Certificate ID   |
| `GET`   | `/certificates/:id/download`          | Download generated certificate PDF                     |
| `PATCH` | `/certificates/:id/download`          | Mark certificate as downloaded                         |
| `PATCH` | `/certificates/:id/archive`           | Archive a certificate                                  |

---

### Impact Profile Module

| Method | Endpoint                             | Description                              |
| :----- | :----------------------------------- | :--------------------------------------- |
| `GET`  | `/impact-profile`                    | Get logged-in volunteer's Impact Profile |
| `GET`  | `/impact-profile/share`              | Generate a secure shareable link         |
| `GET`  | `/impact-profile/shared/:shareToken` | View a shared Impact Profile using token |

---

### Notification Module

| Method   | Endpoint                  | Description                                  |
| :------- | :------------------------ | :------------------------------------------- |
| `GET`    | `/notifications`          | Get all notifications for the logged-in user |
| `PATCH`  | `/notifications/:id/read` | Mark a notification as read                  |
| `PATCH`  | `/notifications/read-all` | Mark all notifications as read               |
| `DELETE` | `/notifications/:id`      | Delete a notification                        |

---

### Reporting Module

| Method | Endpoint                  | Description                  |
| :----- | :------------------------ | :--------------------------- |
| `GET`  | `/dashboard`              | Dashboard summary statistics |
| `GET`  | `/reports`                | Get NGO reports              |
| `GET`  | `/reports/volunteers`     | Volunteer statistics         |
| `GET`  | `/reports/opportunities`  | Opportunity statistics       |
| `GET`  | `/reports/contributions`  | Contribution summary         |
| `GET`  | `/reports/verified-hours` | Verified volunteer hours     |

```

```
