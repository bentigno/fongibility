import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  sectionId: number;
  sectionLibelle: string;
  roles: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
