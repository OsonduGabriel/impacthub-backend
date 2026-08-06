# ImpactHub API Data Models

This document describes the structure of the resources returned by the ImpactHub API.

---

# User

Represents every authenticated user in the system.

```ts
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

# Platform Admin

A Platform Admin is a registered user with platform management privileges.

```ts
interface PlatformAdmin {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}
```

---

# NGO Admin

A registered user responsible for managing one NGO.

```ts
interface NGOAdmin {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}
```

---

# Volunteer

Represents a volunteer profile.

```ts
interface Volunteer {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;

  profTitle: string | null;
  state: string | null;
  country: string | null;
  about: string | null;
  experience: string | null;

  skills: string[];

  avatarUrl: string | null;
  websiteUrl: string | null;
  cvUrl: string | null;

  createdAt: string;
  updatedAt: string;
}
```

---

# NGO

Represents a Non-Governmental Organization.

```ts
interface NGO {
  id: number;

  name: string;

  registrationNumber: string;

  contactPerson: string;

  email: string;

  phone: string;

  address: string;

  verificationStatus:
      | "pending"
      | "approved"
      | "rejected";

  verificationDocuments: string | null;

  userId: string;

  createdAt: string;
  updatedAt: string;
}
```

---

# Opportunity

Volunteer opportunity created by an NGO.

```ts
interface Opportunity {

  id: number;

  ngoId: number;

  title: string;

  description: string;

  category: string;

  location: string;

  date: string;

  capacity: number;

  applicationDeadline: string;

  requiredSkills: string[];

  duration: string;

  timeCommitment: string;

  compensation: string;

  status:
      | "draft"
      | "published"
      | "closed";

  createdAt: string;
  updatedAt: string;
}
```

---

# Application

Volunteer application for an opportunity.

```ts
interface Application {

  id: number;

  volunteerId: string;

  opportunityId: number;

  status:
      | "pending"
      | "approved"
      | "rejected";

  createdAt: string;
  updatedAt: string;
}
```

---

# Contribution

Volunteer work completed after approval.

```ts
interface Contribution {

  id: number;

  volunteerId: string;

  opportunityId: number;

  hoursWorked: number;

  description: string;

  contributionDate: string;

  createdAt: string;
}
```

---

# Certificate

Certificate awarded to volunteers.

```ts
interface Certificate {

  id: number;

  volunteerId: string;

  contributionId: number;

  certificateNumber: string;

  pdfUrl: string;

  qrCodeUrl: string;

  issuedAt: string;
}
```

---

# Relationships

```
User
│
├──────────────┐
│              │
│              │
▼              ▼
PlatformAdmin  NGOAdmin
                    │
                    │
                    ▼
                  NGO
                    │
                    ▼
              Opportunity
                    │
                    ▼
               Application
                    ▲
                    │
               Volunteer
                    │
                    ▼
              Contribution
                    │
                    ▼
               Certificate
```

---

# Workflow

```
User
    │
    ├── Register
    │
    ├── Become Volunteer
    │
    ├── Become NGO Admin
    │
    └── Become Platform Admin

Platform Admin
        │
        └── Approves NGO

NGO Admin
        │
        ├── Creates Opportunity
        └── Publishes Opportunity

Volunteer
        │
        ├── Views Opportunities
        ├── Applies
        ├── Gets Approved
        ├── Makes Contributions
        └── Receives Certificate
```

---

# Authentication

Protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

Tokens should always be obtained from the **Login** endpoint after role assignment.