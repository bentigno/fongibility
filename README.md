# Fongibility - Système de Gestion des Transactions Budgétaires

## Vue d'ensemble

Fongibility est une application web moderne construite avec **Spring Boot** (backend) et **React** (frontend) pour la gestion des transactions budgétaires. Elle supporte un système de double saisie (débit/crédit) avec validation par deux profils d'utilisateurs.

## Architecture

### Backend
- **Spring Boot 3.1.5** - Framework Java
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Accès aux données
- **JWT** - Tokens d'authentification
- **H2 Database** (développement) / **PostgreSQL** (production)
- **Maven** - Gestion des dépendances

### Frontend
- **React 18** - Interface utilisateur
- **TypeScript** - Type-safe
- **Vite** - Build tool
- **Axios** - Client HTTP
- **Zustand** - Gestion d'état
- **React Router** - Navigation

## Entités principales

### 1. **Section** (SEC)
- Code, libellé, abréviation
- Dates d'effet/fin
- Statut de validité
- Type

### 2. **Programme** (PRO)
- Associé à une section
- Code, libellé, description
- Statut, validité
- Plusieurs actions par programme

### 3. **Action-Activité** (COP)
- Hiérarchie: Programme → Action → Activité
- Codes uniques, libellés
- Dates d'effet/fin

### 4. **Catégorie de Dépense** (CADE)
- Codes (3, 4, 5, 6)
- Hiérarchie parent/enfant

### 5. **Nature Économique** (NAT)
- Code, libellé, type
- Hiérarchie parent/enfant

### 6. **Chapitre** (CHAP)
- Associé à une section
- Code, libellé
- Statuts d'enregistrement/validation

