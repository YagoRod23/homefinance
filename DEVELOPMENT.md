# HomeFinance Development Guide

Quick start guide for setting up and running the HomeFinance project locally.

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **Docker & Docker Compose** ([Install](https://docs.docker.com/compose/install/))
- **Git**
- **VS Code** (optional, recommended)

## Option 1: Local Development (Recommended for Development)

### Step 1: Install Dependencies
```bash
npm install
```

This installs dependencies for root, backend, and frontend using npm workspaces.

### Step 2: Setup Environment Variables

The `.env.local` files are already created for quick start:
- `backend/.env.local` - Backend config (PORT=5000, JWT_SECRET, DATABASE_URL)
- `frontend/.env.local` - Frontend config (VITE_API_URL=http://localhost:5000/api)

For production, create `.env` files and update values.

### Step 3: Start PostgreSQL (Required for Backend)

Option A - Using Docker:
```bash
docker pull postgres:16-alpine
docker run --name homefinance-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=homefinance -d postgres:16-alpine
```

Option B - Using Docker Compose (easier):
```bash
docker-compose up -d postgres
```

Verify connection:
```bash
psql -h localhost -U postgres -d homefinance -c "SELECT 1;"
```

### Step 4: Run Backend & Frontend

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected output: `Backend server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output: `VITE v5.4.21` with local URL

### Step 5: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Database:** postgres://postgres:postgres@localhost:5432/homefinance

## Option 2: Docker Compose (Full Stack)

Start all services with one command:

```bash
docker-compose up -d
```

Services started:
- `postgres` - Database on port 5432
- `backend` - API on port 5000
- `frontend` - UI on port 5173

Check logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

Stop everything:
```bash
docker-compose down
```

## Using VS Code Tasks

If using VS Code, run tasks from the Command Palette (Ctrl+Shift+P):

1. **Backend - Dev Server** - Starts backend on port 5000
2. **Frontend - Dev Server** - Starts frontend on port 5173
3. **Docker Compose - Up** - Starts docker services
4. **Docker Compose - Down** - Stops docker services

## Common Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server (watch mode)
npm run build        # Build TypeScript → dist/
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run test         # Run Jest tests
```

### Frontend
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
```

### Root
```bash
npm run build        # Build both backend and frontend
npm run lint         # Lint both projects
npm run dev          # Start both dev servers (background)
```

## Database Migrations

After schema changes in `backend/src/db/schema.ts`:

```bash
cd backend
npm run db:generate  # Generate migration file
npm run db:push      # Apply migration to database
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5432 (database)
lsof -i :5432 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U postgres -d homefinance -c "SELECT 1;"

# If not running, start it
docker run --name homefinance-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=homefinance -d postgres:16-alpine
```

### Frontend can't reach Backend API
- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `frontend/.env.local` (should be `http://localhost:5000/api`)
- Check browser console for CORS errors

### Node modules issues
```bash
# Clean reinstall
rm -rf node_modules backend/node_modules frontend/node_modules package-lock.json
npm install
```

## Next Steps

After getting the dev environment running:

1. **Test Authentication** (Fase 2)
   - Try signup at http://localhost:5173/signup
   - Backend should create user and return JWT token

2. **Check Database** (Fase 3)
   - Connect to database: `psql -h localhost -U postgres -d homefinance`
   - View tables: `\dt`
   - Query users: `SELECT * FROM users;`

3. **Development Flow**
   - Make code changes in `backend/src` or `frontend/src`
   - Dev servers auto-reload (check terminal for changes)
   - Check browser console and backend logs for errors

## Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Getting Help

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review error logs in terminal/browser console
3. Check `.env.local` files for correct configuration
4. Verify all prerequisites are installed: `node --version`, `docker --version`

---

Happy coding! 🚀
