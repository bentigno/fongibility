#!/bin/bash

# Script de démarrage du projet Fongibility

set -e

echo "======================================"
echo "Fongibility - Transaction Management"
echo "======================================"
echo ""

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer."
    exit 1
fi

echo "✓ Docker trouvé"
echo ""

# Options
if [ "$1" == "up" ]; then
    echo "📦 Démarrage des services..."
    docker-compose up --build
    
elif [ "$1" == "down" ]; then
    echo "🛑 Arrêt des services..."
    docker-compose down
    
elif [ "$1" == "logs" ]; then
    echo "📋 Affichage des logs..."
    docker-compose logs -f
    
elif [ "$1" == "clean" ]; then
    echo "🧹 Nettoyage complet..."
    docker-compose down -v
    echo "✓ Services arrêtés et volumes supprimés"
    
else
    echo "Usage: $0 [up|down|logs|clean]"
    echo ""
    echo "Commandes:"
    echo "  up     - Démarrer tous les services"
    echo "  down   - Arrêter tous les services"
    echo "  logs   - Afficher les logs en temps réel"
    echo "  clean  - Arrêter et nettoyer les volumes"
    echo ""
    echo "Services disponibles après démarrage:"
    echo "  Frontend:  http://localhost:3000"
    echo "  Backend:   http://localhost:8080/api"
    echo "  H2 Console: http://localhost:8080/api/h2-console"
    echo ""
    echo "Utilisateurs de test:"
    echo "  - operateur1 / password"
    echo "  - operateur2 / password"
    echo "  - responsable1 / password"
    echo "  - admin / admin123"
fi