### 7. **Transaction** (DBAT)
- Double saisie: Débit + Crédit
- Montants AE (Autorisation d'Engagement) et CP (Crédit de Paiement)
- Statuts: Transmise, Validée
- Groupes pour mapper débit/crédit

## Flux de transaction

### 1. **Saisie (Opérateur de saisie)**
- Saisit les informations DÉBIT (groupe, programme, catégorie, action, activité, nature, chapitre, montants)
- Saisit les informations CRÉDIT (groupe reprend le même numéro)
  - Programme et catégorie sont **auto-remplis** depuis le débit
  - Complète action, activité, nature, chapitre, montants
- Vérifie l'égalité des totaux débit/crédit
- Enregistre la transaction → **Numéro unique généré**
- Transmet pour validation

### 2. **Validation (Responsable de fonction)**
- Consulte les transactions transmises
- Valide ou rejette
- Ajoute ses commentaires

### 3. **Consultat-Édition**
- Tous les rôles peuvent consulter
- Opérateur peut éditer ses brouillons
- Responsable peut commenter

## Profils utilisateurs

### 1. **Opérateur de saisie** (OPERATEUR_SAISIE)
- ✓ Créer et modifier transactions (brouillon)
- ✓ Consulter/éditer transactions
- ✓ Transmettre pour validation
- ✓ Voir l'historique

### 2. **Responsable de fonction financière** (RESPONSABLE_FONCTION)
- ✓ Consulter transactions
- ✓ Valider transactions
- ✓ Rejeter transactions
- ✓ Ajouter commentaires

## Structure du projet

```
fongibility/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/fongibility/
│       │   ├── entity/          (Entités JPA)
│       │   ├── repository/      (Repositories)
│       │   ├── service/         (Services métier)
│       │   ├── controller/      (APIs REST)
│       │   ├── dto/             (DTOs)
│       │   └── config/          (Sécurité, JWT)
│       └── resources/
│           └── application.yml
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   ├── index.html
│   └── src/
│       ├── components/          (Composants React)
│       ├── api/                 (Client API)
│       ├── store/               (État Zustand)
│       ├── App.tsx
│       └── main.tsx
├── docker-compose.yml
└── README.md
```

## Installation et démarrage

### Option 1: Avec Docker Compose (Recommandé)

```bash
cd /workspaces/fongibility
docker-compose up --build
```

Puis accédez à:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- H2 Console: http://localhost:8080/api/h2-console

### Option 2: Localement

#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend (dans un autre terminal)
```bash
cd frontend
npm install
npm run dev
```

## Utilisateurs de test

Les utilisateurs de test doivent être créés. Voici un script d'initialisation (à ajouter à `DataInitializer`):

```java
// Créer les rôles
Role roleOperateur = roleRepository.save(new Role(1L, "OPERATEUR_SAISIE", "Opérateur de saisie"));
Role roleResponsable = roleRepository.save(new Role(2L, "RESPONSABLE_FONCTION", "Responsable de fonction"));

// Créer une section
Section section = sectionRepository.save(new Section(1L, "50", "Ministère de l'Éducation", "MIN_ED", ...));

// Créer des utilisateurs de test
User operateur = new User();
operateur.setUsername("operateur1");
operateur.setEmail("operateur1@example.com");
operateur.setPassword(passwordEncoder.encode("password"));
operateur.setSection(section);
operateur.setRoles(Set.of(roleOperateur));
userRepository.save(operateur);

User responsable = new User();
responsable.setUsername("responsable1");
responsable.setEmail("responsable1@example.com");
responsable.setPassword(passwordEncoder.encode("password"));
responsable.setSection(section);
responsable.setRoles(Set.of(roleResponsable));
userRepository.save(responsable);
```

## API Endpoints

### Authentification
- `POST /auth/login` - Connexion

### Sections
- `GET /sections` - Lister toutes les sections
- `GET /sections/{id}` - Détails d'une section
- `POST /sections` - Créer (Admin)

### Programmes
- `GET /programmes` - Lister
- `GET /programmes/section/{sectionId}` - Par section
- `POST /programmes` - Créer

### Actions
- `GET /actions/programme/{programmeId}` - Par programme
- `POST /actions` - Créer

### Activités
- `GET /activites/action/{actionId}` - Par action
- `POST /activites` - Créer

### Transactions
- `GET /transactions/section/{sectionId}` - Par section
- `POST /transactions` - Créer
- `POST /transactions/{id}/transmit` - Transmettre (Opérateur)
- `POST /transactions/{id}/validate` - Valider (Responsable)
- `POST /transactions/{id}/reject` - Rejeter (Responsable)

## Configuration

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fongibility
    username: fongibility_user
    password: fongibility_pass
  jpa:
    hibernate:
      ddl-auto: create-drop

app:
  jwt:
    secret: your-secret-key-change-in-production
    expiration: 86400000  # 24 heures
```

### Frontend (vite.config.ts)
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}
```

## Sécurité

- ✓ JWT pour authentification
- ✓ Bcrypt pour hachage des mots de passe
- ✓ CORS configuré
- ✓ Autorisation par rôle (@PreAuthorize)
- ✓ Validation des entrées
- ✓ Session stateless

## Points clés d'implémentation

### Groupe Débit/Crédit
- L'opérateur saisit un **numéro de groupe** au débit
- Au crédit, il saisit le même **numéro de groupe**
- Programme et catégorie sont **automatiquement reportés** du débit
- Permet la correspondance ligne-à-ligne

### Totaux
- Les totaux CP (Crédit de Paiement) doivent être **égaux** en débit et crédit
- Validation côté frontend et backend

### Auto-remplissage
- Lorsqu'un groupe de crédit est saisi, récupère les données du débit correspondant
- Pré-remplit programme et catégorie

### Numéros de transaction
- Format: `DBAT-{UUID8}` (ex: `DBAT-ABC12345`)
- Généré automatiquement à la création
- Unique en base de données

## Prochaines étapes

1. ✅ Créer DataInitializer pour charger les données de test
2. ✅ Implémenter la recherche/filtrage des transactions
3. ✅ Ajouter des rapports/statistiques
4. ✅ Implémenter le multi-langue
5. ✅ Audit trail complet
6. ✅ Export PDF/Excel

## Support

Pour toute question ou problème, consultez la documentation Spring Boot et React officielles.

---

**Version:** 1.0.0  
**Date:** 2026-06-02