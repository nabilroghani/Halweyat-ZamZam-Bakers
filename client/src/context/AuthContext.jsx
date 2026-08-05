import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zamzam_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('zamzam_auth_token');
      if (token) {
        try {
          const profile = await AuthService.getMe();
          setUser(profile);
          localStorage.setItem('zamzam_user', JSON.stringify(profile));
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await AuthService.login({ email, password });
    localStorage.setItem('zamzam_auth_token', data.token);
    const userData = { _id: data._id, name: data.name, email: data.email, role: data.role, avatar: data.avatar };
    localStorage.setItem('zamzam_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('zamzam_auth_token');
    localStorage.removeItem('zamzam_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
