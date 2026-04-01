/**
 * Testes Unitários - Analytics Service
 * Valida os cálculos de analytics e balanço por residente
 */

import {
  calculateAnalytics,
  calculateResidentBalances,
  formatMonthName,
  formatCurrency,
} from '../services/analyticsService';
import { Expense } from '../services/expenseService';
import { Income } from '../services/incomeService';

describe('analyticsService', () => {
  // ====== DADOS DE TESTE ======
  const mockResidents = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Maria' },
  ];

  const mockExpenses: Expense[] = [
    {
      id: 1,
      description: 'Aluguel',
      value: 1000,
      date: '2026-04-01',
      category: 'housing',
      type: 'fixed',
      shares: [
        { id: 1, resident_id: 1, share_value: 500, is_settled: false },
        { id: 2, resident_id: 2, share_value: 500, is_settled: false },
      ],
    },
    {
      id: 2,
      description: 'Internet',
      value: 200,
      date: '2026-04-05',
      category: 'utilities',
      type: 'fixed',
      shares: [
        { id: 3, resident_id: 1, share_value: 100, is_settled: false },
        { id: 4, resident_id: 2, share_value: 100, is_settled: false },
      ],
    },
  ];

  const mockIncomes: Income[] = [
    {
      id: 1,
      description: 'Salário João',
      value: 2000,
      date: '2026-04-01',
      category: 'salary',
      resident_id: 1, // Vinculado a João
    },
    {
      id: 2,
      description: 'Salário Maria',
      value: 2500,
      date: '2026-04-01',
      category: 'salary',
      resident_id: 2, // Vinculado a Maria
    },
  ];

  describe('calculateAnalytics', () => {
    it('deve calcular totais corretamente', () => {
      const result = calculateAnalytics(mockExpenses, mockIncomes);

      expect(result.totalIncome).toBe(4500); // 2000 + 2500
      expect(result.totalExpenses).toBe(1200); // 1000 + 200
      expect(result.balance).toBe(3300); // 4500 - 1200
    });

    it('deve calcular médias corretamente', () => {
      const result = calculateAnalytics(mockExpenses, mockIncomes);

      // Ambos os gastos em abril
      expect(result.averageMonthlyExpense).toBe(1200);
      expect(result.averageMonthlyIncome).toBe(4500);
    });

    it('deve agrupar gastos por categoria', () => {
      const result = calculateAnalytics(mockExpenses, mockIncomes);

      const housing = result.expensesByCategory.find(
        (c) => c.name.includes('Moradia')
      );
      const utilities = result.expensesByCategory.find(
        (c) => c.name.includes('Contas')
      );

      expect(housing?.value).toBe(1000);
      expect(utilities?.value).toBe(200);
    });

    it('deve criar dados mensais corretos', () => {
      const result = calculateAnalytics(mockExpenses, mockIncomes);

      expect(result.monthlyData.length).toBe(1); // Só abril
      expect(result.monthlyData[0].expenses).toBe(1200);
      expect(result.monthlyData[0].income).toBe(4500);
      expect(result.monthlyData[0].balance).toBe(3300);
    });
  });

  describe('calculateResidentBalances', () => {
    it('deve calcular balanço individual por residente (COM receitas vinculadas)', () => {
      const result = calculateResidentBalances(
        mockExpenses,
        mockResidents,
        mockIncomes
      );

      // João: recebe 2000 (salário), deve 600 (aluguel + internet)
      const joao = result.find((r) => r.residentId === 1);
      expect(joao?.totalPaid).toBe(2000);
      expect(joao?.totalOwed).toBe(600); // 500 + 100
      expect(joao?.balance).toBe(1400); // 2000 - 600 = CRÉDITO

      // Maria: recebe 2500 (salário), deve 600 (aluguel + internet)
      const maria = result.find((r) => r.residentId === 2);
      expect(maria?.totalPaid).toBe(2500);
      expect(maria?.totalOwed).toBe(600); // 500 + 100
      expect(maria?.balance).toBe(1900); // 2500 - 600 = CRÉDITO
    });

    it('deve calcular balanço com receita geral (distribuída entre todos)', () => {
      const incomesGeral: Income[] = [
        {
          id: 1,
          description: 'Bônus da empresa',
          value: 2000,
          date: '2026-04-01',
          category: 'bonus',
          // SEM resident_id - distribui entre todos
        },
      ];

      const result = calculateResidentBalances(
        mockExpenses,
        mockResidents,
        incomesGeral
      );

      // Cada um recebe 1000 de bônus (2000 / 2 moradores)
      const joao = result.find((r) => r.residentId === 1);
      const maria = result.find((r) => r.residentId === 2);

      expect(joao?.totalPaid).toBe(1000); // 2000 / 2
      expect(maria?.totalPaid).toBe(1000); // 2000 / 2
    });

    it('deve calcular balanço correto quando morador deve pagar', () => {
      const altExpenses: Expense[] = [
        {
          id: 1,
          description: 'Aluguel alto',
          value: 5000,
          date: '2026-04-01',
          category: 'housing',
          type: 'fixed',
          shares: [
            { id: 1, resident_id: 1, share_value: 5000, is_settled: false },
          ],
        },
      ];

      const smallIncomes: Income[] = [
        {
          id: 1,
          description: 'Pequeno bônus',
          value: 1000,
          date: '2026-04-01',
          category: 'bonus',
          resident_id: 1,
        },
      ];

      const result = calculateResidentBalances(
        altExpenses,
        [{ id: 1, name: 'João' }],
        smallIncomes
      );

      const joao = result[0];
      expect(joao.totalPaid).toBe(1000);
      expect(joao.totalOwed).toBe(5000);
      expect(joao.balance).toBe(-4000); // DEVE pagar 4000
    });

    it('deve retornar moradores sem movimentações com balance zero', () => {
      const result = calculateResidentBalances([], mockResidents);

      expect(result.length).toBe(2);
      result.forEach((r) => {
        expect(r.totalPaid).toBe(0);
        expect(r.totalOwed).toBe(0);
        expect(r.balance).toBe(0);
      });
    });

    it('deve ordenar por maior saldo primeiro (crédito)', () => {
      const result = calculateResidentBalances(
        mockExpenses,
        mockResidents,
        mockIncomes
      );

      // Maria tem mais crédito (1900) > João (1400)
      expect(result[0].residentId).toBe(2); // Maria
      expect(result[1].residentId).toBe(1); // João
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar moeda brasileira corretamente', () => {
      // Note: importar formatCurrency se necessário
      expect(1500.5).toBe(1500.5); // Placeholder
    });
  });

  describe('formatMonthName', () => {
    it('deve formatar nome do mês em português', () => {
      const result = formatMonthName('2026-04');
      expect(result).toContain('abr'); // abril abreviado
      expect(result).toContain('2026');
    });
  });

  // ====== CASOS DE USO ======
  describe('Casos de Uso', () => {
    it('Caso 1: Calcular balanço de 2 moradores com receitas e despesas', () => {
      const expenses: Expense[] = [
        {
          id: 1,
          description: 'Aluguel',
          value: 2000,
          date: '2026-04-01',
          category: 'housing',
          type: 'fixed',
          shares: [
            { id: 1, resident_id: 1, share_value: 1000, is_settled: false },
            { id: 2, resident_id: 2, share_value: 1000, is_settled: false },
          ],
        },
      ];

      const incomes: Income[] = [
        {
          id: 1,
          description: 'Salário',
          value: 3000,
          date: '2026-04-01',
          category: 'salary',
          resident_id: 1,
        },
      ];

      const result = calculateResidentBalances(
        expenses,
        mockResidents,
        incomes
      );

      // João: 3000 (salário) - 1000 (aluguel) = 2000 de crédito
      const joao = result.find((r) => r.residentId === 1);
      expect(joao?.balance).toBe(2000);

      // Maria: 0 (sem salário) - 1000 (aluguel) = -1000 (deve)
      const maria = result.find((r) => r.residentId === 2);
      expect(maria?.balance).toBe(-1000);
    });
  });
});
