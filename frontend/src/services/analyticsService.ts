import { Expense } from './expenseService';
import { Income } from './incomeService';

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface ResidentBalance {
  residentId: number;
  name: string;
  totalOwed: number;
  totalPaid: number;
  balance: number;
}

export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  averageMonthlyExpense: number;
  averageMonthlyIncome: number;
  highestExpenseMonth: string;
  highestIncomeMonth: string;
  expensesByCategory: CategoryData[];
  monthlyData: MonthlyData[];
}

/**
 * Calcula dados de analytics a partir de despesas e receitas
 */
export const calculateAnalytics = (
  expenses: Expense[],
  incomes: Income[]
): AnalyticsData => {
  // Totais gerais
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.value, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);
  const balance = totalIncome - totalExpenses;

  // Agrupamento por mês
  const monthlyMap = new Map<string, { expenses: number; income: number }>();

  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const current = monthlyMap.get(monthKey) || { expenses: 0, income: 0 };
    current.expenses += exp.value;
    monthlyMap.set(monthKey, current);
  });

  incomes.forEach((inc) => {
    const date = new Date(inc.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const current = monthlyMap.get(monthKey) || { expenses: 0, income: 0 };
    current.income += inc.value;
    monthlyMap.set(monthKey, current);
  });

  // Converter para array e ordenar
  const monthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      expenses: data.expenses,
      income: data.income,
      balance: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Médias
  const averageMonthlyExpense =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length
      : 0;

  const averageMonthlyIncome =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length
      : 0;

  // Meses com maior gasto e maior renda
  let highestExpenseMonth = '';
  let highestExpenseValue = 0;
  let highestIncomeMonth = '';
  let highestIncomeValue = 0;

  monthlyData.forEach((m) => {
    if (m.expenses > highestExpenseValue) {
      highestExpenseValue = m.expenses;
      highestExpenseMonth = m.month;
    }
    if (m.income > highestIncomeValue) {
      highestIncomeValue = m.income;
      highestIncomeMonth = m.month;
    }
  });

  // Despesas por categoria
  const categoryMap = new Map<string, number>();
  expenses.forEach((exp) => {
    const current = categoryMap.get(exp.category) || 0;
    categoryMap.set(exp.category, current + exp.value);
  });

  const expensesByCategory: CategoryData[] = Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name: formatCategoryName(name),
      value: Math.round(value * 100) / 100,
      percentage: Math.round((value / totalExpenses) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  return {
    totalIncome,
    totalExpenses,
    balance,
    averageMonthlyExpense: Math.round(averageMonthlyExpense * 100) / 100,
    averageMonthlyIncome: Math.round(averageMonthlyIncome * 100) / 100,
    highestExpenseMonth,
    highestIncomeMonth,
    expensesByCategory,
    monthlyData,
  };
};

/**
 * Calcula o que cada residente deve ou é devido
 */
export const calculateResidentBalances = (
  expenses: Expense[],
  residents: { id: number; name: string }[],
  incomes?: Income[]
): ResidentBalance[] => {
  const balances = residents.map((r) => ({
    residentId: r.id,
    name: r.name,
    totalOwed: 0,
    totalPaid: 0,
    balance: 0,
  }));

  // Adiciona despesas (o que cada um deve)
  expenses.forEach((exp) => {
    if (exp.shares && exp.shares.length > 0) {
      exp.shares.forEach((share) => {
        const resident = balances.find((b) => b.residentId === share.resident_id);
        if (resident) {
          resident.totalOwed += share.share_value;
        }
      });
    }
  });

  // Adiciona receitas (o que está pago/disponível por residente)
  if (incomes) {
    incomes.forEach((inc) => {
      if (inc.resident_id) {
        const resident = balances.find((b) => b.residentId === inc.resident_id);
        if (resident) {
          resident.totalPaid += inc.value;
        }
      } else {
        // Se receita não tem residente específico, distribui entre todos
        const sharePerResident = inc.value / residents.length;
        balances.forEach((b) => {
          b.totalPaid += sharePerResident;
        });
      }
    });
  }

  // Calcular balance (negativo = deve, positivo = é devido)
  balances.forEach((b) => {
    b.balance = b.totalPaid - b.totalOwed;
  });

  return balances.sort((a, b) => b.balance - a.balance);
};

/**
 * Formata nome de categoria
 */
const formatCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    housing: '🏠 Moradia',
    food: '🍔 Alimentação',
    transport: '🚗 Transporte',
    utilities: '💡 Contas',
    entertainment: '🎬 Diversão',
    health: '🏥 Saúde',
    shopping: '🛍️ Compras',
    salary: '💰 Salário',
    freelance: '💼 Freelance',
    bonus: '🎁 Bônus',
    other: '📦 Outros',
  };
  return names[category] || category;
};

/**
 * Formata nome do mês
 */
export const formatMonthName = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
};

/**
 * Formata valores em moeda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
