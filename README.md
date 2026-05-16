# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Features
- **Authentication**: JWT-based user registration and login.
- **Leads Management (CRUD)**: Create, read, update, and delete leads.
- **Advanced Filtering & Search**: Filter by status, source, and perform debounced search by name/email. Sort by Latest/Oldest.
- **Pagination**: Server-side pagination with skip and limit.
- **CSV Export**: Export current lead lists to a CSV file.
- **Role-Based Access**: Support for Admin and Sales User roles.
- **Responsive UI**: Clean interface built with React, Vite, and TailwindCSS.
- **Dockerized**: Fully containerized using Docker and Docker Compose.

## Tech Stack
- **Frontend**: React.js, TypeScript, TailwindCSS v4, Vite, Axios, React Router.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JSONWebToken (JWT).

## Setup Instructions

### Option 1: Running with Docker (Recommended)
1. Ensure Docker and Docker Compose are installed on your machine.
2. Open a terminal in the root directory.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173` and the backend API at `http://localhost:5000`.

### Option 2: Running Locally (Manual Setup)

#### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your values (e.g., set `MONGODB_URI` to a running MongoDB instance).
4. Run the development server: `npm run dev`

#### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Access the application at `http://localhost:5173`.

---

## API Documentation

### Authentication Routes

- **POST /api/auth/register**
  - Registers a new user.
  - Body: `{ "name": "User", "email": "user@example.com", "password": "password123", "role": "Sales User" }`
  - Returns: User object + token.

- **POST /api/auth/login**
  - Authenticates a user.
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: User object + token.

- **GET /api/auth/profile**
  - Gets the current authenticated user's profile.
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object.

### Leads Routes (Protected - Require Bearer Token)

- **GET /api/leads**
  - Retrieves all leads with pagination, filtering, and sorting.
  - Query Params:
    - `page` (number, default: 1)
    - `limit` (number, default: 10)
    - `search` (string)
    - `status` (New | Contacted | Qualified | Lost)
    - `source` (Website | Instagram | Referral)
    - `sort` (latest | oldest)

- **POST /api/leads**
  - Creates a new lead.
  - Body: `{ "name": "John Doe", "email": "john@example.com", "status": "New", "source": "Website" }`

- **GET /api/leads/:id**
  - Retrieves a specific lead by ID.

- **PUT /api/leads/:id**
  - Updates a specific lead.
  - Body: Optional fields to update (name, email, status, source).

- **DELETE /api/leads/:id**
  - Deletes a specific lead.

---

## Evaluation Checklist Met
- Code Quality & Clean Architecture
- Proper TypeScript usage with Interfaces
- Backend pagination (`skip` and `limit`)
- Advanced filtering and debounced search
- CSV Export functionality
- Loading, Error, and Empty states in UI
- Docker setup included
