# Guide de Démarrage Rapide 🚀

Ce guide vous accompagne pas à pas pour mettre en place le système de gestion des inscriptions scolaires.

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✓ Node.js 18+ installé ([Télécharger](https://nodejs.org/))
- ✓ Un compte Supabase (gratuit) - [Créer un compte](https://supabase.com)
- ✓ Git installé
- ✓ Un éditeur de code (VS Code recommandé)

## 📋 Étape 1 : Installation

### 1.1 Cloner le projet
Le projet se trouve déjà dans : `C:\Users\Tempest\Documents\ecole\X5\entrepreuneriat\gestion-inscriptions-web`

### 1.2 Installer les dépendances
Ouvrez un terminal dans le dossier du projet et exécutez :
```bash
cd gestion-inscriptions-web
npm install
```

## 🗄️ Étape 2 : Configuration de Supabase

### 2.1 Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un nouveau projet :
   - Nom : `ecole-prestige-inscriptions`
   - Base de données password : Choisissez un mot de passe fort
   - Région : Choisissez la plus proche (Europe West recommended)

### 2.2 Configurer la base de données
1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez tout le contenu du fichier `supabase/migrations/001_initial_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

⚠️ **Important** : Assurez-vous qu'il n'y a pas d'erreurs. Tous les textes doivent être verts.

### 2.3 Configurer le Storage
1. Allez dans **Storage** dans le menu de gauche
2. Cliquez sur **Create a new bucket**
3. Nom du bucket : `inscriptions-documents`
4. Cochez **Public bucket**
5. Cliquez sur **Create bucket**

### 2.4 Récupérer les clés API
1. Allez dans **Settings** > **API**
2. Copiez :
   - **Project URL** (ressemble à : `https://xxxxx.supabase.co`)
   - **anon public** key (dans la section "Project API keys")

## 🔐 Étape 3 : Configuration de l'environnement

### 3.1 Créer le fichier .env.local
Dans le dossier `gestion-inscriptions-web`, créez un fichier `.env.local` avec ce contenu :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=École Prestige - Inscriptions
```

**Remplacez** `https://votre-projet.supabase.co` et `votre-cle-anon-key` par vos vraies valeurs.

## 🚀 Étape 4 : Lancer l'application

### 4.1 Mode développement
```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

### 4.2 Vérifier que tout fonctionne
1. Ouvrez http://localhost:3000 dans votre navigateur
2. Vous devriez voir la page d'accueil
3. Cliquez sur "Créer un compte"
4. Créez un compte parent de test

## 🧪 Étape 5 : Tester l'application

### Test complet du parcours utilisateur :

1. **Créer un compte parent**
   - Allez sur http://localhost:3000/signup
   - Remplissez le formulaire
   - Vérifiez votre email (ou vérifiez dans Supabase > Authentication)

2. **Se connecter**
   - Email et mot de passe du compte créé
   - Vous arrivez sur le dashboard

3. **Créer une demande d'inscription**
   - Cliquez sur "Nouvelle inscription"
   - Complétez les 5 étapes :
     - Étape 1 : Informations de l'enfant
     - Étape 2 : Informations des parents
     - Étape 3 : Informations médicales
     - Étape 4 : Upload des documents
     - Étape 5 : Validation

4. **Vérifier dans Supabase**
   - Allez dans Table Editor > demandes_inscription
   - Vous devriez voir votre demande

## 📊 Étape 6 : Vérifier les données (Supabase)

Dans Supabase, vérifiez que les tables contiennent des données :

- **Table `parents`** : Votre profil parent
- **Table `demandes_inscription`** : Votre demande
- **Table `eleves`** : Informations de l'élève
- **Table `documents`** : Les documents uploadés
- **Storage > inscriptions-documents** : Les fichiers PDF/images

## 🐛 Dépannage

### Problème : "Cannot connect to Supabase"
- Vérifiez que les variables dans `.env.local` sont correctes
- Vérifiez que votre projet Supabase est actif
- Redémarrez le serveur de développement (`npm run dev`)

### Problème : "Table does not exist"
- Retournez dans SQL Editor
- Réexécutez le script `001_initial_schema.sql`

### Problème : "Permission denied"
- Vérifiez les RLS policies dans Supabase
- Dans Authentication, assurez-vous que l'email est confirmé

### Problème : Upload de fichiers ne fonctionne pas
- Vérifiez que le bucket `inscriptions-documents` existe
- Vérifiez qu'il est **public**

## 📁 Structure du Projet Créé

```
gestion-inscriptions-web/
├── app/                    # Pages Next.js 14 (App Router)
│   ├── (auth)/            # Authentification (login, signup)
│   ├── (dashboard)/       # Tableau de bord protégé
│   ├── inscription/       # Formulaire d'inscription
│   ├── demandes/          # Suivi des demandes
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI (Button, Input, Card...)
│   └── forms/            # Formulaires multi-étapes
├── lib/                  # Logique métier
│   ├── supabase/        # Configuration Supabase
│   ├── hooks/           # Hooks React personnalisés
│   ├── utils/           # Fonctions utilitaires
│   └── validators/      # Validation Zod
├── types/               # Types TypeScript
├── supabase/           # Migrations SQL
└── public/             # Assets statiques
```

## ✨ Fonctionnalités Implémentées

✅ **Authentification complète**
- Inscription parent
- Connexion
- Réinitialisation de mot de passe
- Gestion de session

✅ **Formulaire d'inscription multi-étapes**
- 5 étapes avec validation
- Sauvegarde automatique
- Navigation avant/arrière
- Récapitulatif avant soumission

✅ **Upload de documents**
- Validation des types de fichiers
- Limite de taille
- Barres de progression
- Stockage Supabase

✅ **Tableau de bord**
- Vue d'ensemble des demandes
- Statistiques
- Filtres et recherche
- Notifications

✅ **Sécurité**
- Row Level Security (RLS)
- Validation serveur et client
- Protection CSRF
- Sessions sécurisées

## 🌐 Déploiement en Production

### Option 1 : Vercel (Recommandé)
1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub
3. Ajoutez les variables d'environnement
4. Déployez !

### Option 2 : Netlify
1. Créez un compte sur [netlify.com](https://netlify.com)
2. Importez votre projet
3. Configurez les variables d'environnement
4. Déployez !

⚠️ **N'oubliez pas** de mettre à jour `NEXT_PUBLIC_APP_URL` avec votre URL de production.

## 📚 Prochaines Étapes

Maintenant que l'application est fonctionnelle, vous pouvez :

1. **Personnaliser l'apparence**
   - Modifier les couleurs dans `tailwind.config.ts`
   - Ajouter le logo de l'école dans `public/`

2. **Ajouter des fonctionnalités**
   - Gestion des notifications par email (via Resend ou SendGrid)
   - Export des demandes en PDF
   - Système de messagerie interne

3. **Optimiser les performances**
   - Ajouter du caching
   - Optimiser les images
   - Lazy loading

4. **Tests**
   - Tests unitaires avec Jest
   - Tests E2E avec Playwright
   - Tests d'accessibilité

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Consultez la console du navigateur (F12)
2. Vérifiez les logs Supabase
3. Lisez la documentation Next.js et Supabase

## 🎉 Félicitations !

Vous avez maintenant un système de gestion des inscriptions scolaires complet et fonctionnel !

L'application est prête à être utilisée et déployée en production.

---

**Développé avec** ❤️ **pour l'École Prestige**
