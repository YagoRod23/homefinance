import React, { useState, useEffect } from 'react';
import { Resident, residentService } from '../services/residentService';

interface ResidentListProps {
  onEdit?: (resident: Resident) => void;
  onRefresh?: () => void;
}

const ResidentList: React.FC<ResidentListProps> = ({ onEdit, onRefresh }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const data = await residentService.listResidents();
      setResidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao carregar moradores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deletar este morador?')) return;
    try {
      await residentService.deleteResident(id);
      setResidents(residents.filter(r => r.id !== id));
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Falha ao deletar morador');
    }
  };

  if (loading) return <div className="text-center py-4">Carregando moradores...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;
  if (residents.length === 0)
    return <div className="text-gray-500 py-4">Nenhum morador registrado.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {residents.map((resident) => (
            <tr key={resident.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {resident.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {resident.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit?.(resident)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(resident.id)}
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

export default ResidentList;
