#!/bin/bash

# Script to initialize test data in HomeFinance API
# This creates a test user and adds residents, expenses, and incomes

API_BASE="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Inicializando dados de teste da HomeFinance${NC}\n"

# 1. Register test user
echo -e "${BLUE}1️⃣ Registrando usuário de teste...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@homefinance.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }')

echo "$REGISTER_RESPONSE" | grep -q "error" && (echo -e "${RED}Erro ao registrar${NC}" && echo "$REGISTER_RESPONSE") || echo -e "${GREEN}✅ Usuário registrado${NC}"

# 2. Login to get token
echo -e "\n${BLUE}2️⃣ Fazendo login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@homefinance.com",
    "password": "senha123"
  }')

echo "$LOGIN_RESPONSE" | grep -q "error" && (echo -e "${RED}Erro ao fazer login${NC}" && echo "$LOGIN_RESPONSE") || echo -e "${GREEN}✅ Login realizado${NC}"

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "Token: $TOKEN\n"

# 3. Create residents
echo -e "${BLUE}3️⃣ Criando moradores...${NC}"

RESIDENTS_DATA=(
  '{"name": "João Silva", "email": "joao@example.com"}'
  '{"name": "Maria Santos", "email": "maria@example.com"}'
  '{"name": "Pedro Oliveira", "email": "pedro@example.com"}'
)

RESIDENT_IDS=()

for resident_json in "${RESIDENTS_DATA[@]}"; do
  RESPONSE=$(curl -s -X POST "$API_BASE/residents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$resident_json")
  
  NAME=$(echo "$resident_json" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
  RESIDENT_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  
  if [ -n "$RESIDENT_ID" ]; then
    echo -e "${GREEN}✅ Morador criado: $NAME (ID: $RESIDENT_ID)${NC}"
    RESIDENT_IDS+=($RESIDENT_ID)
  else
    echo -e "${RED}Erro ao criar morador: $NAME${NC}"
  fi
done

echo ""

# 4. Create expenses
echo -e "${BLUE}4️⃣ Criando despesas compartilhadas...${NC}"

# Shared expense: Rent (3000) divided among all residents
EXPENSE_RESPONSE=$(curl -s -X POST "$API_BASE/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"description\": \"Aluguel\",
    \"value\": 3000,
    \"date\": \"$(date -d '2026-04-01' --iso-8601)\",
    \"category\": \"housing\",
    \"type\": \"fixed\",
    \"residents\": [${RESIDENT_IDS[0]}, ${RESIDENT_IDS[1]}, ${RESIDENT_IDS[2]}]
  }")

echo "$EXPENSE_RESPONSE" | grep -q "id" && echo -e "${GREEN}✅ Despesa 'Aluguel' criada${NC}" || echo -e "${RED}Erro ao criar despesa${NC}"

# Shared expense: Internet (300) divided among all residents  
EXPENSE_RESPONSE=$(curl -s -X POST "$API_BASE/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"description\": \"Internet\",
    \"value\": 300,
    \"date\": \"$(date -d '2026-04-05' --iso-8601)\",
    \"category\": \"utilities\",
    \"type\": \"fixed\",
    \"residents\": [${RESIDENT_IDS[0]}, ${RESIDENT_IDS[1]}, ${RESIDENT_IDS[2]}]
  }")

echo "$EXPENSE_RESPONSE" | grep -q "id" && echo -e "${GREEN}✅ Despesa 'Internet' criada${NC}" || echo -e "${RED}Erro ao criar despesa${NC}"

echo ""

# 5. Create incomes
echo -e "${BLUE}5️⃣ Criando receitas...${NC}"

# Income specific to João (2500)
INCOME_RESPONSE=$(curl -s -X POST "$API_BASE/incomes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"description\": \"Salário - João\",
    \"value\": 2500,
    \"date\": \"$(date -d '2026-04-01' --iso-8601)\",
    \"category\": \"salary\",
    \"resident_id\": ${RESIDENT_IDS[0]}
  }")

echo "$INCOME_RESPONSE" | grep -q "id" && echo -e "${GREEN}✅ Receita 'Salário - João' criada (vinculada)${NC}" || echo -e "${RED}Erro ao criar receita${NC}"

# Income specific to Maria (3000)
INCOME_RESPONSE=$(curl -s -X POST "$API_BASE/incomes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"description\": \"Salário - Maria\",
    \"value\": 3000,
    \"date\": \"$(date -d '2026-04-01' --iso-8601)\",
    \"category\": \"salary\",
    \"resident_id\": ${RESIDENT_IDS[1]}
  }")

echo "$INCOME_RESPONSE" | grep -q "id" && echo -e "${GREEN}✅ Receita 'Salário - Maria' criada (vinculada)${NC}" || echo -e "${RED}Erro ao criar receita${NC}"

# Income specific to Pedro (2000)
INCOME_RESPONSE=$(curl -s -X POST "$API_BASE/incomes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"description\": \"Salário - Pedro\",
    \"value\": 2000,
    \"date\": \"$(date -d '2026-04-01' --iso-8601)\",
    \"category\": \"salary\",
    \"resident_id\": ${RESIDENT_IDS[2]}
  }")

echo "$INCOME_RESPONSE" | grep -q "id" && echo -e "${GREEN}✅ Receita 'Salário - Pedro' criada (vinculada)${NC}" || echo -e "${RED}Erro ao criar receita${NC}"

echo -e "\n${BLUE}✅ Dados de teste carregados com sucesso!${NC}\n"
echo -e "${GREEN}Agora acesse: http://localhost:5173${NC}"
echo -e "${GREEN}Email: teste@homefinance.com${NC}"
echo -e "${GREEN}Senha: senha123${NC}\n"

echo -e "${BLUE}📊 Valores esperados por morador:${NC}"
echo -e "  João:  (2500 recebido) - (1100 despesas) = +1400"
echo -e "  Maria: (3000 recebido) - (1100 despesas) = +1900"
echo -e "  Pedro: (2000 recebido) - (1100 despesas) = +900"
