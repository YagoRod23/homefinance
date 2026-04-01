import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResidentForm from '../components/ResidentForm';
import ResidentList from '../components/ResidentList';
import { Resident } from '../services/residentService';

const ResidentsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [editingResident, setEditingResident] = useState<Resident | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">👥 Moradores</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-gray-900"
            >
              ← Voltar ao Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <ResidentForm
          resident={editingResident}
          onSuccess={() => {
            setEditingResident(undefined);
            setRefreshKey(k => k + 1);
          }}
          onCancel={() => setEditingResident(undefined)}
        />

        {/* List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Todos os Moradores</h2>
          <ResidentList
            key={refreshKey}
            onEdit={setEditingResident}
            onRefresh={() => setRefreshKey(k => k + 1)}
          />
        </div>
      </main>
    </div>
  );
};

export default ResidentsPage;
