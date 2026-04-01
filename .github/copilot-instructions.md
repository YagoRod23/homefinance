<!-- HomeFinance - Full-stack project setup instructions -->

# HomeFinance Project Setup Checklist

## Completed Steps
- [x] Project Requirements Clarified - MVP financial management platform
- [x] Project Scaffolding - Monorepo structure created
- [x] Sandbox the Project Backend - Express server with TypeScript, JWT auth
- [x] Sandbox the Project Frontend - React with Vite, Context API
- [x] Install Required Dependencies - npm workspaces configured
- [x] Compile and Build Projects - Both backend and frontend build successfully
- [x] Setup Docker Environment - docker-compose.yml with PostgreSQL
- [x] Setup VS Code tasks - Backend/frontend dev servers and Docker commands
- [x] Phase 2: Authentication Endpoints - Login, Register, Protected routes
- [x] Phase 3: CRUD + Automatic Expense Sharing - Expenses, Incomes, Residents

## Active Steps
- [ ] Phase 4: Frontend Dashboard UI - Connect React components to APIs
- [ ] Phase 5: Analytics & Reports - Graphs, charts, summaries
- [ ] Configure CI/CD Pipeline (GitHub Actions / Locaweb)

## Project Structure
```
homeFinance/
├── backend/                  # Node.js + Express + TypeScript API
│   ├── src/db/schema.ts      # Drizzle ORM schema with all tables
│   ├── src/middleware/auth.ts # JWT auth & token generation
│   ├── src/index.ts          # Express server
│   └── Dockerfile
├── frontend/                 # React + Vite + TypeScript
│   ├── src/context/AuthContext.tsx  # Auth state
│   ├── src/services/api.ts          # Axios with JWT interceptor
│   ├── src/pages/               # Login, Signup, Dashboard
│   └── Dockerfile
├── docker-compose.yml        # PostgreSQL + services
├── .vscode/tasks.json       # Dev server tasks
└── README.md                # Full docs
```

## Tech Stack
- **Backend:** Node.js 20, Express 4.18, TypeScript 5.3, Drizzle ORM, PostgreSQL 16, JWT
- **Frontend:** React 18, Vite 5, TypeScript, TailwindCSS, Axios
- **DevOps:** Docker, Docker Compose, GitHub Actions (planned), Locaweb

## Build Status
✅ Backend: compiles successfully  
✅ Frontend: compiles successfully  
✅ Dependencies: installed via npm workspaces

## Running Development Environment

Open a terminal in VS Code and run tasks:
```bash
# Terminal 1 - Backend
Ctrl+Shift+B (Run Task) → "Backend - Dev Server"

# Terminal 2 - Frontend
Ctrl+Shift+B (Run Task) → "Frontend - Dev Server"

# Or with Docker
npm install && docker-compose up -d
```

Access at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: localhost:5432 (postgres/postgres)
