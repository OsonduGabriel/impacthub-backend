# ImpactHub Backend API — NGO, Opportunity, Application & Contribution

Base URL (local dev): `http://localhost:5000`

## Authentication
All endpoints below except `GET /opportunities` and `GET /opportunities/:id` require a Bearer token in the header:
```
Authorization: Bearer <token>
```
Get a token via Dev 1's endpoints: `POST /api/auth/v1/register` and `POST /api/auth/v1/login`.

## ⚠️ Response shape — two different formats exist right now
- **This module's endpoints** (NGO, Opportunity, Application, Contribution): `{ "success": true|false, "<resource>": {...} }` or `{ "success": false, "error": "message" }`
- **Auth endpoints** (Dev 1's): `{ "status": "success"|"failed", "data": {...} }`

Frontend devs: expect both shapes depending on which module you're calling. This is a known inconsistency, flagged to the team.

---

## NGO

### `POST /ngo` — Register NGO profile
**Auth:** NGO-admin
```json
{
  "name": "Green Future Foundation",
  "registrationNumber": "RC123456",
  "contactPerson": "Jane Doe",
  "email": "jane@greenfuture.org",
  "phone": "08012345678",
  "address": "12 Unity Road, Lagos"
}
```
Returns the created NGO with `"verificationStatus": "pending"`.

### `GET /ngo` — Get own NGO profile
**Auth:** NGO-admin

### `PUT /ngo` — Update own NGO profile
**Auth:** NGO-admin
Body: any subset of the fields from register.

### `POST /ngo/verify` — Approve or reject an NGO
**Auth:** platform-admin
```json
{ "ngoId": 1, "decision": "approved" }
```
`decision` is `"approved"` or `"rejected"`.

---

## Opportunity

### `POST /opportunities` — Create an opportunity
**Auth:** NGO-admin (NGO must be `verificationStatus: "approved"` first)
```json
{
  "title": "Community Cleanup Volunteer",
  "description": "Help clean up the local park",
  "category": "Environment",
  "location": "Lagos",
  "date": "2026-08-15",
  "capacity": 10,
  "applicationDeadline": "2026-08-01",
  "requiredSkills": ["Teamwork"],
  "duration": "1 Day",
  "timeCommitment": "4 hrs",
  "compensation": "Unpaid"
}
```
Created with `"status": "draft"`.

### `GET /opportunities` — Browse opportunities
**Auth:** none (public). Only returns `status: "published"` opportunities.
Query params: `?category=Environment&location=Lagos`

### `GET /opportunities/:id` — Get one opportunity
**Auth:** none (public). Response includes the full NGO object nested inside.

### `PUT /opportunities/:id` — Update
**Auth:** NGO-admin, owner only

### `DELETE /opportunities/:id` — Delete
**Auth:** NGO-admin, owner only. Only works on `status: "draft"` opportunities.

### `PATCH /opportunities/:id/publish` — Publish
**Auth:** NGO-admin, owner only

### `PATCH /opportunities/:id/close` — Close
**Auth:** NGO-admin, owner only

### `PATCH /opportunities/:id/archive` — Archive
**Auth:** NGO-admin, owner only
*(Written but not independently re-confirmed working in the final test pass — verify before relying on it.)*

---

## Application

### `POST /applications` — Apply to an opportunity
**Auth:** volunteer
```json
{ "opportunityId": 1 }
```
One application per volunteer per opportunity — duplicates are rejected.

### `GET /applications` — List applications to your NGO's opportunities
**Auth:** NGO-admin
Query param (optional): `?opportunityId=1`

### `PATCH /applications/:id/accept` — Accept an application
**Auth:** NGO-admin, only for applications to your own NGO's opportunities

### `PATCH /applications/:id/reject` — Reject an application
**Auth:** NGO-admin, same restriction as above

### `PATCH /applications/:id/withdraw` — Withdraw your own application
**Auth:** volunteer, own application only. Blocked once already accepted.

---

## Contribution

### `POST /contributions` — Log volunteer hours
**Auth:** volunteer
```json
{
  "opportunityId": 1,
  "hoursLogged": 4.5,
  "evidence": "https://example.com/proof.jpg"
}
```
Note: `evidence` is a URL/text field, not a file upload endpoint.

### `GET /contributions` — List contributions to your NGO's opportunities
**Auth:** NGO-admin
Query param (optional): `?opportunityId=1`

### `PATCH /contributions/:id/verify` — Verify a contribution
**Auth:** NGO-admin, own NGO's opportunities only

### `PATCH /contributions/:id/reject` — Reject a contribution
**Auth:** NGO-admin, same restriction

---

## Data types to know
- All IDs (`ngo.id`, `opportunity.id`, `application.id`, `contribution.id`) are integers.
- `volunteerId` (inside Application/Contribution records) is a **UUID string**, since it references the User table.
