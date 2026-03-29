# Trello Clone - Fullstack Assignment

A high-performance, responsive Trello clone built to demonstrate advanced full-stack capabilities, zero-latency optimistic UI updates, and deep database optimizations. Designed from the ground up without ORMs or heavy CSS frameworks to highlight core engineering fundamentals.

## 🚀 Core Features
- **Optimistic UI:** Non-blocking, zero-latency rendering utilizing a temporary UUID swapping architecture for seamless updates regardless of network conditions.
- **Complex Drag & Drop:** Vertical and horizontal list shifting powered by `@hello-pangea/dnd` and tightly coupled with a state-driven indexing system.
- **Raw SQL Aggregation:** Deep backend optimization utilizing multi-layered `json_agg` subqueries to eliminate N+1 bottlenecks and fetch the entire board state in a single, hyper-efficient database hit.
- **Client-Side Filtering:** An isolated, debounced Zustand selection engine that immediately filters cross-relational data (Labels, Members, Titles) at 60 FPS without server requests.

---

## 🛠 Tech Stack Overview

The project strictly follows the assignment constraints, avoiding ORMs and utility-first CSS frameworks to test raw programming aptitude.

**Frontend:**
- **Framework:** Next.js (App Router)
- **State Management:** Zustand + Immer
- **Interactions:** `@hello-pangea/dnd` (Drag and Drop)
- **Styling:** CSS Modules & Pure CSS Variables (Strict "No Tailwind" constraint)

**Backend:**
- **Server Framework:** Express.js (Node.js)
- **Database:** PostgreSQL
- **Database Driver:** `node-postgres` (`pg`) - **Raw Parameterized SQL Queries only**.
- **Validation:** Zod (Strict payload validation and error boundaries)

---

## ⚙️ Architecture Highlights

### The `json_agg` Optimization (Solving N+1)
Instead of executing isolated queries spanning Boards, Lists, Cards, Labels, Members, and Checklists, the core `boardRepository.js` executes a deeply nested, 4-layer `json_build_object` query. PostgreSQL merges internal junction tables natively via `json_agg`, yielding the entire application state in one `O(1)` query, completely eliminating standard API request waterfalling.

### Zero-Latency Optimistic Mutations
When interacting with the board (e.g., adding a card or moving a list), the application instantly mutates the exact memory index locally via Zustand Immer. A mock `temp-card-UUID` is immediately rendered. Once the Axios background process resolves the transaction with the database, the memory map swaps the mock ID for the finalized UUID seamlessly, ensuring a native desktop-app tier user experience.

---

## 🔑 Environment Variables

Before starting the application, ensure the following `.env` files are configured at the root of their respective directories.

### Backend (`/backend/.env`)
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/trello_clone
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 💻 Local Development Setup

### 1. Backend Initialization
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

### 2. Database Initialization
Ensure your PostgreSQL instance is running and the `DATABASE_URL` is set in the `.env` file. Execute the following commands to construct the schema and securely populate the test data:
```bash
npm run migrate
npm run seed
```

### 3. Start Backend Server
```bash
npm run dev
```

### 4. Frontend Initialization
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

### 5. Start Frontend Application
```bash
npm run dev
```
The application will now be running securely at `http://localhost:3000`.

---

## 🌍 Deployment Instructions

The application is configured to deploy seamlessly to cloud infrastructure.

**Frontend (Vercel):**
1. Connect the repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend URL.
4. Deploy.

**Backend (Render / Railway):**
1. Connect the repository mapping the Root Directory to `backend`.
2. Provision a mapped PostgreSQL instance via the platform dashboard.
3. Retrieve the generated PostgreSQL Connection String and add it to the environment variables as `DATABASE_URL` alongside `CORS_ORIGIN`.
4. Set the Start Command to `node src/server.js` (or `npm start`).
5. Deployment logs will confirm successful database connection streams globally.
