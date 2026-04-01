import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import { Income } from '../services/incomeService';

const IncomesPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
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
          <h1 className="text-2xl font-bold text-green-600">📊 Receitas</h1>
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
        <IncomeForm
          income={editingIncome}
          onSuccess={() => {
            setEditingIncome(undefined);
            setRefreshKey(k => k + 1);
          }}
          onCancel={() => setEditingIncome(undefined)}
        />

        {/* List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Todas as Receitas</h2>
          <IncomeList
            key={refreshKey}
            onEdit={setEditingIncome}
            onRefresh={() => setRefreshKey(k => k + 1)}
          />
        </div>
      </main>
    </div>
  );
};

export default IncomesPage;
