import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MonthlyData, CategoryData, formatMonthName, formatCurrency } from '../services/analyticsService';

// Cores para os gráficos
const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

interface IncomeVsExpensesChartProps {
  data: MonthlyData[];
}

/**
 * Gráfico de linha: Receita vs Despesa ao longo do tempo
 */
export const IncomeVsExpensesChart = ({ data }: IncomeVsExpensesChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    month: formatMonthName(item.month),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Receita vs Despesa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            name="Receita"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            name="Despesa"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface BalanceChartProps {
  data: MonthlyData[];
}

/**
 * Gráfico de barras: Balanço mensal
 */
export const BalanceChart = ({ data }: BalanceChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    month: formatMonthName(item.month),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Balanço Mensal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Legend />
          <Bar
            dataKey="balance"
            name="Balanço"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ExpensesByCategoryChartProps {
  data: CategoryData[];
}

/**
 * Gráfico de pizza: Despesas por categoria
 */
export const ExpensesByCategoryChart = ({ data }: ExpensesByCategoryChartProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Despesas por Categoria</h3>
        <p className="text-gray-500 text-center py-12">Nenhuma despesa registrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

/**
 * Card de estatística
 */
export const StatCard = ({ icon, title, value, color }: StatCardProps) => {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-30">{icon}</div>
      </div>
    </div>
  );
};
