# ReliefLanka
### Disaster & Flood Assistance Tracker — Project Overview

---

## 1. Problem Statement

Sri Lanka experiences recurring seasonal flooding and disaster events that leave affected families needing fast access to emergency assistance, while relief organizations and volunteers struggle to coordinate requests, donation drop-off points, field volunteers, and supply stock across scattered spreadsheets, phone calls, and WhatsApp groups. During the critical first 72 hours, this lack of a shared, real-time system leads to duplicated effort, mismatched supply and demand (e.g., a district flooded with rice donations while medicine runs out), and volunteers being deployed inefficiently.

**ReliefLanka** is a centralized MERN-stack web platform that connects four core disaster-response functions — assistance requests, donation collection centers, volunteer coordination, and inventory tracking — into one system, organized by district so relief effort can be matched to actual need.

## 2. Project Objectives

- Give affected individuals a simple way to submit and track relief requests.
- Give donors and the public a searchable directory of active drop-off centers.
- Let volunteers register their skills and availability, and let coordinators see who's deployable where.
- Give relief coordinators real-time visibility into what supplies exist and where, so stock can be matched to requests.
- Organize all four modules around **District** as the common thread, since relief coordination in Sri Lanka is fundamentally geographic.

## 3. Scope

**In scope (this phase)**
- Four independent CRUD modules, each with its own frontend component, Express API, and Mongoose model.
- District-based filtering/search across all modules.
- Status workflows (e.g., request Pending → Fulfilled; volunteer Available → Deployed).
- A shared public landing page / dashboard that surfaces summary stats from all four modules.

