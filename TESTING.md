# 🧪 Testing Guide - HomeFinance

Guia completo para testar a aplicação com dados de teste.

## 📋 Pré-requisitos

- Docker rodando
- Node.js 18+
- Todos os passos do QUICK_START.md já completados

## ⚡ Quick Test (5 minutos)

### Step 1: Inicie o PostgreSQL

```bash
docker-compose up -d postgres
```

Aguarde ~5 segundos e verifique:

```bash
docker ps | grep postgres
# Deve mostrar o container rodando
```

### Step 2: Gere dados de teste

```bash
cd backend
npm run seed
```

**Output esperado:**
```
🌱 Iniciando seed de dados de teste...

✅ Usuário criado:
   Email: teste@exemplo.com
   Senha: senha123
   ID: 1

✅ Moradores criados:
   1. João Silva (ID: 1)
   2. Maria Santos (ID: 2)
   3. Pedro Costa (ID: 3)

✅ Receitas criadas:
   1. Salário: R$ 3500.00
   2. Freelance: R$ 800.00

✅ Despesas criadas:
   1. Aluguel: R$ 1200.00 (fixed)
   2. Supermercado: R$ 250.50 (variable)
   3. Conta de Luz: R$ 85.00 (fixed)
   4. Cinema: R$ 60.00 (variable)

✅ Compartilhamentos de despesas criados:
   Total: 8 distribuições

📊 RESUMO DOS DADOS DE TESTE:

🔐 Acesso:
   Email: teste@exemplo.com
   Senha: senha123

👥 Household:
   3 Moradores
   4 Despesas (8 compartilhadas)
   2 Receitas

💰 Financeiro:
   Total Receitas: R$ 4300.00
   Total Despesas: R$ 1595.50
   Saldo: R$ 2704.50

✨ Seed concluído com sucesso!
🚀 Você já pode fazer login com os dados acima.
```

### Step 3: Verifique os dados no banco

Conecte ao banco e veja os dados criados:

```bash
psql -h localhost -U postgres -d homefinance

# Ver usuários
SELECT id, email, name FROM users;

# Ver moradores
SELECT id, name, email FROM residents;

# Ver despesas
SELECT id, description, value, type FROM expenses;

# Ver receitas
SELECT id, description, value FROM incomes;

# Ver compartilhamentos
SELECT 
  e.description as expense,
  r.name as resident,
  es.share_value
FROM expense_shares es
JOIN expenses e ON es.expense_id = e.id
JOIN residents r ON es.resident_id = r.id;
```

## 🚀 Testar a Aplicação

### Option A: Com Endpoints Auth Implementados (quando Phase 2 estiver pronto)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

1. Abra http://localhost:5173
2. Clique em "Sign up"
3. Use os dados:
   - Nome: Usuário Teste
   - Email: teste@exemplo.com
   - Senha: senha123
4. Faça login
5. Você verá o dashboard com os dados de teste

### Option B: Teste Direto com cURL (sem frontend)

#### 1. Teste Health Check
```bash
curl http://localhost:5000/health
```

Resposta esperada:
```json
{"status":"ok","timestamp":"2026-04-01T10:30:00.000Z"}
```

#### 2. Teste Login (quando implementado)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

Resposta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "teste@exemplo.com",
    "name": "Usuário Teste"
  }
}
```

#### 3. Teste com Token
```bash
# Use o token retornado acima
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/protected-route
```

## 🗄️ Banco de Dados

### Conectar ao PostgreSQL

```bash
psql -h localhost -U postgres -d homefinance
```

Commands úteis:
```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Ver todos os usuários
SELECT * FROM users;

-- Ver despesas com moradores
SELECT e.description, r.name, es.share_value
FROM expense_shares es
JOIN expenses e ON es.expense_id = e.id
JOIN residents r ON es.resident_id = r.id;

-- Deletar tudo e começar novamente
DELETE FROM payments;
DELETE FROM debts;
DELETE FROM expense_shares;
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM residents;
DELETE FROM users;
```

## 🔄 Resetar Dados de Teste

Se você quiser criar dados de teste novamente:

```bash
# 1. Delete os dados antigos
psql -h localhost -U postgres -d homefinance << EOF
DELETE FROM payments;
DELETE FROM debts;
DELETE FROM expense_shares;
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM residents;
DELETE FROM users;
EOF

# 2. Rode o seed novamente
cd backend
npm run seed
```

## 🐛 Troubleshooting

### "Database connection refused"
```bash
# Verifique se PostgreSQL está rodando
docker ps | grep postgres

# Se não está, inicie:
docker-compose up -d postgres

# Aguarde 10 segundos e tente novamente
```

### "relation "users" does not exist"
```bash
# Drizzle migrations não foram rodadas
# Precisa criar as tabelas manualmente ou usar:
cd backend
npm run db:push
```

### "npm run seed" comandonão funciona
```bash
# Verifique se está no backend
cd backend

# Instale dependências se necessário
npm install

# Tente novamente
npm run seed
```

### Dados de teste não aparecem
```bash
# Verifique se o seed rodou sem erros
cd backend
npm run seed 2>&1 | head -20

# Verifique no banco
psql -h localhost -U postgres -d homefinance -c "SELECT COUNT(*) FROM users;"
```

## 📊 Dados de Teste Inclusos

### Usuário
- **Email:** teste@exemplo.com
- **Senha:** senha123
- **Nome:** Usuário Teste

### Moradores (3)
1. João Silva (joao@exemplo.com)
2. Maria Santos (maria@exemplo.com)
3. Pedro Costa (pedro@exemplo.com)

### Receitas (2)
1. Salário - R$ 3.500,00
2. Freelance - R$ 800,00
**Total:** R$ 4.300,00

### Despesas (4)
1. Aluguel - R$ 1.200,00 (Fixo) - Dividido 3x = R$ 400 cada
2. Supermercado - R$ 250,50 (Variável) - Dividido 3x = R$ 83,50 cada
3. Conta de Luz - R$ 85,00 (Fixo) - João paga tudo
4. Cinema - R$ 60,00 (Variável) - Maria paga
**Total:** R$ 1.595,50

### Balancete
- **Total Receitas:** R$ 4.300,00
- **Total Despesas:** R$ 1.595,50
- **Saldo:** R$ 2.704,50

## ✅ Checklist de Teste

- [ ] PostgreSQL rodando (docker ps)
- [ ] Seed executado com sucesso (npm run seed)
- [ ] Dados no banco (psql)
- [ ] Health check respondendo (curl)
- [ ] Frontend rodando (http://localhost:5173)
- [ ] Backend rodando (http://localhost:5000)
- [ ] Pode fazer login (quando Phase 2 pronto)
- [ ] Dashboard mostra dados

## 🎯 Próximos Passos

1. **Implement Auth Endpoints (Phase 2)**
   - POST /auth/login
   - POST /auth/register
   - POST /auth/refresh

2. **Test Complete Flow**
   - Signup → Database create user
   - Login → Get JWT token
   - View Dashboard → Fetch user's expenses

3. **Add More Test Cases**
   - Criar nova despesa
   - Editar despesa
   - Adicionar novo morador
   - Testar divisão de gastos

---

**Questions?** Check DEVELOPMENT.md or NEXT_STEPS_PHASE_2.md for more details.
