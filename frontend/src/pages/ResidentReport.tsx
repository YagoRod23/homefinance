import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService, Expense } from '../services/expenseService';
import { residentService } from '../services/residentService';
import { formatCurrency } from '../services/analyticsService';

interface ResidentDetail {
  id: number;
  name: string;
  email?: string;
}

export const ResidentReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!id) {
        setError('ID do residente não fornecido');
        return;
      }

      // Carregar dados do residente
      const residentData = await residentService.getResident(parseInt(id));
      setResident(residentData);

      // Carregar todos as despesas
      const allExpenses = await expenseService.listExpenses(1000);
      setExpenses(allExpenses);
    } catch (err) {
      setError('Erro ao carregar dados do residente');
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
            <p className="text-gray-600">Carregando relatório...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/analytics')}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Voltar
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Residente não encontrado'}
          </div>
        </div>
      </div>
    );
  }

  // Filtrar despesas do residente
  const residentExpenses = expenses.filter((exp) =>
    exp.shares?.some((share) => share.resident_id === resident.id)
  );

  const filteredExpenses = residentExpenses.filter((exp) => {
    if (filter === 'paid') return exp.shares?.some((s) => s.resident_id === resident.id && s.is_settled);
    if (filter === 'unpaid')
      return exp.shares?.some((s) => s.resident_id === resident.id && !s.is_settled);
    return true;
  });

  // Calcular totals
  const totalOwed = residentExpenses.reduce(
    (sum, exp) =>
      sum +
      (exp.shares?.find((s) => s.resident_id === resident.id)?.share_value || 0),
    0
  );

  const totalPaid = residentExpenses.reduce(
    (sum, exp) =>
      sum +
      (exp.shares?.find((s) => s.resident_id === resident.id && s.is_settled)
        ?.share_value || 0),
    0
  );

  const totalUnpaid = totalOwed - totalPaid;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/analytics')}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ← Voltar para Analytics
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                {resident.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{resident.name}</h1>
                <p className="text-gray-600">{resident.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Total Devido</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalOwed)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Já Pago</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Saldo Pendente</p>
            <p
              className={`text-3xl font-bold ${
                totalUnpaid > 0 ? 'text-orange-600' : 'text-blue-600'
              }`}
            >
              {formatCurrency(totalUnpaid)}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 Filtrar Despesas</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todas ({residentExpenses.length})
            </button>
            <button
              onClick={() => setFilter('unpaid')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'unpaid'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Pendentes (
              {residentExpenses.filter((e) =>
                e.shares?.some((s) => s.resident_id === resident.id && !s.is_settled)
              ).length}
              )
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'paid'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Pagos (
              {residentExpenses.filter((e) =>
                e.shares?.some((s) => s.resident_id === resident.id && s.is_settled)
              ).length}
              )
            </button>
          </div>
        </div>

        {/* Lista de despesas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">💰 Histórico de Despesas</h3>
          </div>
          {filteredExpenses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma despesa encontrada para este filtro
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">Data</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">Categoria</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-800">Valor</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, index) => {
                    const share = expense.shares?.find(
                      (s) => s.resident_id === resident.id
                    );
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-700">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{expense.description}</td>
                        <td className="px-6 py-3 text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {formatCategoryName(expense.category)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-gray-700 font-semibold">
                          {formatCurrency(share?.share_value || 0)}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {share?.is_settled ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              ✓ Pago
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                              ⏳ Pendente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Resumo</h3>
          <p className="text-blue-800">
            {resident.name} tem{' '}
            <strong>{formatCurrency(totalUnpaid)}</strong> pendente em{' '}
            <strong>{residentExpenses.length}</strong> despesa(s).
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Formata nome de categoria
 */
const formatCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    housing: 'Moradia',
    food: 'Alimentação',
    transport: 'Transporte',
    utilities: 'Contas',
    entertainment: 'Diversão',
    health: 'Saúde',
    shopping: 'Compras',
    salary: 'Salário',
    freelance: 'Freelance',
    bonus: 'Bônus',
    other: 'Outros',
  };
  return names[category] || category;
};