**Out of scope (future phase — noted here so the team doesn't scope-creep mid-sprint)**
- Authentication/role-based access control (admin vs. public).
- Automatic matching of requests to inventory stock.
- SMS/push notifications.
- Map-based visualization (Leaflet/Google Maps).

These are listed under Section 8 as recommended next-phase enhancements — worth flagging to your supervisor as "future work" in your report even if not built.

## 4. Tech Stack (MERN)

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Styling | Tailwind CSS (or plain CSS modules — pick one, stay consistent across all 4 members) |
| Backend | Node.js + Express.js |
| Database | MongoDB (Atlas, cloud-hosted) via Mongoose ODM |
| Form handling | react-hook-form (optional but keeps validation consistent across 4 different forms) |
| Backend validation | express-validator or Zod |
| Dev tools | Nodemon, dotenv, Postman/Thunder Client for API testing |
| Deployment | Frontend → Vercel/Netlify · Backend → Render/Railway · DB → MongoDB Atlas |

## 5. High-Level Architecture

```
                        ┌───────────────────────────┐
                        │   React Frontend (SPA)    │
                        │  4 route-based modules:   │
                        │  /requests /centers        │
                        │  /volunteers /inventory    │
                        └─────────────┬─────────────┘
                                      │ Axios (REST, JSON)
                        ┌─────────────▼─────────────┐
                        │   Express.js REST API      │
                        │  /api/requests             │
                        │  /api/centers               │
                        │  /api/volunteers            │
                        │  /api/inventory             │
                        └─────────────┬─────────────┘
                                      │ Mongoose
                        ┌─────────────▼─────────────┐
                        │      MongoDB Atlas          │
                        │  Request / Center /         │
                        │  Volunteer / Inventory      │
                        │  collections                │
                        └───────────────────────────┘
```

Each member owns one vertical slice (component → route → model) end-to-end, but all four slices share the same Express app instance and the same React app shell — see Section 7 for how to structure the repo so ownership stays clean without four disconnected apps.

## 6. Module Breakdown

| # | Module | Owner Focus | Model | API Base |
|---|---|---|---|---|
| 1 | **Relief Requests** | Submit & manage emergency assistance requests | `Request.js` | `/api/requests` |
| 2 | **Drop-off Collection Centers** | Register & browse donation hubs | `Center.js` | `/api/centers` |
| 3 | **Volunteer Registration** | Sign up & manage field responders | `Volunteer.js` | `/api/volunteers` |
| 4 | **Resource & Inventory** | Log & track relief stock | `Inventory.js` | `/api/inventory` |

### 6.1 Relief Requests — suggested schema
```js
{
  name: String,
  district: String,       // use shared DISTRICTS enum — see 8.1
  contactPhone: String,
  itemsNeeded: [String],
  urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Fulfilled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
}
```

### 6.2 Drop-off Collection Centers — suggested schema
```js
{
  centerName: String,
  district: String,
  contactPerson: String,
  contactPhone: String,
  capacity: Number,
  operatingHours: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 6.3 Volunteer Registration — suggested schema
```js
{
  name: String,
  phone: String,
  preferredDistrict: String,
  skills: [{ type: String, enum: ["Medical", "Transport", "Logistics", "Cooking", "General"] }],
  availability: { type: String, enum: ["Available", "Deployed"], default: "Available" },
  createdAt: { type: Date, default: Date.now }
}
```

### 6.4 Resource & Inventory — suggested schema
```js
{
  itemName: String,
  category: { type: String, enum: ["Water", "Food", "Medicine", "Clothing", "Other"] },
  quantity: Number,
  unit: String,             // e.g., "liters", "kg", "boxes"
  storageLocation: String,
  district: String,
  loggedAt: { type: Date, default: Date.now }
}
```

## 7. Repo Structure (monorepo, shared by all 4 members)

```
ReliefLanka/
├── client/                       # React app
│   └── src/
│       ├── components/
│       │   ├── shared/           # Navbar, Footer, DistrictSelect, StatusBadge
│       │   ├── requests/         # Member 1
│       │   ├── centers/          # Member 2
│       │   ├── volunteers/       # Member 3
│       │   └── inventory/        # Member 4
│       ├── pages/
│       │   ├── Home.jsx          # aggregated dashboard (see 8.2)
│       │   ├── RequestsPage.jsx
│       │   ├── CentersPage.jsx
│       │   ├── VolunteersPage.jsx
│       │   └── InventoryPage.jsx
│       └── services/             # api.js — one axios file per module
├── server/
│   ├── models/
│   │   ├── Request.js
│   │   ├── Center.js
│   │   ├── Volunteer.js
│   │   └── Inventory.js
│   ├── routes/
│   │   ├── requests.js
│   │   ├── centers.js
│   │   ├── volunteers.js
│   │   └── inventory.js
│   ├── constants/
│   │   └── districts.js          # shared list of Sri Lankan districts
│   └── server.js
└── README.md
```

Keeping components under `client/src/components/<module>/` and routes under `server/routes/<module>.js` means each member's commits touch a clearly separate folder — clean for the rubric — while `Home.jsx` and `server.js` are the two shared files that tie the four modules into one product.

## 8. Fine-Tuning the Original Idea

The original 4-module split is solid and graded well for "distinct ownership." Two small additions make it read as one cohesive product instead of four unrelated CRUD apps, without adding real scope:

### 8.1 Share the District list
All four models use `district`. Hardcode it once in `server/constants/districts.js` (the 25 Sri Lankan districts) and import it into every model's enum and every frontend dropdown. Five minutes of setup, and it keeps filtering/search consistent across all four modules — plus it's an easy thing to point to in your report as evidence the team planned the data model together.

### 8.2 Add one shared landing dashboard
A single `Home.jsx` that pulls a lightweight count from each of the four APIs (`GET /api/requests/count`, etc.) and displays it as a stat row — "42 Pending Requests · 12 Active Centers · 87 Volunteers · 6 Districts Stocked." This is the one piece of "integration" work that isn't any single member's module, so it's worth assigning to whoever finishes their own CRUD first, or building together in the last session before submission.

### 8.3 Suggested next-phase features (mention as future work, don't build now)
- Simple admin login (JWT) to gate Update/Delete actions.
- Auto-suggest matching: when viewing a request, show inventory items in the same district.
- Map view of centers and requests using Leaflet + OpenStreetMap (free, no API key).

## 9. Git & Collaboration Workflow

- `main` branch stays deployable at all times.
- Each member works on their own feature branch: `feature/relief-requests`, `feature/centers`, `feature/volunteers`, `feature/inventory`.
- Commit small and often within your own folder (e.g., `feat(requests): add district filter to GET /api/requests`) — this is what the rubric's "commit history" check is actually looking for.
- Open a Pull Request into `main` when your module's CRUD is complete; at least one teammate reviews before merge.
- Avoid two members editing `server.js` or `App.jsx` at the same time — route registration and page routing are the two files everyone touches, so agree on who adds the wiring for `Home.jsx` and merge that first.

## 10. Suggested Milestones

1. Repo scaffold, shared `districts.js`, base Express + MongoDB Atlas connection — whole team, day 1.
2. Each member builds their model + CRUD routes, tests with Postman.
3. Each member builds their frontend form + list/filter view, wired to their own API.
4. Merge all branches into `main`; build `Home.jsx` dashboard together.
5. Deploy: backend to Render, frontend to Vercel, connect env vars.
6. Final walkthrough + report/demo prep.
