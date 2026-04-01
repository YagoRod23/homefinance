# 📋 Casos de Uso - HomeFinance

**Data:** 1º de Abril de 2026  
**Status:** Documentado com testes unitários

---

## 1️⃣ Caso de Uso: Distribuição de Despesa

### Cenário:
3 moradores (João, Maria, Pedro) compartilham um apartamento.
- Aluguel (mensal): R$ 3.000,00
- Internet (mensal): R$ 300,00

### Processo:
1. **Criar receitas vinculadas** a cada morador
2. **Criar despesas compartilhadas** entre todos os moradores
3. **Sistema calcula automaticamente** a divisão

### Valores Esperados:

| Morador | Salário | Aluguel | Internet | Balance |
|---------|---------|--------|----------|---------|
| João    | R$ 2.500 | -R$ 1.000 | -R$ 100 | +R$ 1.400 |
| Maria   | R$ 3.000 | -R$ 1.000 | -R$ 100 | +R$ 1.900 |
| Pedro   | R$ 2.800 | -R$ 1.000 | -R$ 100 | +R$ 1.700 |

### Salário + Despesa = Balanço
- João: 2.500 - 1.100 = **+1.400** (tem crédito)
- Maria: 3.000 - 1.100 = **+1.900** (tem crédito)
- Pedro: 2.800 - 1.100 = **+1.700** (tem crédito)

---

## 2️⃣ Caso de Uso: Receita Geral (Distribuída)

### Cenário:
Bônus da empresa: R$ 2.000 (não vinculado a ninguém específico)

### Processo:
1. Adicionar receita SEM vincular a morador específico
2. Sistema distribui automaticamente

### Cálculo:
- R$ 2.000 ÷ 3 moradores = **R$ 666,67 cada um**

### Novo Balanço:
| Morador | Salário | Bônus  | Aluguel | Internet | Balance |
|---------|---------|--------|--------|----------|---------|
| João    | R$ 2.500 | R$ 666,67 | -R$ 1.000 | -R$ 100 | +R$ 2.066,67 |
| Maria   | R$ 3.000 | R$ 666,67 | -R$ 1.000 | -R$ 100 | +R$ 2.566,67 |
| Pedro   | R$ 2.800 | R$ 666,67 | -R$ 1.000 | -R$ 100 | +R$ 2.366,67 |

---

## 3️⃣ Caso de Uso: Devedores

### Cenário:
João teve despesa inesperada e ganha menos que esperado.

### Situação:
- João recebe: R$ 1.500
- João deve: R$ 2.000
- **Balance: -R$ 500** (devedor)

### Visualização:
- 🔴 **Saldo negativo** = Precisa pagar
- 🟢 **Saldo positivo** = Tem crédito

---

## 4️⃣ Caso de Uso: Receita Específica por Morador

### Cenário:
Maria fez freelance extra e ganhou R$ 1.000

### Processo:
1. Ir para **Receitas**
2. Adicionar:
   - Descrição: "Freelance - Projeto X"
   - Valor: R$ 1.000
   - **Vincular a Morador: Maria**
   - Categoria: 💼 Freelance

### Resultado:
- Apenas Maria recebe os R$ 1.000
- Balance dela aumenta em R$ 1.000
- João e Pedro não são afetados

---

## 5️⃣ Caso de Uso: Despesa Variável x Fixa

### Tipo: FIXA
Exemplo: Aluguel, Internet
- Se mudar o valor da despesa, afeta o balanço histórico?
- Ideal: Criar nova entrada

### Tipo: VARIÁVEL
Exemplo: Supermercado, Combustível
- Pode ser registrada sempre que ocorrer
- Dividida entre os moradores selecionados automaticamente

---

## 6️⃣ Caso de Uso: Análise de Gastos por Categoria

### Dashboard Analytics:
Mostra:
- 🏠 Moradia: R$ 3.000 (maior gasto)
- 🛍️ Compras: R$ 500
- 🚗 Transporte: R$ 200
- 💡 Contas: R$ 300

