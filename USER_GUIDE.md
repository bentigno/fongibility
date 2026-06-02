# Guide d'utilisation - Fongibility

## Démarrage

### Avec Docker (Recommandé)

```bash
chmod +x start.sh
./start.sh up
```

Puis ouvrez:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080/api

### Utilisateurs de test

| Rôle | Username | Mot de passe | Permission |
|------|----------|-------------|-----------|
| Opérateur | `operateur1` | `password` | Créer, modifier, transmettre |
| Opérateur | `operateur2` | `password` | Créer, modifier, transmettre |
| Responsable | `responsable1` | `password` | Valider, rejeter |
| Admin | `admin` | `admin123` | Configuration |

## Écran d'accueil

À la connexion, l'écran affiche:
- Section de l'utilisateur connecté
- Rôle(s) de l'utilisateur
- Liste des transactions

## Créer une transaction

### 1. Saisie du DÉBIT

1. Cliquez sur **"Nouvelle Transaction"**
2. Complétez la **partie DÉBIT**:

| Champ | Description |
|-------|------------|
| **Groupe** | Numéro de groupe (ex: 1) |
| **Programme** | Sélectionner parmi la liste |
| **Catégorie** | Sélectionner (3, 4, 5 ou 6) |
| **Chapitre** | Sélectionner parmi la liste |
| **Montant AE** | Montant d'autorisation d'engagement |
| **Montant CP** | Montant de crédit de paiement |

3. Cliquez **"Ajouter ligne"** pour ajouter d'autres lignes

### 2. Saisie du CRÉDIT

1. Complétez la **partie CRÉDIT**:
2. Saisissez le **même numéro de groupe** (ex: 1)
   - ✅ **Programme et catégorie se remplissent automatiquement**
3. Complétez:
   - Action
   - Activité
   - Nature économique
   - Chapitre
   - Montants

### 3. Validation

1. Vérifiez l'égalité: **Total CP Débit = Total CP Crédit**
2. Cliquez **"Enregistrer Transaction"**
   - ✅ **Numéro unique généré automatiquement**
   - ✅ **Transaction transmise pour validation**

## Consulter les transactions

### Liste des transactions

L'historique affiche toutes les transactions:
- Numéro unique
- Date de création
- Type
- Montant
- Statut (Transmise/Validée)

### Filtrage

Filtrez par:
- **Date**: Date de création
- **Statut**: Brouillon, Transmise, Validée, Rejetée
- **Montant**: Plage de montants

## Validation (Responsable)

### Consulter les transactions transmises

1. Connectez-vous en tant que **responsable**
2. Voir les transactions **"Transmise"**

### Valider une transaction

1. Cliquez sur la transaction
2. Vérifiez tous les détails
3. Cliquez **"Valider"**
   - ✅ Status = **Validée**
   - ✅ Verrouillée: ne peut plus être modifiée

### Rejeter une transaction

1. Cliquez sur la transaction
2. Cliquez **"Rejeter"**
   - ⬅️ Retour à l'opérateur
   - 📝 Peut être modifiée

### Ajouter un commentaire

1. Écrivez votre commentaire
2. Cliquez **"Ajouter commentaire"**
3. Les commentaires sont visibles par l'opérateur

## Édition et modification

### Opérateur

- ✅ Peut modifier ses transactions en **brouillon**
- ✅ Peut modifier ses transactions **rejetées**
- ❌ Ne peut pas modifier les transactions **validées**

### Responsable

- ✅ Peut consulter toutes les transactions
- ✅ Peut valider/rejeter
- ❌ Ne peut pas modifier les montants

## Export et rapports

### Exporter une transaction

1. Sélectionnez la transaction
2. Cliquez **"Exporter en PDF"**
3. Sauvegardez le fichier

### Rapport par section

1. Allez dans **"Rapports"**
2. Sélectionnez votre section
3. Choisissez une plage de dates
4. Cliquez **"Générer rapport"**

Le rapport affiche:
- Nombre de transactions
- Montants totaux AE et CP
- Nombre validées/rejetées
- État des validations

## Problèmes courants

### "Les totaux débit/crédit doivent être égaux"

✅ Solution:
- Vérifiez que les montants CP du débit égalent ceux du crédit
- Utilisez une calculatrice si nécessaire

### "Groupe non trouvé au crédit"

✅ Solution:
- Vous avez saisi un groupe qui n'existe pas au débit
- Saisissez un groupe du débit existant (le programme s'auto-remplira)

### "Programme vide"

✅ Solution:
- La section n'a pas de programme associé
- Contactez l'administrateur pour ajouter des programmes

### "Transaction verrouillée"

✅ Solution:
- La transaction a été validée
- Elle ne peut plus être modifiée
- Contactez le responsable si c'est une erreur

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Ctrl + Entrée` | Soumettre le formulaire |
| `Échap` | Fermer la fenêtre |
| `Ctrl + P` | Imprimer |
| `Ctrl + S` | Enregistrer |

## Sécurité

### Bonnes pratiques

- ✅ Utilisez un mot de passe fort
- ✅ Déconnectez-vous après utilisation
- ✅ Ne partagez pas vos identifiants
- ✅ Vérifiez votre section affichée

### Perte d'accès

1. Contactez l'administrateur
2. Fournissez votre username
3. Demandez une réinitialisation de mot de passe

## Support

Pour toute question:
- **Email:** support@fongibility.gov
- **Téléphone:** +XXX-XXXX-XXXX
- **Documentation:** Consultez le README.md

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-06-02
