
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/api';


interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const savedUser = localStorage.getItem('queryai_user');
    const token = localStorage.getItem('queryai_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));

      api.get('/auth/me')
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('queryai_user', JSON.stringify(res.data.data));
        })
        .catch(() => {

          localStorage.removeItem('queryai_token');
          localStorage.removeItem('queryai_user');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data.data;

    localStorage.setItem('queryai_token', token);
    localStorage.setItem('queryai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user: userData } = res.data.data;

    localStorage.setItem('queryai_token', token);
    localStorage.setItem('queryai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('queryai_token');
    localStorage.removeItem('queryai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}



export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
