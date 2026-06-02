import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/ApiClient';
import { useAuthStore } from '../store/authStore';

interface LoginForm {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(form.username, form.password);
      const { token, user } = response.data;
      
      apiClient.setToken(token);
      login(token, user);
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Fongibility</h1>
        <p style={styles.subtitle}>Gestion des Transactions Budgétaires</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center' as const,
    color: '#666',
    marginBottom: '30px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: 'bold' as const,
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
};
