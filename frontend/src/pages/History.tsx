import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import axios from 'axios';

interface QueryHistoryItem {
  id: string;
  question: string;
  generated_sql: string;
  result: any[];
  insight: string;
  created_at: string;
}

export default function History() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        setHistory(res.data.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to fetch history');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">QueryAI</h1>
          <nav className="hidden md:flex gap-6 border-l border-gray-200 pl-6">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
            <Link to="/history" className="text-gray-900 font-medium">History</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden md:inline">
            <span className="font-medium text-gray-900">{user?.name}</span>
          </span>
          <button 
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden flex gap-4 px-4 py-3 bg-white border-b border-gray-100">
        <Link to="/dashboard" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Dashboard</Link>
        <span className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium">History</span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 slide-up">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Query History</h2>
          <p className="text-gray-500 text-sm mt-1">View your past questions and AI insights.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <p className="text-red-600">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-500 font-medium mb-4">You haven't asked any questions yet.</p>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">"{item.question}"</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Insight
                  </h4>
                  <p className="text-gray-700 font-medium">{item.insight}</p>
                </div>

                <div className="bg-gray-900 p-3 rounded-xl overflow-x-auto border border-gray-800">
                  <pre className="text-xs font-mono text-gray-300">
                    <code>{item.generated_sql}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
