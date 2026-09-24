# Support Ticket Management System

A full-stack, enterprise-grade Support Ticket Management Application built with **React**, **Node.js/Express**, **MySQL**, and **JWT Authentication**.

Designed and implemented following clean architecture standards for technical assessments.

---

## 🚀 Key Features

### 👤 Customer Capabilities
- **Account Registration & Login**: Public registration creates customer accounts securely using bcrypt password hashing.
- **Customer Dashboard**: View personal ticket queue, search by subject/description, filter by status or priority, and sort results.
- **Ticket Creation**: Raise tickets with custom subject, description, and priority level (`low`, `medium`, `high`).
- **Ticket Isolation**: Strict backend ownership checks ensure customers can never view or modify another customer's support tickets (returns `403 Forbidden`).
- **Real-Time Comments**: View responses from support agents and post follow-up comments.

### 🛡️ Support Agent Capabilities
- **Agent Dashboard & Statistics**: Real-time metrics overview displaying Total Tickets, Open Queue, In-Progress, Closed, and High Priority counts.
- **Queue Management**: View, search, filter, and sort all customer support tickets across the entire organization.
- **Ticket Status & Priority Management**: Update status (`open`, `in_progress`, `closed`) and priority level (`low`, `medium`, `high`).
- **Agent Ticket Assignment**: Assign unassigned tickets to specific support agents.
- **Agent Responses**: Post official support responses to customer tickets.
- **Role Protection**: Customer accounts attempting agent administrative actions are rejected with `403 Forbidden`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js 18, Vite, React Router v6, Axios, Vanilla CSS (Glassmorphism Dark Theme) |
| **Backend** | Node.js, Express.js (REST APIs) |
| **Database** | MySQL 5.5+ / 8.0+ (`mysql2/promise` pool driver) |
| **Authentication** | JSON Web Tokens (JWT), `bcrypt` password hashing |
| **Testing** | Jest, Supertest (39+ automated tests) |
| **API Testing** | Postman Collection v2.1 |

---

## 📂 Required Project Structure

```
support-ticket-system/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, ProtectedRoute, Badges, SearchBar, FilterControls, StatsCard
│   │   │   ├── tickets/        # TicketCard, TicketTable, TicketForm
│   │   │   └── comments/       # CommentList, CommentForm
│   │   ├── pages/              # Login, Register, CustomerDashboard, CreateTicket, TicketDetails, AgentDashboard, NotFound
│   │   ├── context/            # AuthContext (Global JWT state management)
│   │   ├── routes/             # AppRoutes
│   │   ├── services/           # api.js, authService, ticketService, commentService, userService
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Glassmorphism Design System
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── config/
│   │   └── database.js         # MySQL pool connection + resilient in-memory fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication check (WHO ARE YOU?)
│   │   ├── roleMiddleware.js    # Role authorization check (WHAT ARE YOU ALLOWED TO DO?)
│   │   ├── errorMiddleware.js   # Global error handling
│   │   └── validationMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── userRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── ticketService.js
│   │   ├── commentService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validators.js
│   ├── tests/                  # Jest automated test suites
│   ├── db.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── database/
│   ├── schema.sql              # MySQL DDL (users, tickets, ticket_comments, indexes)
│   └── seed.sql                # Initial test users & sample tickets
│
├── postman/
│   └── support-ticket-system.postman_collection.json
│
├── tests/
│   └── README.md
│
├── .gitignore
├── .env.example
├── README.md
└── docker-compose.yml
```

---

## 🔑 Pre-Configured Test Credentials

For quick evaluation, sample accounts are pre-seeded:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@example.com` | `password123` | Customer Dashboard (`/customer/dashboard`) |
| **Customer** | `alice@example.com` | `password123` | Customer Dashboard (`/customer/dashboard`) |
| **Support Agent** | `agent@example.com` | `password123` | Agent Portal & Stats (`/agent/dashboard`) |
| **Support Agent** | `bob.agent@example.com` | `password123` | Agent Portal & Stats (`/agent/dashboard`) |

---

## ⚡ Quick Start Guide

### 1. Database Setup (MySQL)
Run the SQL DDL schema and seed files against your MySQL instance:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (copied from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   The backend API will start on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

## 🧪 Automated Testing

The backend test suite contains **39 automated tests** covering:
- Customer Registration & Duplicate Email handling
- Authentication & JWT Token Verification
- Access Control: 401 Unauthorized for missing tokens
- Access Control: 403 Forbidden for customer accessing another customer's ticket
- Access Control: 403 Forbidden for customer accessing agent-only APIs
- Agent ticket status, priority, and assignment updates
- Comment posting and retrieval
- Health Check API status

To execute the test suite:
```bash
cd backend
npm test
```

---

## 📡 REST API Reference Summary

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | User authentication & JWT issue |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/tickets` | Authenticated | Fetch tickets (Customer: own only; Agent: all) |
| `POST` | `/api/tickets` | Customer | Create support ticket |
| `GET` | `/api/tickets/:id` | Authorized User | View ticket details (Ownership enforced) |
| `PUT` | `/api/tickets/:id` | Agent | Update ticket status, priority, assignment |
| `DELETE` | `/api/tickets/:id` | Authorized User | Delete ticket |
| `GET` | `/api/tickets/:id/comments` | Authorized User | Fetch ticket comments |
| `POST` | `/api/tickets/:id/comments` | Authorized User | Add comment response to ticket |
| `GET` | `/api/users` | Agent Only | Fetch agents list for assignment dropdown |
| `GET` | `/api/tickets/stats` | Agent Only | Retrieve ticket counts for dashboard cards |
| `GET` | `/api/health` | Public | API Health check endpoint |

---

## 🔗 Required SQL JOIN Query

The application implements the explicit JOIN query required by the assessment brief:

```sql
SELECT tickets.id, 
       tickets.subject, 
       tickets.status, 
       users.name AS customer_name, 
       users.email 
FROM tickets 
JOIN users ON tickets.user_id = users.id 
WHERE tickets.status = 'open';
```
*Tested via `GET /api/tickets?openWithCustomer=true`.*

---

## 🌐 Deployment Instructions

### Deployment Architecture
- **Database**: Cloud MySQL (Railway / Aiven / PlanetScale)
- **Backend API**: Render or Railway
- **Frontend App**: Vercel or Netlify

### Step-by-Step Deployment:
1. **Host Database**: Import `database/schema.sql` and `database/seed.sql` into remote MySQL host.
2. **Deploy Backend**: Connect GitHub repo to Render/Railway. Set environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).
3. **Deploy Frontend**: Connect GitHub repo to Vercel. Set `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.
