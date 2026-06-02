import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/ApiClient';

interface TransactionLine {
  groupe: number;
  programme: string;
  categorie: string;
  action: string;
  activite: string;
  nature: string;
  chapitre: string;
  montantAE: number;
  montantCP: number;
}

export function TransactionForm() {
  const user = useAuthStore((state) => state.user);
  const [debitLines, setDebitLines] = useState<TransactionLine[]>([]);
  const [creditLines, setCreditLines] = useState<TransactionLine[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [activites, setActivites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    try {
      if (user?.sectionId) {
        const response = await apiClient.getProgrammesBySection(user.sectionId);
        setProgrammes(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement programmes:', err);
    }
  };

  const loadActions = async (programmeId: number) => {
    try {
      const response = await apiClient.getActionsByProgramme(programmeId);
      setActions(response.data);
    } catch (err) {
      console.error('Erreur chargement actions:', err);
    }
  };

  const loadActivites = async (actionId: number) => {
    try {
      const response = await apiClient.getActivitiesByAction(actionId);
      setActivites(response.data);
    } catch (err) {
      console.error('Erreur chargement activités:', err);
    }
  };

  const handleAddDebitLine = () => {
    setDebitLines([...debitLines, { groupe: 0, programme: '', categorie: '', action: '', activite: '', nature: '', chapitre: '', montantAE: 0, montantCP: 0 }]);
  };

  const handleAddCreditLine = () => {
    setCreditLines([...creditLines, { groupe: 0, programme: '', categorie: '', action: '', activite: '', nature: '', chapitre: '', montantAE: 0, montantCP: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation: totaux doivent être égaux
      const debitTotal = debitLines.reduce((sum, line) => sum + line.montantCP, 0);
      const creditTotal = creditLines.reduce((sum, line) => sum + line.montantCP, 0);

      if (debitTotal !== creditTotal) {
        alert('Les totaux débit et crédit doivent être égaux');
        setLoading(false);
        return;
      }

      // Créer la transaction
      const transaction = {
        exercice: new Date().getFullYear(),
        sectionId: user?.sectionId,
        // Ajouter les lignes de débit et crédit
        typeTransactionDebit: 'DEBIT',
        typeTransactionCredit: 'CREDIT',
      };

      await apiClient.createTransaction(transaction);
      alert('Transaction créée avec succès');
      
      // Reset form
      setDebitLines([]);
      setCreditLines([]);
    } catch (err: any) {
      alert('Erreur lors de la création de la transaction');
    } finally {
      setLoading(false);
    }
  };

  const totalDebit = debitLines.reduce((sum, line) => sum + line.montantCP, 0);
  const totalCredit = creditLines.reduce((sum, line) => sum + line.montantCP, 0);

  return (
    <div style={styles.container}>
      <h2>Saisie de Transaction</h2>
      <p>Section: <strong>{user?.sectionLibelle}</strong></p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h3>Débit</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Programme</th>
                <th>Catégorie</th>
                <th>Chapitre</th>
                <th>Montant AE</th>
                <th>Montant CP</th>
              </tr>
            </thead>
            <tbody>
              {debitLines.map((line, idx) => (
                <tr key={idx}>
                  <td><input type="number" value={line.groupe} onChange={(e) => {
                    const newLines = [...debitLines];
                    newLines[idx].groupe = Number(e.target.value);
                    setDebitLines(newLines);
                  }} style={styles.input} /></td>
                  <td><input type="text" value={line.programme} style={styles.input} /></td>
                  <td><input type="text" value={line.categorie} style={styles.input} /></td>
                  <td><input type="text" value={line.chapitre} style={styles.input} /></td>
                  <td><input type="number" value={line.montantAE} style={styles.input} /></td>
                  <td><input type="number" value={line.montantCP} onChange={(e) => {
                    const newLines = [...debitLines];
                    newLines[idx].montantCP = Number(e.target.value);
                    setDebitLines(newLines);
                  }} style={styles.input} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddDebitLine} style={styles.btnAdd}>Ajouter ligne</button>
          <p style={styles.total}>Total CP: {totalDebit}</p>
        </div>

        <div style={styles.section}>
          <h3>Crédit</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Programme</th>
                <th>Catégorie</th>
                <th>Chapitre</th>
                <th>Montant AE</th>
                <th>Montant CP</th>
              </tr>
            </thead>
            <tbody>
              {creditLines.map((line, idx) => (
                <tr key={idx}>
                  <td><input type="number" value={line.groupe} style={styles.input} /></td>
                  <td><input type="text" value={line.programme} style={styles.input} /></td>
                  <td><input type="text" value={line.categorie} style={styles.input} /></td>
                  <td><input type="text" value={line.chapitre} style={styles.input} /></td>
                  <td><input type="number" value={line.montantAE} style={styles.input} /></td>
                  <td><input type="number" value={line.montantCP} onChange={(e) => {
                    const newLines = [...creditLines];
                    newLines[idx].montantCP = Number(e.target.value);
                    setCreditLines(newLines);
                  }} style={styles.input} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddCreditLine} style={styles.btnAdd}>Ajouter ligne</button>
          <p style={styles.total}>Total CP: {totalCredit}</p>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.btnSubmit}>
            {loading ? 'Enregistrement...' : 'Enregistrer Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
  },
  section: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  },
  btnAdd: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  total: {
    marginTop: '10px',
    fontWeight: 'bold' as const,
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  btnSubmit: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
};
