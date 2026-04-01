#!/bin/bash
# Script para inicializar banco de dados e dados de teste

echo "🔧 Criando schema do banco de dados..."

docker compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d homefinance << 'EOF'
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Residents table
CREATE TABLE IF NOT EXISTS residents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'variable',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Expense shares table
CREATE TABLE IF NOT EXISTS expense_shares (
  id SERIAL PRIMARY KEY,
  expense_id INTEGER NOT NULL,
  resident_id INTEGER NOT NULL,
  share_value DECIMAL(10, 2) NOT NULL,
  is_settled BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Debts table
CREATE TABLE IF NOT EXISTS debts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  debt_id INTEGER NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  due_date TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

SELECT 'Tabelas criadas com sucesso!' as status;
EOF

echo ""
echo "✅ Schema criado!"
echo ""
echo "📝 Criando usuário de teste..."

TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@homefinance.com","password":"senha123","name":"Usuário Teste"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "⚠️  Usuário pode já existir. Fazendo login..."
  TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@homefinance.com","password":"senha123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

echo "✅ Usuário pronto!"
echo ""
echo "👥 Criando moradores..."

curl -s -X POST http://localhost:5000/api/residents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"João","email":"joao@casa.com"}' > /dev/null

curl -s -X POST http://localhost:5000/api/residents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Maria","email":"maria@casa.com"}' > /dev/null

echo "✅ Moradores criados!"
echo ""
echo "💰 Criando dados de exemplo..."

curl -s -X POST http://localhost:5000/api/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Salário","value":"3000.00","date":"2026-04-01","category":"salary"}' > /dev/null

curl -s -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Aluguel","value":"1500.00","date":"2026-04-01","category":"housing","type":"fixed"}' > /dev/null

echo "✅ Dados populados!"
echo ""
echo "════════════════════════════════════════"
echo "🎉 BANCO PRONTO PARA TESTAR!"
echo "════════════════════════════════════════"
echo ""
echo "🔐 Credenciais:"
echo "   Email: teste@homefinance.com"
echo "   Senha: senha123"
echo ""
echo "🔗 Acesse: http://localhost:5173"
echo ""
