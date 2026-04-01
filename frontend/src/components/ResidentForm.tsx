import React, { useState, useEffect } from 'react';
import { Resident, residentService } from '../services/residentService';

interface ResidentFormProps {
  resident?: Resident;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ resident, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.name,
        email: resident.email || '',
      });
    }
  }, [resident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (resident) {
        await residentService.updateResident(resident.id, formData);
      } else {
        await residentService.createResident(formData);
      }
      onSuccess?.();
      if (!resident) setFormData({
        name: '',
        email: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao salvar morador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">
        {resident ? 'Editar Morador' : 'Adicionar Morador'}
      </h3>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nome do morador"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (opcional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email do morador"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : resident ? 'Atualizar' : 'Adicionar'}
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

export default ResidentForm;
