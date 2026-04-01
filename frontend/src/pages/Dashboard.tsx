import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { residentService } from '../services/residentService';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    residentCount: 0,
    loadingStats: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [expenses, incomes, residents] = await Promise.all([
        expenseService.listExpenses(1000),
        incomeService.listIncomes(1000),
        residentService.listResidents(1000),
      ]);

      const totalExpenses = expenses.reduce((sum, e) => sum + e.value, 0);
      const totalIncome = incomes.reduce((sum, i) => sum + i.value, 0);

      setStats({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        residentCount: residents.length,
        loadingStats: false,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loadingStats: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏡 HomeFinance</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Bem-vindo, {user?.name}!</span>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Saldo Atual</h3>
            <p
              className={`text-3xl font-bold mt-2 ${
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Total Receitas</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Total Despesas</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>

          {/* Residents Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Moradores</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.residentCount}
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expenses */}
          <div
            onClick={() => navigate('/expenses')}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-2">💰 Despesas</h2>
            <p className="text-gray-600">Gerenciar despesas e divisões</p>
            <div className="mt-4">
              <button className="text-blue-600 hover:text-blue-800 font-semibold">
                Ir para Despesas →
              </button>
            </div>
          </div>

          {/* Incomes */}
          <div
            onClick={() => navigate('/incomes')}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-2">📊 Receitas</h2>
            <p className="text-gray-600">Registrar receitas e ganhos</p>
            <div className="mt-4">
              <button className="text-green-600 hover:text-green-800 font-semibold">
                Ir para Receitas →
              </button>
            </div>
          </div>

          {/* Residents */}
          <div
            onClick={() => navigate('/residents')}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-2">👥 Moradores</h2>
            <p className="text-gray-600">Gerenciar moradores da casa</p>
            <div className="mt-4">
              <button className="text-purple-600 hover:text-purple-800 font-semibold">
                Ir para Moradores →
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="mt-6">
          <div
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all text-white"
          >
            <h2 className="text-2xl font-bold mb-2">📊 Analytics & Relatórios</h2>
            <p className="text-indigo-100">Visualize gráficos, estatísticas e relatórios detalhados</p>
            <div className="mt-4">
              <button className="text-white hover:text-indigo-100 font-semibold">
                Ver Relatórios →
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Como Usar</h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              ✓ Clique em <strong>Despesas</strong> para adicionar e gerenciar despesas da casa
            </li>
            <li>
              ✓ Use a funcionalidade de <strong>divisão automática</strong> para dividir despesas entre moradores
            </li>
            <li>
              ✓ Registre suas <strong>Receitas</strong> (salário, freelance, etc)
            </li>
            <li>
              ✓ Gerencie <strong>Moradores</strong> para dividir despesas corretamente
            </li>
            <li>
              ✓ Explore <strong>Analytics & Relatórios</strong> para entender seus gastos
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
