import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { Expense } from '../services/expenseService';

const ExpensesPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
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
          <h1 className="text-2xl font-bold text-blue-600">💰 Despesas</h1>
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
        <ExpenseForm
          expense={editingExpense}
          onSuccess={() => {
            setEditingExpense(undefined);
            setRefreshKey(k => k + 1);
          }}
          onCancel={() => setEditingExpense(undefined)}
        />

        {/* List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Todas as Despesas</h2>
          <ExpenseList
            key={refreshKey}
            onEdit={setEditingExpense}
            onRefresh={() => setRefreshKey(k => k + 1)}
          />
        </div>
      </main>
    </div>
  );
};

export default ExpensesPage;
