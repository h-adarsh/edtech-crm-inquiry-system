# EduConnect — EdTech CRM & Public Inquiry System

A full-stack EdTech CRM and inquiry management system built for educational institutions. Allows prospective parents, students, and schools to submit inquiries across multiple categories, and provides administrative staff with a protected, real-time dashboard featuring custom JWT authentication, multi-criteria filtering, live debounced search, and status lifecycle management.

---

## Live Links & Demo

- **Frontend (Vercel):** `https://edtech-crm.vercel.app` *(Replace with deployed URL)*
- **Backend API (Render):** `https://edtech-crm-api.onrender.com` *(Replace with deployed URL)*
- **GitHub Repository:** Clean monorepo containing `frontend/` and `backend/`

> [!NOTE]
> **Render Cold Start Notice:**
> The backend is deployed on Render's free tier. If the instance is sleeping, the first request may take 30 to 60 seconds to spin up. Subsequent requests are instant.

### Demo Admin Credentials for Evaluator
- **Email:** `admin@edtech.com`
- **Password:** `AdminPassword123!`

*(The Admin Login UI includes a one-click auto-fill button for convenient testing).*

---

## Features

- **Public Inquiry Form:**
  - Responsive, mobile-first design with interactive validation.
  - Dropdowns for **User Type** (`Parent`, `Student`, `School`) and **Category** (`Scholarship`, `Concert`, `Admission`, `General Query`).
  - Real-time client and server validation on Name, Email, Phone, and Message.
  - Submissions persist directly into Supabase PostgreSQL database.
  - Rate-limited to prevent automated spam (20 submissions / 15 minutes per IP).
- **Custom JWT Authentication (Built from Scratch):**
  - **No Supabase Auth used** (strictly complies with task requirements).
  - Passwords hashed using `bcryptjs` with salt rounds = 10.
  - Cryptographic token signing and verification with `jsonwebtoken`.
  - Custom `requireAuth` middleware enforcing `Authorization: Bearer <token>` headers.
  - Login endpoint rate-limited to 10 attempts per 15 minutes to thwart brute-force attacks.
- **Admin CRM Dashboard:**
  - Protected route guarding dashboard access (`/dashboard`).
  - Tabular view listing submitted inquiries with full contact details and timestamps.
  - **Filter by Category** (`Scholarship`, `Concert`, `Admission`, `General Query`).
  - **Filter by User Type** (`Parent`, `Student`, `School`).
  - **Live Search bar** matching candidate **Name** or **Phone number** (debounced 300ms).
  - Multi-filter compounding (Category + User Type + Search term at the same time).
  - Status management: update inquiry status directly between `new`, `in_progress`, and `resolved`.
  - Pagination support with custom page sizes and page numbers.

---

## Tech Stack & Architectural Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 (Vite) + React Router v6 | Ultra-fast client-side SPA bundling, predictable routing, zero SSR complexity. |
| **Styling** | Tailwind CSS + Lucide Icons | Clean, responsive, and modern edtech aesthetic with accessible design tokens. |
| **Backend** | Node.js + Express 4.x | Standard lightweight REST API architecture with modular controllers and routes. |
| **Database** | Supabase (PostgreSQL) via `pg` | Native `node-postgres` connection pool via Supabase Pooler URL (`ssl: { rejectUnauthorized: false }`). |
| **Auth** | Custom JWT (`bcryptjs` + `jsonwebtoken`) | Independent custom authentication; avoids third-party auth lock-in and complies with assessment rules. |
| **Validation** | Zod | Declarative, schema-driven input validation on both request bodies and query parameters. |
| **Security** | Helmet + CORS + Express Rate Limit | Hardened HTTP headers, explicit origin whitelisting, and brute-force mitigation. |

---

## Project Structure

```text
.
├── backend/
│   ├── scripts/
│   │   ├── seedAdmin.js          # CLI script to seed default admin
│   │   └── seedDemoInquiries.js  # CLI script to seed 8 demo inquiries
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # pg connection pool & query runner
│   │   │   └── env.js            # Environment validation & fail-fast loading
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── inquiries.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js           # requireAuth JWT Bearer middleware
│   │   │   ├── errorHandler.js   # Centralized error handler
│   │   │   ├── rateLimiter.js    # Rate limits for login & public form
│   │   │   └── validate.js       # Zod schema validation middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── health.routes.js
│   │   │   └── inquiries.routes.js
│   │   ├── schemas/
│   │   │   ├── auth.schema.js
│   │   │   └── inquiry.schema.js
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── tests/
│   │   ├── auth.test.js          # Custom JWT & auth test suite
│   │   ├── inquiries.test.js     # Public & Admin inquiry test suite
│   │   └── setup.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # API client with token injection & 401 handling
│   │   ├── components/
│   │   │   ├── Filters.jsx       # Category, user type & search controls
│   │   │   ├── InquiryTable.jsx  # Inquiry list with modal view & status update
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Pagination.jsx    # Pagination buttons & count
│   │   │   ├── ProtectedRoute.jsx# Auth guard wrapper
│   │   │   └── StatusBadge.jsx   # Styled status chips
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx    # Admin login page
│   │   │   ├── Dashboard.jsx     # CRM inquiries dashboard
│   │   │   └── InquiryForm.jsx   # Public inquiry submission form
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vercel.json               # SPA routing rewrite rule
│   ├── .env.example
│   └── package.json
├── schema.sql                    # SQL DDL script for PostgreSQL
├── .env.example                  # Root environment template
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js:** v18.0.0 or higher (Tested on v24)
- **npm:** v9.0.0 or higher
- **PostgreSQL Database:** A free Supabase project (or any standard PostgreSQL instance)

---

## Local Setup (Step-by-Step)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/edtech-crm.git
cd edtech-crm
```

