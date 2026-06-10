import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/ApiClient';

interface TransactionLine {
  groupe: number;
  programmeId: number | null;
  programme: string;
  categorieId: number | null;
  categorie: string;
  actionId: number | null;
  action: string;
  activiteId: number | null;
  activite: string;
  natureId: number | null;
  nature: string;
  chapitre: string;
  montantAE: number;
  montantCP: number;
  actions: any[];
  activites: any[];
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
  const [categories, setCategories] = useState<any[]>([]);
  const [natures, setNatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDebitIdx, setExpandedDebitIdx] = useState<number | null>(null);
  const [expandedCreditIdx, setExpandedCreditIdx] = useState<number | null>(null);

  useEffect(() => {
    loadProgrammes();
    loadCategories();
    loadNatures();
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

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  };

  const loadNatures = async () => {
    try {
      const response = await apiClient.getNatures();
      setNatures(response.data);
    } catch (err) {
      console.error('Erreur chargement natures économiques:', err);
    }
  };

  const loadActions = async (programmeId: number) => {
    try {
      const response = await apiClient.getActionsByProgramme(programmeId);
      return response.data;
    } catch (err) {
      console.error('Erreur chargement actions:', err);
      return [];
    }
  };

  const loadActivites = async (actionId: number) => {
    try {
      const response = await apiClient.getActivitiesByAction(actionId);
      return response.data;
    } catch (err) {
      console.error('Erreur chargement activités:', err);
      return [];
    }
  };

  const emptyLine = (): TransactionLine => ({
    groupe: 0,
    programmeId: null,
    programme: '',
    categorieId: null,
    categorie: '',
    actionId: null,
    action: '',
    activiteId: null,
    activite: '',
    natureId: null,
    nature: '',
    chapitre: '',
    montantAE: 0,
    montantCP: 0,
    actions: [],
    activites: [],
  });

  const updateLine = (lines: TransactionLine[], idx: number, updated: Partial<TransactionLine>) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], ...updated };
    return newLines;
  };

  const handleProgrammeChange = async (idx: number, isDebit: boolean, programmeId: number | null) => {
    const sourceLines = isDebit ? debitLines : creditLines;
    const selectedProgramme = programmes.find((p) => p.id === programmeId);
    const newLine = {
      ...sourceLines[idx],
      programmeId,
      programme: selectedProgramme?.libelle ?? '',
      categorieId: null,
      categorie: '',
      actionId: null,
      action: '',
      activiteId: null,
      activite: '',
      natureId: null,
      nature: '',
      actions: programmeId ? await loadActions(programmeId) : [],
      activites: [],
    };
    const updatedLines = updateLine(sourceLines, idx, newLine);
    isDebit ? setDebitLines(updatedLines) : setCreditLines(updatedLines);
  };

  const handleCategoryChange = async (idx: number, isDebit: boolean, categorieId: number | null) => {
    const sourceLines = isDebit ? debitLines : creditLines;
    const selectedCategory = categories.find((c) => c.id === categorieId);
    const currentLine = sourceLines[idx];
    const newLine = {
      ...currentLine,
      categorieId,
      categorie: selectedCategory?.libelle ?? '',
      actionId: null,
      action: '',
      activiteId: null,
      activite: '',
      natureId: null,
      nature: '',
      activites: [],
      actions: currentLine.programmeId ? await loadActions(currentLine.programmeId) : [],
    };
    const updatedLines = updateLine(sourceLines, idx, newLine);
    isDebit ? setDebitLines(updatedLines) : setCreditLines(updatedLines);
  };

  const handleActionChange = async (idx: number, isDebit: boolean, actionId: number | null) => {
    const sourceLines = isDebit ? debitLines : creditLines;
    const selectedAction = sourceLines[idx].actions.find((a) => a.id === actionId);
    const newLine = {
      ...sourceLines[idx],
      actionId,
      action: selectedAction?.libelle ?? '',
      activiteId: null,
      activite: '',
      natureId: null,
      nature: '',
      activites: actionId ? await loadActivites(actionId) : [],
    };
    const updatedLines = updateLine(sourceLines, idx, newLine);
    isDebit ? setDebitLines(updatedLines) : setCreditLines(updatedLines);
  };

  const handleActiviteChange = (idx: number, isDebit: boolean, activiteId: number | null) => {
    const sourceLines = isDebit ? debitLines : creditLines;
    const selectedActivite = sourceLines[idx].activites.find((a) => a.id === activiteId);
    const newLine = {
      ...sourceLines[idx],
      activiteId,
      activite: selectedActivite?.libelle ?? '',
      natureId: null,
      nature: '',
    };
    const updatedLines = updateLine(sourceLines, idx, newLine);
    isDebit ? setDebitLines(updatedLines) : setCreditLines(updatedLines);
  };

  const handleNatureChange = (idx: number, isDebit: boolean, natureId: number | null) => {
    const sourceLines = isDebit ? debitLines : creditLines;
    const selectedNature = natures.find((n) => n.id === natureId);
    const newLine = {
      ...sourceLines[idx],
      natureId,
      nature: selectedNature?.libelle ?? '',
    };
    const updatedLines = updateLine(sourceLines, idx, newLine);
    isDebit ? setDebitLines(updatedLines) : setCreditLines(updatedLines);
  };

  const handleAddDebitLine = () => {
    setDebitLines([...debitLines, emptyLine()]);
  };

  const handleAddCreditLine = () => {
    setCreditLines([...creditLines, emptyLine()]);
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
              <div style={styles.tableHeader}>
                <div>Groupe</div>
                <div>Programme</div>
                <div>Catég. dép.</div>
                <div>Montant AE</div>
                <div>Montant CP</div>
                <div>Action</div>
              </div>
              {debitLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  <div style={styles.tableRow}>
                    <input
                      type="number"
                      value={line.groupe}
                      onChange={(e) => {
                        const newLines = [...debitLines];
                        newLines[idx].groupe = Number(e.target.value);
                        setDebitLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="Groupe"
                    />
                    <div style={styles.inputWithButton}>
                      <select
                        value={line.programmeId ?? ''}
                        onChange={async (e) => {
                          const programmeId = e.target.value ? Number(e.target.value) : null;
                          await handleProgrammeChange(idx, true, programmeId);
                        }}
                        style={styles.cellInput}
                      >
                        <option value="">Sélectionner</option>
                        {programmes.map((programme) => (
                          <option key={programme.id} value={programme.id}>
                            {programme.libelle}
                          </option>
                        ))}
                      </select>
                      <button type="button" style={styles.ellipsisBtn}>...</button>
                    </div>
                    <select
                      value={line.categorieId ?? ''}
                      onChange={async (e) => {
                        const categorieId = e.target.value ? Number(e.target.value) : null;
                        await handleCategoryChange(idx, true, categorieId);
                      }}
                      style={styles.cellInput}
                    >
                      <option value="">Sélectionner</option>
                      {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>
                          {categorie.libelle}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={line.montantAE}
                      onChange={(e) => {
                        const newLines = [...debitLines];
                        newLines[idx].montantAE = Number(e.target.value);
                        setDebitLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={line.montantCP}
                      onChange={(e) => {
                        const newLines = [...debitLines];
                        newLines[idx].montantCP = Number(e.target.value);
                        setDebitLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="0"
                    />
                    <button
                      type="button"
                      onClick={() => setDebitLines(debitLines.filter((_, i) => i !== idx))}
                      style={styles.deleteLineBtn}
                    >
                      X
                    </button>
                  </div>
                  {line.categorieId && (
                    <div style={styles.hiddenSelectRow}>
                      <div style={styles.hiddenSelectField}>
                        <label style={styles.hiddenLabel}>Action</label>
                        <select
                          value={line.actionId ?? ''}
                          onChange={async (e) => {
                            const actionId = e.target.value ? Number(e.target.value) : null;
                            await handleActionChange(idx, true, actionId);
                          }}
                          style={styles.cellInput}
                          disabled={!line.categorieId}
                        >
                          <option value="">Sélectionner</option>
                          {line.actions.map((action) => (
                            <option key={action.id} value={action.id}>
                              {action.libelle}
                            </option>
                          ))}
                        </select>
                      </div>
                      {line.actionId && (
                        <div style={styles.hiddenSelectField}>
                          <label style={styles.hiddenLabel}>Activité</label>
                          <select
                            value={line.activiteId ?? ''}
                            onChange={(e) => {
                              const activiteId = e.target.value ? Number(e.target.value) : null;
                              handleActiviteChange(idx, true, activiteId);
                            }}
                            style={styles.cellInput}
                          >
                            <option value="">Sélectionner</option>
                            {line.activites.map((activite) => (
                              <option key={activite.id} value={activite.id}>
                                {activite.libelle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {line.activiteId && (
                        <div style={styles.hiddenSelectField}>
                          <label style={styles.hiddenLabel}>Nature économique</label>
                          <select
                            value={line.natureId ?? ''}
                            onChange={(e) => {
                              const natureId = e.target.value ? Number(e.target.value) : null;
                              handleNatureChange(idx, true, natureId);
                            }}
                            style={styles.cellInput}
                          >
                            <option value="">Sélectionner</option>
                            {natures.map((nature) => (
                              <option key={nature.id} value={nature.id}>
                                {nature.libelle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
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
              <div style={styles.tableHeader}>
                <div>Groupe</div>
                <div>Programme</div>
                <div>Catég. dép.</div>
                <div>Montant AE</div>
                <div>Montant CP</div>
                <div>Action</div>
              </div>
              {creditLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  <div style={styles.tableRow}>
                    <input
                      type="number"
                      value={line.groupe}
                      onChange={(e) => {
                        const newLines = [...creditLines];
                        newLines[idx].groupe = Number(e.target.value);
                        setCreditLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="Groupe"
                    />
                    <div style={styles.inputWithButton}>
                      <select
                        value={line.programmeId ?? ''}
                        onChange={async (e) => {
                          const programmeId = e.target.value ? Number(e.target.value) : null;
                          await handleProgrammeChange(idx, false, programmeId);
                        }}
                        style={styles.cellInput}
                      >
                        <option value="">Sélectionner</option>
                        {programmes.map((programme) => (
                          <option key={programme.id} value={programme.id}>
                            {programme.libelle}
                          </option>
                        ))}
                      </select>
                      <button type="button" style={styles.ellipsisBtn}>...</button>
                    </div>
                    <select
                      value={line.categorieId ?? ''}
                      onChange={async (e) => {
                        const categorieId = e.target.value ? Number(e.target.value) : null;
                        await handleCategoryChange(idx, false, categorieId);
                      }}
                      style={styles.cellInput}
                    >
                      <option value="">Sélectionner</option>
                      {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>
                          {categorie.libelle}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={line.montantAE}
                      onChange={(e) => {
                        const newLines = [...creditLines];
                        newLines[idx].montantAE = Number(e.target.value);
                        setCreditLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={line.montantCP}
                      onChange={(e) => {
                        const newLines = [...creditLines];
                        newLines[idx].montantCP = Number(e.target.value);
                        setCreditLines(newLines);
                      }}
                      style={styles.cellInput}
                      placeholder="0"
                    />
                    <button
                      type="button"
                      onClick={() => setCreditLines(creditLines.filter((_, i) => i !== idx))}
                      style={styles.deleteLineBtn}
                    >
                      X
                    </button>
                  </div>
                  {line.categorieId && (
                    <div style={styles.hiddenSelectRow}>
                      <div style={styles.hiddenSelectField}>
                        <label style={styles.hiddenLabel}>Action</label>
                        <select
                          value={line.actionId ?? ''}
                          onChange={async (e) => {
                            const actionId = e.target.value ? Number(e.target.value) : null;
                            await handleActionChange(idx, false, actionId);
                          }}
                          style={styles.cellInput}
                          disabled={!line.categorieId}
                        >
                          <option value="">Sélectionner</option>
                          {line.actions.map((action) => (
                            <option key={action.id} value={action.id}>
                              {action.libelle}
                            </option>
                          ))}
                        </select>
                      </div>
                      {line.actionId && (
                        <div style={styles.hiddenSelectField}>
                          <label style={styles.hiddenLabel}>Activité</label>
                          <select
                            value={line.activiteId ?? ''}
                            onChange={(e) => {
                              const activiteId = e.target.value ? Number(e.target.value) : null;
                              handleActiviteChange(idx, false, activiteId);
                            }}
                            style={styles.cellInput}
                          >
                            <option value="">Sélectionner</option>
                            {line.activites.map((activite) => (
                              <option key={activite.id} value={activite.id}>
                                {activite.libelle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {line.activiteId && (
                        <div style={styles.hiddenSelectField}>
                          <label style={styles.hiddenLabel}>Nature économique</label>
                          <select
                            value={line.natureId ?? ''}
                            onChange={(e) => {
                              const natureId = e.target.value ? Number(e.target.value) : null;
                              handleNatureChange(idx, false, natureId);
                            }}
                            style={styles.cellInput}
                          >
                            <option value="">Sélectionner</option>
                            {natures.map((nature) => (
                              <option key={nature.id} value={nature.id}>
                                {nature.libelle}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
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
  hiddenSelectRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '10px',
  },
  hiddenSelectField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  hiddenLabel: {
    fontSize: '12px',
    fontWeight: 600 as const,
    color: '#555',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.8fr 1.2fr 1fr 1fr 0.6fr',
    gap: '10px',
    padding: '10px 0',
    fontWeight: 700 as const,
    borderBottom: '1px solid #d8d8d8',
    color: '#333',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.8fr 1.2fr 1fr 1fr 0.6fr',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cellInput: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  deleteLineBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    cursor: 'pointer',
  },
  inputWithButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    marginTop: '10px',
  },
  primaryButtonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap' as const,
  },
};
