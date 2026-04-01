# ⚡ Como Testar - Guia Rápido

## 👤 Dados de Teste Criados

```
Email: teste@exemplo.com
Senha: senha123
```

## 🧪 Opção 1: Testar Backend com cURL (Phase 2 & 3)

### 1️⃣ Iniciar Backend
```bash
cd backend && npm run dev
```

### 2️⃣ Login e Obter Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'

# Copie o token retornado e use em todos os requests abaixo
```

### 3️⃣ Testar Endpoints Phase 3 (NOVO!)

#### 💰 **Despesas (Expenses)**
```bash
TOKEN="seu_token_aqui"

# Criar despesa com divisão automática
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description":"Aluguel",
    "value":"1500",
    "date":"2026-04-01",
    "category":"housing",
    "type":"fixed",
    "resident_ids":[1,2,3]  # Divide entre 3 moradores = 500 cada
  }'

# Listar todas as despesas
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer $TOKEN"

# Ver despesa com shares
curl -X GET http://localhost:5000/api/expenses/1 \
  -H "Authorization: Bearer $TOKEN"

# Atualizar despesa
curl -X PUT http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Aluguel do Apartamento"}'

# Deletar despesa
curl -X DELETE http://localhost:5000/api/expenses/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 📊 **Receitas (Incomes)**
```bash
# Criar receita
curl -X POST http://localhost:5000/api/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description":"Salário",
    "value":"3000",
    "date":"2026-04-01",
    "category":"salary"
  }'

# Listar receitas
curl -X GET http://localhost:5000/api/incomes \
  -H "Authorization: Bearer $TOKEN"

# Ver receita específica
curl -X GET http://localhost:5000/api/incomes/1 \
  -H "Authorization: Bearer $TOKEN"

# Atualizar receita
curl -X PUT http://localhost:5000/api/incomes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"value":"3500"}'

# Deletar receita
curl -X DELETE http://localhost:5000/api/incomes/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 👥 **Moradores (Residents)**
```bash
# Criar morador
curl -X POST http://localhost:5000/api/residents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"João","email":"joao@example.com"}'

# Listar moradores
curl -X GET http://localhost:5000/api/residents \
  -H "Authorization: Bearer $TOKEN"

# Ver morador específico
curl -X GET http://localhost:5000/api/residents/1 \
  -H "Authorization: Bearer $TOKEN"

# Atualizar morador
curl -X PUT http://localhost:5000/api/residents/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"João Silva","email":"joao.silva@example.com"}'

# Deletar morador
curl -X DELETE http://localhost:5000/api/residents/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 4️⃣ Ver dados no banco:
```bash
# Usuários
docker exec homefinance-db psql -U postgres -d homefinance -c "SELECT * FROM users;"

# Moradores
docker exec homefinance-db psql -U postgres -d homefinance -c "SELECT * FROM residents;"

# Receitas
docker exec homefinance-db psql -U postgres -d homefinance -c "SELECT * FROM incomes;"

# Despesas
docker exec homefinance-db psql -U postgres -d homefinance -c "SELECT * FROM expenses;"

# Divisão de gastos
docker exec homefinance-db psql -U postgres -d homefinance -c "SELECT * FROM expense_shares;"
```

### Health Check do Backend:
```bash
# Inicie backend (se não estiver rodando)
cd backend && npm run dev

# Em outro terminal
curl http://localhost:5000/health
```

## 🚀 Opção 2: Testar via Interface (Phase 3/4+ - Em desenvolvimento)

Quando os endpoints de frontend forem implementados:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Browser
http://localhost:5173
```

Login com: `teste@exemplo.com` / `senha123`

## 📋 Status das Fases

✅ **Phase 1:** Infraestrutura completa (Backend, Frontend, Docker, DB)  
✅ **Phase 2:** Autenticação com JWT  
✅ **Phase 3:** CRUD Despesas, Receitas, Moradores (COM divisão automática!)  
⏳ **Phase 4+:** Dashboard, Gráficos, Relatórios

## 💾 Reset de Dados

Para deletar tudo e recriar dados de teste:
```bash
cd backend
npm run seed
```

## 📊 Dados de Teste Carregados

### Usuário
- 1 user (teste@exemplo.com)

### Household
- 3+ moradores (João, Maria, Pedro, etc)

### Financeiro
- 2+ receitas (Salário R$ 3.500 + Freelance R$ 800 + Bônus)
- 6+ despesas (Aluguel R$ 1.200, Supermercado R$ 250,50, Luz R$ 85, Cinema R$ 60, etc)
- 8+ compartilhamentos automáticos de despesas

### Resultado
- Saldo: Calcular via dashboard ✅

---

**Em Desenvolvimento:** Phase 4 - Dashboard com gráficos e relatórios
