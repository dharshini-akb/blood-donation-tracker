import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Load from localStorage on mount (client-side only)
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }

      const params = new URLSearchParams(window.location.search);
      const googleToken = params.get('token');
      const googleName = params.get('name');

      if (googleToken) {
        localStorage.setItem('token', googleToken);
        localStorage.setItem('user', JSON.stringify({ name: googleName }));
        setToken(googleToken);
        setUser({ name: googleName });
        window.history.replaceState({}, document.title, "/welcome");
        setLoading(false);
        return;
      }

      if (savedToken) {
        try {
          const res = await authAPI.me();
          setUser(res.data.user);
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (data) => {
    if (!data.role) return { success: false, error: 'Please select a role' };
    if (data.role === 'Donor' && !data.bloodGroup) {
      return { success: false, error: 'Please select your blood group' };
    }
    try {
      const res = await authAPI.register(data);
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (data) => {
    if (!data.role) return { success: false, error: 'Please select a role' };
    try {
      const res = await authAPI.login(data);
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
