import React, { useState, useEffect } from 'react';
import { Expense, expenseService } from '../services/expenseService';
import { Resident, residentService } from '../services/residentService';
import { expenseCategoryOptions } from '../services/analyticsService';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<{
    description: string;
    value: string;
    date: string;
    category: string;
    type: 'fixed' | 'variable';
    resident_ids: number[];
  }>({
    description: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    category: 'food',
    type: 'variable',
    resident_ids: [],
  });
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResidents();
    if (expense) {
      setFormData({
        description: expense.description,
        value: expense.value.toString(),
        date: expense.date.split('T')[0],
        category: expense.category,
        type: expense.type as 'fixed' | 'variable',
        resident_ids: expense.shares?.map(s => s.resident_id) || [],
      });
    }
  }, [expense]);

  const loadResidents = async () => {
    try {
      const data = await residentService.listResidents();
      setResidents(data);
    } catch (err: any) {
      setError('Falha ao carregar moradores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (expense) {
        await expenseService.updateExpense(expense.id, {
          ...formData,
          value: parseFloat(formData.value),
        });
      } else {
        await expenseService.createExpense({
          ...formData,
          value: parseFloat(formData.value),
        });
      }
      onSuccess?.();
      if (!expense) setFormData({
        description: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
        category: 'food',
        type: 'variable',
        resident_ids: [],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao salvar despesa');
    } finally {
      setLoading(false);
    }
  };

  const handleResidentToggle = (residentId: number) => {
    setFormData(prev => ({
      ...prev,
      resident_ids: prev.resident_ids.includes(residentId)
        ? prev.resident_ids.filter(id => id !== residentId)
        : [...prev.resident_ids, residentId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">
        {expense ? 'Editar Despesa' : 'Adicionar Despesa'}
      </h3>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Aluguel, Supermercado..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {expenseCategoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'fixed' | 'variable',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="variable">Variável</option>
            <option value="fixed">Fixa</option>
          </select>
        </div>
      </div>

      {/* Resident selection for automatic sharing */}
      {!expense && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dividir entre moradores (opcional)
          </label>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 max-h-40 overflow-y-auto">
            {residents.map((resident) => (
              <label key={resident.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.resident_ids.includes(resident.id)}
                  onChange={() => handleResidentToggle(resident.id)}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm text-gray-700">{resident.name}</span>
              </label>
            ))}
          </div>
          {formData.resident_ids.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Despesa será dividida em {formData.resident_ids.length} partes iguais
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : expense ? 'Atualizar' : 'Adicionar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
