import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { residentService } from '../services/residentService';
import {
  calculateAnalytics,
  calculateResidentBalances,
  formatCurrency,
} from '../services/analyticsService';
import {
  IncomeVsExpensesChart,
  BalanceChart,
  ExpensesByCategoryChart,
  StatCard,
} from '../components/AnalyticsCharts';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [residentBalances, setResidentBalances] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Carregar dados
      const [expenses, incomes, residents] = await Promise.all([
        expenseService.listExpenses(1000),
        incomeService.listIncomes(1000),
        residentService.listResidents(1000),
      ]);

      // Calcular analytics
      const analyticsData = calculateAnalytics(expenses, incomes);
      const balances = calculateResidentBalances(expenses, residents);

      setAnalytics(analyticsData);
      setResidentBalances(balances);
    } catch (err) {
      setError('Erro ao carregar dados de analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados de analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Relatórios & Analytics</h1>
          <p className="text-gray-600 mt-2">Análise completa das suas finanças</p>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="💰"
            title="Receita Total"
            value={formatCurrency(analytics.totalIncome)}
            color="from-green-400 to-green-600"
          />
          <StatCard
            icon="💸"
            title="Despesa Total"
            value={formatCurrency(analytics.totalExpenses)}
            color="from-red-400 to-red-600"
          />
          <StatCard
            icon="📈"
            title="Balanço"
            value={formatCurrency(analytics.balance)}
            color={analytics.balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-yellow-400 to-yellow-600'}
          />
          <StatCard
            icon="📅"
            title="Média Mensal"
            value={formatCurrency(analytics.averageMonthlyIncome - analytics.averageMonthlyExpense)}
            color="from-purple-400 to-purple-600"
          />
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <IncomeVsExpensesChart data={analytics.monthlyData} />
          <ExpensesByCategoryChart data={analytics.expensesByCategory} />
        </div>

        {/* Balanço mensal */}
        <div className="mb-8">
          <BalanceChart data={analytics.monthlyData} />
        </div>

        {/* Detalhes financeiros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📋 Resumo Financeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Receita Média Mensal</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(analytics.averageMonthlyIncome)}
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-sm text-gray-600">Despesa Média Mensal</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(analytics.averageMonthlyExpense)}
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-600">Economia Média Mensal</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(
                  analytics.averageMonthlyIncome - analytics.averageMonthlyExpense
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Detalhes de meses */}
        {analytics.monthlyData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📅 Histórico Mensal</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-4 font-semibold text-gray-700">Mês</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-700">Receita</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-700">Despesa</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-700">Balanço</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyData.map((month: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{formatMonthName(month.month)}</td>
                      <td className="text-right py-3 px-4 text-green-600 font-semibold">
                        {formatCurrency(month.income)}
                      </td>
                      <td className="text-right py-3 px-4 text-red-600 font-semibold">
                        {formatCurrency(month.expenses)}
                      </td>
                      <td
                        className={`text-right py-3 px-4 font-semibold ${
                          month.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        {formatCurrency(month.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detalhes por residente */}
        {residentBalances.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">👥 Balanço por Residente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {residentBalances.map((resident, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <p className="font-semibold text-gray-800">{resident.name}</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deve:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(resident.totalOwed)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pagou:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(resident.totalPaid)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-600 font-semibold">Balanço:</span>
                      <span
                        className={`font-bold text-lg ${
                          resident.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        {formatCurrency(resident.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Formata nome do mês
 */
const formatMonthName = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};
