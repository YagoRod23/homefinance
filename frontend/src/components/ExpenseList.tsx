import React, { useState, useEffect } from 'react';
import { Expense, expenseService } from '../services/expenseService';

interface ExpenseListProps {
  onEdit?: (expense: Expense) => void;
  onRefresh?: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit, onRefresh }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.listExpenses();
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete expense');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) return <div className="text-center py-4">Carregando despesas...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;
  if (expenses.length === 0)
    return <div className="text-gray-500 py-4">Nenhuma despesa registrada.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                {formatCurrency(expense.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {expense.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.type === 'fixed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {expense.type === 'fixed' ? 'Fixa' : 'Variável'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit?.(expense)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
