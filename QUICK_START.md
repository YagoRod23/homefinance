# ⚡ Quick Start - HomeFinance

Get up and running in 5 minutes.

## 1. Install Dependencies
```bash
npm install
```

## 2. Start Database with Docker
```bash
docker pull postgres:16-alpine
docker run --name homefinance-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=homefinance -d postgres:16-alpine
```

Or use docker-compose:
```bash
docker-compose up -d postgres
```

## 3. Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
Should say: `Backend server is running on port 5000`

## 4. Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
Should open: `http://localhost:5173`

## 5. Create Test Account
Visit http://localhost:5173 and sign up with any email/password.

---

**Success!** 🎉 You should see the HomeFinance dashboard.

For detailed instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)
