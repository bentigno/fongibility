import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/ApiClient';
import { TransactionForm } from './TransactionForm';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [opMode, setOpMode] = useState<'saisie' | 'consultation' | 'transmission'>('saisie');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      if (user?.sectionId) {
        const response = await apiClient.getTransactionsBySection(user.sectionId);
        setTransactions(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.clearToken();
    logout();
    navigate('/login');
  };

  const roles = user?.roles || [];
  const isOperateur = roles.includes('OPERATEUR_SAISIE') || roles.includes('ADMIN');
  const isResponsable = roles.includes('RESPONSABLE_FONCTION');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>Fongibility - Gestion des Transactions</h1>
          <p>Section: {user?.sectionLibelle}</p>
          <p>Utilisateur: {user?.username} ({user?.roles.join(', ')})</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
      </header>

      <div style={styles.content}>
        {isOperateur && (
          <div style={styles.section}>
            <h2>Opérateur de saisie</h2>
            <div style={styles.menu}>
              <button
                style={opMode === 'saisie' ? styles.menuBtnActive : styles.menuBtn}
                onClick={() => setOpMode('saisie')}
              >
                Saisie - Mise à jour
              </button>
              <button
                style={opMode === 'consultation' ? styles.menuBtnActive : styles.menuBtn}
                onClick={() => setOpMode('consultation')}
              >
                Consultation - Édition
              </button>
              <button
                style={opMode === 'transmission' ? styles.menuBtnActive : styles.menuBtn}
                onClick={() => setOpMode('transmission')}
              >
                Transmission
              </button>
            </div>

            {opMode === 'saisie' && (
              <div>
                <h3>Saisie / Mise à jour</h3>
                <TransactionForm />
              </div>
            )}

            {opMode === 'consultation' && (
              <div>
                <h3>Consultation / Édition</h3>
                <p>Consultez et éditez les transactions existantes ci-dessous.</p>
                {/* Réutilise la table d'historique plus bas ou ajouter un composant d'édition */}
              </div>
            )}

            {opMode === 'transmission' && (
              <div>
                <h3>Transmission</h3>
                <p>Gérez la transmission des transactions vers l'entité suivante.</p>
              </div>
            )}
          </div>
        )}

        <div style={styles.section}>
          <h2>Historique des Transactions</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Montant CP</th>
                  <th>Transmise</th>
                  <th>Validée</th>
                  {isResponsable && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.numeroTransaction}</td>
                    <td>{new Date(tx.dateCreation).toLocaleDateString('fr-FR')}</td>
                    <td>{tx.type}</td>
                    <td>{tx.montantCP}</td>
                    <td>{tx.transmise ? '✓' : '✗'}</td>
                    <td>{tx.validee ? '✓' : '✗'}</td>
                    {isResponsable && (
                      <td>
                        {tx.transmise && !tx.validee && (
                          <>
                            <button onClick={() => alert('Valider: ' + tx.id)} style={styles.btnSmall}>Valider</button>
                            <button onClick={() => alert('Rejeter: ' + tx.id)} style={styles.btnSmallDanger}>Rejeter</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  menu: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  menuBtn: {
    padding: '8px 12px',
    backgroundColor: '#e9ecef',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  menuBtnActive: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnSmall: {
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px',
  },
  btnSmallDanger: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
