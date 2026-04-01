import React, { useState, useEffect } from 'react';
import { Income, incomeService } from '../services/incomeService';
import { residentService } from '../services/residentService';
import { incomeCategoryOptions } from '../services/analyticsService';

interface Resident {
  id: number;
  name: string;
}

interface IncomeFormProps {
  income?: Income;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    category: 'salary',
    resident_id: '',
  });
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const data = await residentService.listResidents(100);
      setResidents(data);
    } catch (err) {
      console.error('Erro ao carregar moradores', err);
    }
  };

  useEffect(() => {
    if (income) {
      setFormData({
        description: income.description,
        value: income.value.toString(),
        date: income.date.split('T')[0],
        category: income.category,
        resident_id: income.resident_id ? income.resident_id.toString() : '',
      });
    }
  }, [income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
        resident_id: formData.resident_id ? parseInt(formData.resident_id) : undefined,
      };

      if (income) {
        await incomeService.updateIncome(income.id, {
          ...submitData,
        });
      } else {
        await incomeService.createIncome({
          ...submitData,
        });
      }
      onSuccess?.();
      if (!income) setFormData({
        description: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
        category: 'salary',
        resident_id: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao salvar receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">
        {income ? 'Editar Receita' : 'Adicionar Receita'}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: Salário, Freelance..."
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {incomeCategoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vincular a Morador (Opcional)
          </label>
          <select
            value={formData.resident_id}
            onChange={(e) =>
              setFormData({ ...formData, resident_id: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Não vincular (receita geral)</option>
            {residents.map((resident) => (
              <option key={resident.id} value={resident.id}>
                {resident.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Deixe em branco para distribuir entre todos os moradores
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : income ? 'Atualizar' : 'Adicionar'}
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

export default IncomeForm;
