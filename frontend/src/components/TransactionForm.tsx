import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [debitLines, setDebitLines] = useState<TransactionLine[]>([]);
  const [creditLines, setCreditLines] = useState<TransactionLine[]>([]);
  const [acteNumber, setActeNumber] = useState<string>('');
  const [exercice, setExercice] = useState<number>(new Date().getFullYear());
  const [libelle, setLibelle] = useState<string>('');
  const [sourceFin, setSourceFin] = useState<string>('Fonds propres');
  const [bailleur, setBailleur] = useState<string>('Etat');
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
        exercice: exercice,
        sectionId: user?.sectionId,
        acteNumber,
        libelle,
        sourceFin,
        bailleur,
        // Ajouter les lignes de débit et crédit
        typeTransactionDebit: 'DEBIT',
        typeTransactionCredit: 'CREDIT',
      };

      await apiClient.createTransaction(transaction);
      alert('Transaction créée avec succès');
      
      // Reset form
      setDebitLines([]);
      setCreditLines([]);
      setActeNumber('');
      setLibelle('');
    } catch (err: any) {
      alert('Erreur lors de la création de la transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setDebitLines([]);
    setCreditLines([]);
    setActeNumber('');
    setLibelle('');
  };

  const handleDelete = async () => {
    if (!confirm('Confirmez-vous la suppression de cette transaction (placeholder) ?')) return;
    alert('Suppression non implémentée (placeholder)');
  };

  const handleQuit = () => {
    navigate('/');
  };

  const totalDebit = debitLines.reduce((sum, line) => sum + line.montantCP, 0);
  const totalCredit = creditLines.reduce((sum, line) => sum + line.montantCP, 0);

  return (
    <div style={styles.container}>
      <h2>Saisie de Transaction</h2>
      <div style={styles.headerArea}>
        <div style={styles.fieldRow}>
          <label style={styles.label}>N° acte :</label>
          <input style={styles.inputShort} value={acteNumber} onChange={(e) => setActeNumber(e.target.value)} />
          <label style={{...styles.label, marginLeft:16}}>Exercice :</label>
          <select value={exercice} onChange={(e) => setExercice(Number(e.target.value))}>
            {Array.from({length:5}).map((_,i)=>{
              const y = new Date().getFullYear()-2 + i;
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.label}>Libellé :</label>
          <input style={{...styles.input, flex:1}} value={libelle} onChange={(e)=>setLibelle(e.target.value)} />
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.label}>Section :</label>
          <strong style={{marginRight:12}}>{user?.sectionLibelle}</strong>
          <label style={{...styles.label, marginLeft:12}}>Source fin. :</label>
          <select value={sourceFin} onChange={(e)=>setSourceFin(e.target.value)}>
            <option>Fonds propres</option>
            <option>Budget extérieur</option>
          </select>
          <label style={{...styles.label, marginLeft:12}}>Bailleur :</label>
          <select value={bailleur} onChange={(e)=>setBailleur(e.target.value)}>
            <option>Etat</option>
            <option>Banque</option>
          </select>
        </div>
      </div>

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
          <button type="button" onClick={handleNew} style={styles.btnSecondary}>Nouveau</button>
          <button type="button" onClick={handleDelete} style={styles.btnSecondaryDanger}>Supprimer</button>
          <button type="button" onClick={handleQuit} style={styles.btnSecondary}>Quitter</button>
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
  headerArea: {
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    backgroundColor: '#fafafa',
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  label: {
    minWidth: '80px',
    fontWeight: 600,
  },
  inputShort: {
    width: '140px',
    padding: '6px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  btnSecondary: {
    padding: '10px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnSecondaryDanger: {
    padding: '10px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
