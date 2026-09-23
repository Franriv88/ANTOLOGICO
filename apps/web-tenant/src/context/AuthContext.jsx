import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('at_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('at_user');
    return raw ? JSON.parse(raw) : null;
  });

  function login(newToken, newUser) {
    localStorage.setItem('at_token', newToken);
    localStorage.setItem('at_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem('at_token');
    localStorage.removeItem('at_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
