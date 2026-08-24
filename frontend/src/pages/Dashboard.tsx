import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../lib/api';

// Interface matching the backend response
interface QueryResponse {
  question: string;
  sql: string;
  results: Record<string, any>[];
  insight: string;
  executionTime: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<QueryResponse | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/query', { question });
      setResult(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to execute query');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">QueryAI</h1>
          <nav className="hidden md:flex gap-6 border-l border-gray-200 pl-6">
            <Link to="/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
            <Link to="/history" className="text-gray-500 hover:text-gray-900 transition-colors">History</Link>
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
        <span className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium">Dashboard</span>
        <Link to="/history" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">History</Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 slide-up">
        
        {/* Search Bar Section */}
        <div className="text-center space-y-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Ask your database anything.
          </h2>
          
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which product category generated the most revenue?"
              className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm text-lg transition-all pr-36"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors ${
                isLoading || !question.trim() ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Running...' : 'Run Query'}
            </button>
          </form>

          {/* Example Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button onClick={() => handleExampleClick("What are our top 5 selling products?")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
              Top 5 products
            </button>
            <button onClick={() => handleExampleClick("Which city has the highest number of customers?")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
              Customers by city
            </button>
            <button onClick={() => handleExampleClick("Show me total revenue by product category")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
              Revenue by category
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 fade-in">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Analyzing schema and generating SQL...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 fade-in">
            <h3 className="text-red-700 font-semibold mb-1">Query Failed</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && !isLoading && (
          <div className="space-y-6 fade-in">
            
            {/* AI Insight Card */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Insight
              </h3>
              <p className="text-blue-900 text-lg leading-relaxed font-medium">
                {result.insight}
              </p>
            </div>

            {/* Generated SQL */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Generated PostgreSQL</span>
                <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">{result.executionTime}ms</span>
              </div>
              <div className="p-4 bg-gray-900 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-100">
                  <code>{result.sql}</code>
                </pre>
              </div>
            </div>

            {/* Data Table */}
            {result.results.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        {Object.keys(result.results[0]).map((key) => (
                          <th key={key} className="px-6 py-4 font-semibold tracking-wider">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.results.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="px-6 py-4 whitespace-nowrap">
                              {val === null ? <span className="text-gray-400 italic">null</span> : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.results.length > 100 && (
                  <div className="p-3 text-center text-xs font-medium text-gray-500 bg-gray-50 border-t border-gray-100">
                    Showing first 100 rows
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <p className="text-gray-500 font-medium">The query executed successfully but returned 0 rows.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