### Step 2: Set up Database in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Navigate to the **SQL Editor** tab.
3. Open `schema.sql` from this repository, paste the queries into the SQL Editor, and click **Run**.
4. Go to **Project Settings** → **Database** → **Connection string** → **Pooler** (Transaction or Session mode). Copy the connection URI string.

### Step 3: Configure Backend Environment
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and fill in your values:
```env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
JWT_SECRET=replace_this_with_a_secure_random_string_32_characters_minimum
JWT_EXPIRES_IN=8h
PORT=5050
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Install Backend Dependencies & Seed Admin
```bash
npm install
npm run seed:admin
```
*(This creates the default administrator `admin@edtech.com` with password `AdminPassword123!`)*

### Step 5: Start Backend Server
```bash
npm run dev
```
The backend API starts on `http://localhost:5050`. You can verify health at `http://localhost:5050/api/health`.

### Step 6: Configure and Start Frontend
In a separate terminal window:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `DATABASE_URL` | Supabase Postgres Pooler URI | `postgresql://postgres.xxx:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | `b49f982d9a3b...` |
| `JWT_EXPIRES_IN` | JWT token validity lifespan | `8h` |
| `PORT` | Local port for Express API | `5050` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `FRONTEND_URL` | Allowed client origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Base API URL | `http://localhost:5050/api` |

---

## How to Test the Custom JWT Authentication (with cURL)

The backend implements custom JWT authentication completely from scratch (`bcryptjs` hashing + `jsonwebtoken` verification + `requireAuth` middleware).

### 1. Authenticate as Admin & Obtain Token
```bash
curl -i -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@edtech.com",
    "password": "AdminPassword123!"
  }'
```
**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "e30e7166-...",
    "email": "admin@edtech.com",
    "name": "System Administrator"
  }
}
```
*(Note: `password_hash` is never exposed).*

---

### 2. Request Protected Inquiries Route with NO Token
```bash
curl -i -X GET http://localhost:5050/api/inquiries
```
**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication required. No token provided."
}
```

---

### 3. Request Protected Route with TAMPERED or INVALID Token
```bash
curl -i -X GET http://localhost:5050/api/inquiries \
  -H "Authorization: Bearer invalid_fake_token_12345"
```
**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or malformed authentication token."
}
```

---

### 4. Request Protected Route with VALID Bearer Token
Replace `<TOKEN>` with the token string received in step 1:
```bash
curl -i -X GET http://localhost:5050/api/inquiries \
  -H "Authorization: Bearer <TOKEN>"
```
**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 5. Submit Public Inquiry (No Token Needed)
```bash
curl -i -X POST http://localhost:5050/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "Parent",
    "category": "Scholarship",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 98765 43210",
    "message": "Inquiring regarding scholarship criteria for 9th grade."
  }'
```
**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Your inquiry has been submitted successfully...",
  "data": { ... }
}
```

---

## API Reference

| Method | Endpoint | Access | Description | Parameters / Body |
|---|---|---|---|---|
| `GET` | `/api/health` | Public | Server health status | None |
| `POST` | `/api/auth/login` | Public (Rate limited) | Admin login | `{ "email", "password" }` |
| `GET` | `/api/auth/me` | Admin | Get current admin details | Bearer Token |
| `POST` | `/api/inquiries` | Public (Rate limited) | Submit new public inquiry | `{ "user_type", "category", "name", "email", "phone", "message" }` |
| `GET` | `/api/inquiries` | Admin | Filter, search & paginate inquiries | `?category=...&user_type=...&status=...&search=...&page=1&limit=10` |
| `PATCH` | `/api/inquiries/:id/status` | Admin | Update inquiry status | `{ "status": "in_progress" \| "resolved" \| "new" }` |

---

## Security Highlights

1. **SQL Injection Defense:** All dynamic filters and searches are executed through strict parameterized statements (`$1`, `$2`, etc.). Search wildcards (`%search%`) are passed strictly as bound parameters.
2. **Password Hashing:** Passwords are never stored in plaintext. `bcryptjs` with standard salt rounds protects against rainbow table attacks.
3. **Generic Authentication Errors:** Both unknown emails and wrong passwords return the identical message (`"Invalid email or password"`) to eliminate user enumeration vectors.
4. **Rate Limiting:** Protects `/api/auth/login` (10 requests / 15 minutes) and `/api/inquiries` (20 requests / 15 minutes) from automated bots and brute force attacks.
5. **No Supabase Auth Bypass:** Architectural purity is preserved by keeping database management directly in SQL and authentication inside the Node.js service.

---

## Running Automated Tests

Run the complete Vitest test suite covering authentication, validation, filtering, status updates, and SQL injection safety:
```bash
cd backend
npm test
```

