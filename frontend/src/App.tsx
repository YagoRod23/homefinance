import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/Expenses';
import IncomesPage from './pages/Incomes';
import ResidentsPage from './pages/Residents';
import { Analytics } from './pages/Analytics';
import { ResidentReport } from './pages/ResidentReport';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <ProtectedRoute>
                <IncomesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/residents"
            element={
              <ProtectedRoute>
                <ResidentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident-report/:id"
            element={
              <ProtectedRoute>
                <ResidentReport />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
