import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/ApiClient';
import { TransactionForm } from './TransactionForm';

type OperatorView = 'saisie' | 'consultation' | 'transmission';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<OperatorView>('saisie');

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

  const handleTransmit = async (id: number) => {
    try {
      await apiClient.transmitTransaction(id);
      await loadTransactions();
    } catch (err) {
      console.error('Erreur transmission transaction:', err);
      alert('Erreur lors de la transmission de la transaction');
    }
  };

  const isOperateur = user?.roles.includes('OPERATEUR_SAISIE');
  const isResponsable = user?.roles.includes('RESPONSABLE_FONCTION');

  const menuItems: { key: OperatorView; label: string }[] = [
    { key: 'saisie', label: 'Saisie / Mise à jour' },
    { key: 'consultation', label: 'Consultation / Édition' },
    { key: 'transmission', label: 'Transmission' },
  ];

  const transmissibles = transactions.filter((tx) => !tx.transmise);

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
          <>
            <nav style={styles.menu}>
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  style={{
                    ...styles.menuBtn,
                    ...(activeView === item.key ? styles.menuBtnActive : {}),
                  }}
                >
                  {item.label}
                  {item.key === 'transmission' && transmissibles.length > 0 && (
                    <span style={styles.badge}>{transmissibles.length}</span>
                  )}
                </button>
              ))}
            </nav>

            {activeView === 'saisie' && (
              <div style={styles.section}>
                <h2>Saisie / Mise à jour</h2>
                <TransactionForm />
              </div>
            )}

            {activeView === 'consultation' && (
              <div style={styles.section}>
                <h2>Consultation / Édition</h2>
                {loading ? (
                  <p>Chargement...</p>
                ) : transactions.length === 0 ? (
                  <p>Aucune transaction.</p>
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
                        <th>Actions</th>
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
                          <td>
                            {!tx.validee && (
                              <button onClick={() => setActiveView('saisie')} style={styles.btnSmall}>Éditer</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeView === 'transmission' && (
              <div style={styles.section}>
                <h2>Transmission</h2>
                {loading ? (
                  <p>Chargement...</p>
                ) : transmissibles.length === 0 ? (
                  <p>Aucune transaction à transmettre.</p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Numéro</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Montant CP</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transmissibles.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.numeroTransaction}</td>
                          <td>{new Date(tx.dateCreation).toLocaleDateString('fr-FR')}</td>
                          <td>{tx.type}</td>
                          <td>{tx.montantCP}</td>
                          <td>
                            <button onClick={() => handleTransmit(tx.id)} style={styles.btnSubmitSmall}>Transmettre</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {!isOperateur && (
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
        )}
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
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  menuBtn: {
    padding: '12px 20px',
    backgroundColor: 'white',
    color: '#343a40',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600 as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuBtnActive: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  badge: {
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 700 as const,
  },
  btnSubmitSmall: {
    padding: '6px 14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600 as const,
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