### Gráfico Mensal:
- Receita Total: R$ 8.300
- Despesa Total: R$ 4.000
- **Lucro: R$ 4.300**

---

## 7️⃣ Caso de Uso: Relatório por Residente

### Exemplo - Cliques em "João"
Mostra:
- **Total Recebido:** R$ 2.500 (salário)
- **Total Devido:** R$ 1.100 (aluguel + internet)
- **Saldo:** R$ 1.400
- **Status:** ✅ Quitado (saldo positivo)

---

## 8️⃣ Fórmula de Cálculo - CORRIGIDA

### Para CADA Morador:

```
totalPaid = Σ(receitas vinculadas) + (receita_geral / n_moradores)
totalOwed = Σ(despesas compartilhadas deste morador)
balance = totalPaid - totalOwed
```

### Exemplos de Cálculo:

#### João (receita específica):
```
totalPaid = 2.500 (salário) + 666,67 (bônus/3) = 3.166,67
totalOwed = 1.000 (aluguel/3) + 100 (internet/3) = 1.100
balance = 3.166,67 - 1.100 = +2.066,67 ✓ Tem crédito
```

#### Maria (sem receita):
```
totalPaid = 0 + 666,67 (bônus/3) = 666,67
totalOwed = 1.000 + 100 = 1.100
balance = 666,67 - 1.100 = -433,33 ✓ Deve pagar
```

---

## 9️⃣ Estrutura de Dados

### Receita (Income)
```json
{
  "id": 1,
  "description": "Salário",
  "value": 2500.00,
  "date": "2026-04-01",
  "category": "salary",
  "resident_id": 1,  // ← Vinculado a um morador OU null (distribui)
  "created_at": "2026-04-01T10:00:00Z"
}
```

### Despesa (Expense)
```json
{
  "id": 1,
  "description": "Aluguel",
  "value": 3000.00,
  "date": "2026-04-01",
  "category": "housing",
  "type": "fixed",
  "shares": [
    {"id": 1, "resident_id": 1, "share_value": 1000.00},
    {"id": 2, "resident_id": 2, "share_value": 1000.00},
    {"id": 3, "resident_id": 3, "share_value": 1000.00}
  ],
  "created_at": "2026-04-01T10:00:00Z"
}
```

---

## 🔟 Validações Necessárias

### ✅ Backend Deve Validar:
1. `resident_id` existe no banco
2. Valor é positivo
3. Data não é futura (opcional)
4. Categoria existe
5. Despesa tem pelo menos um morador

### ✅ Frontend Deve Validar:
1. Campo obrigatório vazio
2. Valor negativo
3. Morador não selecionado (despesa)

---

## 📊 Fórmula de Distribuição de Despesa Compartilhada

### Se marcar 2 moradores:
```
Despesa Total: R$ 1.000
Quantidade Selecionada: 2
Share por pessoa: 1.000 / 2 = R$ 500 cada
```

### Se marcar 3 moradores:
```
Despesa Total: R$ 1.000
Quantidade Selecionada: 3
Share por pessoa: 1.000 / 3 = R$ 333,33 cada
```

---

## 🧪 Testes Unitários (Jest)

Ver arquivo: `frontend/src/services/__tests__/analyticsService.test.ts`

Testa:
- ✅ Cálculo de totais
- ✅ Balanço por morador
- ✅ Distribuição de receita geral
- ✅ Receita específica por morador
- ✅ Casos edge (morador sem receita)

---

## 📝 Checklist de Validação

- [ ] Receita vinculada a morador **não** distribui para outros
- [ ] Receita **sem** vinculação distribui **igual** para todos
- [ ] Balance negativo = morador **deve** pagar
- [ ] Balance positivo = morador tem **crédito**
- [ ] Categorias exibidas em **português**
- [ ] Despesa pode ser selecionada por morador (checkbox)
- [ ] Relatório por morador mostra **apenas seus dados**
- [ ] Gráficos refletem dados **reais** (não fixos)

---
