import React, { useState, useEffect } from 'react';
import { Income, incomeService } from '../services/incomeService';

interface IncomeListProps {
  onEdit?: (income: Income) => void;
  onRefresh?: () => void;
}

const IncomeList: React.FC<IncomeListProps> = ({ onEdit, onRefresh }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      const data = await incomeService.listIncomes();
      setIncomes(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deletar esta receita?')) return;
    try {
      await incomeService.deleteIncome(id);
      setIncomes(incomes.filter(i => i.id !== id));
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Falha ao deletar receita');
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

  if (loading) return <div className="text-center py-4">Carregando receitas...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;
  if (incomes.length === 0)
    return <div className="text-gray-500 py-4">Nenhuma receita registrada.</div>;

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
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incomes.map((income) => (
            <tr key={income.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {income.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                +{formatCurrency(income.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(income.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {income.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit?.(income)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(income.id)}
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

export default IncomeList;
