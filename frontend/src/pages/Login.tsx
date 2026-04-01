import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">HomeFinance</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
