# Guide de développement

## Lancer localement

### Prérequis
- Java 17+
- Node.js 18+
- Maven 3.9+

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`

### Frontend

Dans un autre terminal:

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

## Dépannage

### Erreur: Port déjà utilisé

```bash
# Trouver le processus
lsof -i :8080
lsof -i :3000

# Arrêter le processus
kill -9 <PID>
```

### Erreur: Base de données

```bash
# Réinitialiser H2
rm ~/.h2.db

# Ou pour PostgreSQL
docker exec postgres dropdb fongibility
docker exec postgres createdb fongibility
```

### Erreur CORS

Vérifier la configuration CORS dans:
- `SecurityConfig.java` (backend)
- `vite.config.ts` (frontend proxy)

## Tests

### Backend (JUnit)
```bash
cd backend
mvn test
```

### Frontend (Vitest)
```bash
cd frontend
npm test
```

## Production

### Docker
```bash
docker-compose up -d --build

# Vérifier les services
docker-compose ps
```

### Configuration
- JWT secret: Changer en production
- CORS origins: Lister les domaines autorisés
- Base de données: Utiliser PostgreSQL
- HTTPS: Configurer

## IDE

### VS Code
Extensions recommandées:
- Extension Pack for Java
- Spring Boot Extension Pack
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin

### IntelliJ IDEA
- Intégration native Spring Boot
- Débogage intégré
- Refactoring avancé

## Commit conventions

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage du code
refactor: refactorisation
perf: amélioration performance
test: tests
chore: maintenance
```

## Structure des branches

- `main`: Production-ready
- `develop`: Développement principal
- `feature/xxx`: Nouvelles fonctionnalités
- `bugfix/xxx`: Corrections de bugs
- `hotfix/xxx`: Correctifs urgents

## Documentation API

API Swagger/OpenAPI:
```
http://localhost:8080/api/swagger-ui.html
```

À implémenter: Ajouter dépendance Springdoc-openapi
