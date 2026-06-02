# Architecture globale

## Structure générale

### Backend Spring Boot
- **Port:** 8080
- **API Base URL:** `/api`
- **Base de données:** H2 (dev) / PostgreSQL (prod)
- **Authentification:** JWT tokens
- **CORS:** Activé pour `http://localhost:3000`

### Frontend React
- **Port:** 3000
- **Build:** Vite
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Router:** React Router v6

## Entités et relations

```
Section (1) ──── (N) Programme
  │
  ├─── (N) Chapitre
  └─── (N) Transaction

Programme (1) ──── (N) Action
  │
  └─── (N) Transaction

Action (1) ──── (N) Activite
  │
  └─── (N) Transaction

Activite (1) ──── (N) Transaction

Chapitre (N) ──── (1) Transaction

NatureEconomique (1) ──── (N) Transaction

CategorieDepense (N) ──── (M) Programme

Section (1) ──── (N) User

Role (N) ──── (M) User
```

## Modèle de sécurité

### Authentification
- Username/Password → JWT Token
- Token durée: 24 heures
- Stocké en localStorage (frontend)
- Validé à chaque requête

### Autorisation
- Role-based: `@PreAuthorize("hasRole('...')")`
- Deux rôles principaux:
  - `OPERATEUR_SAISIE`: Crée/modifie/transmet
  - `RESPONSABLE_FONCTION`: Valide/rejette
  - `ADMIN`: Configuration

## Flux de transaction détaillé

### Création
1. Opérateur saisit groupe débit (ex: 1)
2. Sélectionne programme → charge ses actions
3. Sélectionne action → charge ses activités
4. Sélectionne activité
5. Sélectionne nature économique
6. Sélectionne chapitre
7. Saisit montants AE et CP
8. Ajoute ligne au tableau

### Crédit (même groupe)
1. Opérateur saisit même groupe (ex: 1)
2. Programme et catégorie **auto-remplis**
3. Complète action, activité, nature, chapitre, montants
4. Validation: totaux CP débit = crédit

### Transmission
1. Clic "Enregistrer"
2. Validation des totaux
3. Création de la transaction (numéro généré)
4. Statut: `transmise=true, validee=false`

### Validation (Responsable)
1. Consulte transactions transmises
2. Clic "Valider" ou "Rejeter"
3. Si validée: `validee=true`
4. Si rejetée: `transmise=false, validee=false`

## Points techniques importants

### Génération du numéro de transaction
```java
String numeroTransaction = "DBAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
// Exemple: DBAT-A1B2C3D4
```

### Synchronisation Débit/Crédit
```typescript
// Au frontend: si groupe existe au débit
if (debitLines.find(line => line.groupe === enteredGroup)) {
  const debitLine = debitLines.find(line => line.groupe === enteredGroup);
  creditLine.programme = debitLine.programme;  // Auto-rempli
  creditLine.categorie = debitLine.categorie;  // Auto-rempli
}
```

### Validation totaux
```java
BigDecimal debitTotal = transactionLines.stream()
  .filter(line -> line.getGroupeDebit() != null)
  .map(line -> line.getMontantCP())
  .reduce(BigDecimal.ZERO, BigDecimal::add);

BigDecimal creditTotal = transactionLines.stream()
  .filter(line -> line.getGroupeCredit() != null)
  .map(line -> line.getMontantCP())
  .reduce(BigDecimal.ZERO, BigDecimal::add);

if (!debitTotal.equals(creditTotal)) {
  throw new ValidationException("Totaux débit/crédit inégaux");
}
```

## Roadmap

### Phase 1 (Actuel)
- ✓ Entités et repositories
- ✓ Services métier
- ✓ APIs REST
- ✓ Authentification JWT
- ✓ Saisie transaction simple

### Phase 2
- [ ] Modification de transactions
- [ ] Suppression (brouillons uniquement)
- [ ] Historique complet
- [ ] Recherche/filtrage avancé

### Phase 3
- [ ] Rapports/statistiques
- [ ] Export PDF
- [ ] Audit trail
- [ ] Multi-langue

### Phase 4
- [ ] Intégration data warehouse
- [ ] Synchronisation batch
- [ ] Notifications
- [ ] API partenaires
