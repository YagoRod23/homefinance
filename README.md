# HomeFinance - Financial Management Platform

A modern web-based financial management platform for shared household expenses, income tracking, and debt management.

## 🎯 Features

- **User Authentication** - Secure login and registration with JWT
- **Income & Expense Tracking** - Categorize and manage financial transactions
- **Shared Expenses** - Split costs between household members
- **Dashboard** - Real-time financial overview with charts and analytics
- **Debt Management** - Track and manage household debts

## 🛠️ Tech Stack

### Backend
- **Node.js** + Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Drizzle ORM** for database management
- **JWT** for authentication

### Frontend
- **React 18** with TypeScript
- **Vite** for fast build and HMR
- **TailwindCSS** for styling
- **Context API** for state management
- **Recharts** for data visualization

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** or Locaweb for CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository>
cd homefinance
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

3. **Setup environment variables**
```bash
# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Start with Docker Compose**
```bash
docker-compose up -d
```

5. **Run database migrations** (if needed)
```bash
cd backend
npm run db:push
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: localhost:5432

### Development Commands

```bash
# Start all services (backend + frontend)
npm run dev

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Build both projects
npm run build

# Lint and format
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
homefinance/
├── backend/              # Express API server
│   ├── src/
│   │   ├── db/          # Database schema & migrations
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & error handling
│   │   ├── services/    # Business logic
│   │   └── index.ts     # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/             # React UI
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # State management
│   │   ├── services/    # API calls
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── docker-compose.yml    # Multi-container setup
├── .env.example         # Environment template
└── README.md            # This file
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. User logs in → Backend generates access token
2. Token is stored in localStorage
3. Token is sent in Authorization header for protected requests
4. Expired tokens trigger automatic re-authentication

## 📊 Database Schema

### Core Tables
- `users` - User accounts
- `residents` - Household members
- `expenses` - Transaction records
- `expense_shares` - Expense distribution
- `incomes` - Income records
- `debts` - Debt tracking (optional)
- `payments` - Payment records (optional)

## 🚢 Deployment

### To Locaweb

1. **Set production environment variables**
```bash
export JWT_SECRET=<strong-secret>
export DATABASE_URL=<production-db-url>
```

2. **Build Docker images**
```bash
docker build -t homefinance-backend ./backend
docker build -t homefinance-frontend ./frontend
```

3. **Deploy using Locaweb's infrastructure**

Refer to `.github/workflows` for CI/CD automation.

## 📝 API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Residents
- `GET /api/residents` - List residents
- `POST /api/residents` - Add resident
- `GET /api/residents/summary` - Debt summary

### Dashboard
- `GET /api/dashboard` - Financial overview
- `GET /api/dashboard/monthly-flow` - Monthly data

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For issues or questions, please create an issue in the repository.

---

**Happy tracking! 💰**
