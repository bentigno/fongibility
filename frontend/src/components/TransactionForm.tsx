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
  const [expandedDebitIdx, setExpandedDebitIdx] = useState<number | null>(null);
  const [expandedCreditIdx, setExpandedCreditIdx] = useState<number | null>(null);

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

  const currentDate = new Date().toLocaleDateString('fr-FR');

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div><strong>Prénoms & Nom</strong> : {user?.fullName || 'N/A'}</div>
          <div><strong>Code</strong> : {user?.code || 'OPSCM50010'}</div>
          <div><strong>Fonction</strong> : OPÉRATEUR DE SAISIE DU BUDGET DU MINISTÈRE</div>
        </div>
        <div style={styles.topBarRight}>
          <div><strong>Ministère</strong> : Ministère de l'Education Nationale</div>
          <div><strong>Date</strong> : {currentDate}</div>
        </div>
      </div>

      <div style={styles.formCard}>
        <div style={styles.acteHeader}>
          <div style={styles.acteTitle}>Acte rectificatif</div>
          <div style={styles.fieldRow}>
            <label style={styles.label}>N° acte :</label>
            <input style={styles.inputShort} value={acteNumber} onChange={(e) => setActeNumber(e.target.value)} />
            <label style={{...styles.label, marginLeft: 16}}>Exercice :</label>
            <select value={exercice} onChange={(e) => setExercice(Number(e.target.value))} style={styles.selectShort}>
              {Array.from({length: 5}).map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          <div style={styles.fieldRow}>
            <label style={styles.label}>Libellé :</label>
            <input style={{...styles.input, flex: 1}} value={libelle} onChange={(e) => setLibelle(e.target.value)} />
          </div>

          <div style={styles.fieldRow}>
            <label style={styles.label}>Section :</label>
            <span style={styles.readonlyField}>{user?.sectionLibelle || 'Section'}</span>
            <label style={{...styles.label, marginLeft: 16}}>Source fin. :</label>
            <select value={sourceFin} onChange={(e) => setSourceFin(e.target.value)} style={styles.selectShort}>
              <option>Fonds propres</option>
              <option>Budget extérieur</option>
            </select>
            <label style={{...styles.label, marginLeft: 16}}>Bailleur :</label>
            <select value={bailleur} onChange={(e) => setBailleur(e.target.value)} style={styles.selectShort}>
              <option>Etat</option>
              <option>Banque</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.doubleSection}>
            <div style={styles.sectionBox}>
              <div style={styles.sectionHeader}>Débit</div>
              
              {debitLines.map((line, idx) => (
                <div key={idx} style={styles.lineForm}>
                  <div style={styles.lineHeader} onClick={() => setExpandedDebitIdx(expandedDebitIdx === idx ? null : idx)}>
                    <span style={styles.lineTitle}>Ligne {idx + 1}</span>
                    <span style={styles.expandIcon}>{expandedDebitIdx === idx ? '▼' : '▶'}</span>
                  </div>
                  
                  {expandedDebitIdx === idx && (
                    <div style={styles.lineContent}>
                      {/* Ligne 1 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Groupe</label>
                          <input 
                            type="number" 
                            value={line.groupe} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].groupe = Number(e.target.value);
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Groupe"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Programme</label>
                          <div style={styles.inputWithButton}>
                            <input 
                              type="text" 
                              value={line.programme} 
                              onChange={(e) => {
                                const newLines = [...debitLines];
                                newLines[idx].programme = e.target.value;
                                setDebitLines(newLines);
                              }} 
                              style={styles.formInput} 
                              placeholder="Programme"
                            />
                            <button type="button" style={styles.ellipsisBtn}>...</button>
                          </div>
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Catégorie dépense</label>
                          <input 
                            type="text" 
                            value={line.categorie} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].categorie = e.target.value;
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Catégorie"
                          />
                        </div>
                      </div>

                      {/* Ligne 2 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Action</label>
                          <input 
                            type="text" 
                            value={line.action} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].action = e.target.value;
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Action"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Activité</label>
                          <input 
                            type="text" 
                            value={line.activite} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].activite = e.target.value;
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Activité"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Nature économique</label>
                          <input 
                            type="text" 
                            value={line.nature} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].nature = e.target.value;
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Nature"
                          />
                        </div>
                      </div>

                      {/* Ligne 3 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Chapitre</label>
                          <input 
                            type="text" 
                            value={line.chapitre} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].chapitre = e.target.value;
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Chapitre"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Montant AE</label>
                          <input 
                            type="number" 
                            value={line.montantAE} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].montantAE = Number(e.target.value);
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="0"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Montant CP</label>
                          <input 
                            type="number" 
                            value={line.montantCP} 
                            onChange={(e) => {
                              const newLines = [...debitLines];
                              newLines[idx].montantCP = Number(e.target.value);
                              setDebitLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div style={styles.lineActions}>
                        <button 
                          type="button" 
                          onClick={() => {
                            setDebitLines(debitLines.filter((_, i) => i !== idx));
                            setExpandedDebitIdx(null);
                          }} 
                          style={styles.deleteCellBtn}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddDebitLine} 
                style={styles.addLineBtn}
              >
                + Ajouter une ligne
              </button>

              <div style={styles.totalRow}>
                <span>Total :</span>
                <input style={styles.totalInput} value={totalDebit} readOnly />
              </div>
              <div style={styles.sectionFooter}>Programme</div>
            </div>

            <div style={styles.sectionBox}>
              <div style={styles.sectionHeader}>Crédit</div>
              
              {creditLines.map((line, idx) => (
                <div key={idx} style={styles.lineForm}>
                  <div style={styles.lineHeader} onClick={() => setExpandedCreditIdx(expandedCreditIdx === idx ? null : idx)}>
                    <span style={styles.lineTitle}>Ligne {idx + 1}</span>
                    <span style={styles.expandIcon}>{expandedCreditIdx === idx ? '▼' : '▶'}</span>
                  </div>
                  
                  {expandedCreditIdx === idx && (
                    <div style={styles.lineContent}>
                      {/* Ligne 1 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Groupe</label>
                          <input 
                            type="number" 
                            value={line.groupe} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].groupe = Number(e.target.value);
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Groupe"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Programme</label>
                          <div style={styles.inputWithButton}>
                            <input 
                              type="text" 
                              value={line.programme} 
                              onChange={(e) => {
                                const newLines = [...creditLines];
                                newLines[idx].programme = e.target.value;
                                setCreditLines(newLines);
                              }} 
                              style={styles.formInput} 
                              placeholder="Programme"
                            />
                            <button type="button" style={styles.ellipsisBtn}>...</button>
                          </div>
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Catégorie dépense</label>
                          <input 
                            type="text" 
                            value={line.categorie} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].categorie = e.target.value;
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Catégorie"
                          />
                        </div>
                      </div>

                      {/* Ligne 2 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Action</label>
                          <input 
                            type="text" 
                            value={line.action} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].action = e.target.value;
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Action"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Activité</label>
                          <input 
                            type="text" 
                            value={line.activite} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].activite = e.target.value;
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Activité"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Nature économique</label>
                          <input 
                            type="text" 
                            value={line.nature} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].nature = e.target.value;
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Nature"
                          />
                        </div>
                      </div>

                      {/* Ligne 3 */}
                      <div style={styles.gridRow}>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Chapitre</label>
                          <input 
                            type="text" 
                            value={line.chapitre} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].chapitre = e.target.value;
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="Chapitre"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Montant AE</label>
                          <input 
                            type="number" 
                            value={line.montantAE} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].montantAE = Number(e.target.value);
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="0"
                          />
                        </div>
                        <div style={styles.formField}>
                          <label style={styles.fieldLabel}>Montant CP</label>
                          <input 
                            type="number" 
                            value={line.montantCP} 
                            onChange={(e) => {
                              const newLines = [...creditLines];
                              newLines[idx].montantCP = Number(e.target.value);
                              setCreditLines(newLines);
                            }} 
                            style={styles.formInput} 
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div style={styles.lineActions}>
                        <button 
                          type="button" 
                          onClick={() => {
                            setCreditLines(creditLines.filter((_, i) => i !== idx));
                            setExpandedCreditIdx(null);
                          }} 
                          style={styles.deleteCellBtn}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddCreditLine} 
                style={styles.addLineBtn}
              >
                + Ajouter une ligne
              </button>

              <div style={styles.totalRow}>
                <span>Total :</span>
                <input style={styles.totalInput} value={totalCredit} readOnly />
              </div>
              <div style={styles.sectionFooter}>Programme</div>
            </div>
          </div>

          <div style={styles.primaryButtonRow}>
            <button type="submit" disabled={loading} style={styles.btnSubmit}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button type="button" onClick={handleNew} style={styles.btnSecondary}>Nouveau</button>
            <button type="button" onClick={handleDelete} style={styles.btnSecondaryDanger}>Supprimer</button>
            <button type="button" onClick={handleQuit} style={styles.btnSecondary}>Quitter</button>
          </div>
        </form>
      </div>
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#1f3f93',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  topBarLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  topBarRight: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    textAlign: 'right' as const,
  },
  formCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '18px',
    backgroundColor: '#fefefe',
  },
  acteHeader: {
    border: '1px solid #b0b0b0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: '#f8f9fa',
  },
  acteTitle: {
    fontSize: '16px',
    fontWeight: 700 as const,
    marginBottom: '12px',
  },
  selectShort: {
    width: '120px',
    padding: '6px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  readonlyField: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  doubleSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  sectionBox: {
    border: '1px solid #b0b0b0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fdfdfd',
  },
  sectionHeader: {
    fontWeight: 700 as const,
    marginBottom: '12px',
  },
  inputWithButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ellipsisBtn: {
    width: '36px',
    height: '34px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    backgroundColor: '#e9ecef',
    cursor: 'pointer',
  },
  deleteCellBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    cursor: 'pointer',
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  totalInput: {
    width: '140px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'right' as const,
    backgroundColor: '#e9ecef',
  },
  sectionFooter: {
    marginTop: '12px',
    padding: '8px 12px',
    borderTop: '1px solid #ddd',
    color: '#495057',
  },
  lineForm: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  lineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'background-color 0.2s',
  },
  lineTitle: {
    fontWeight: 600 as const,
    color: '#333',
  },
  expandIcon: {
    fontSize: '12px',
    color: '#666',
  },
  lineContent: {
    padding: '16px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #ddd',
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '13px',
    fontWeight: 600 as const,
    color: '#333',
  },
  formInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  lineActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #ddd',
  },
  addLineBtn: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600 as const,
    marginBottom: '12px',
  },
  primaryButtonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap' as const,
  },
};
