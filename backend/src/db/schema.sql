-- HomeFinance Database Schema
-- PostgreSQL 16

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Residents table
CREATE TABLE IF NOT EXISTS residents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  description VARCHAR(500) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  description VARCHAR(500) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'variable',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Expense shares table
CREATE TABLE IF NOT EXISTS expense_shares (
  id SERIAL PRIMARY KEY,
  expense_id INTEGER NOT NULL REFERENCES expenses(id),
  resident_id INTEGER NOT NULL REFERENCES residents(id),
  share_value DECIMAL(10, 2) NOT NULL,
  is_settled BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Debts table
CREATE TABLE IF NOT EXISTS debts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  description VARCHAR(500) NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  debt_id INTEGER NOT NULL REFERENCES debts(id),
  value DECIMAL(10, 2) NOT NULL,
  due_date TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_residents_user_id ON residents(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_shares_expense_id ON expense_shares(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_shares_resident_id ON expense_shares(resident_id);
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);

-- Display tables created
SELECT 'Database schema created successfully!' as message;
