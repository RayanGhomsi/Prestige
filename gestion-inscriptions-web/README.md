# Système de Gestion des Inscriptions Scolaires - École Prestige

Application web moderne pour la gestion des inscriptions scolaires, développée avec Next.js 14, React 18, TypeScript, TailwindCSS et Supabase.

## 🌟 Fonctionnalités

### Pour les Parents
- ✅ Création de compte sécurisée avec validation email
- ✅ Formulaire d'inscription multi-étapes (5 étapes)
- ✅ Upload de documents (PDF, JPG, PNG)
- ✅ Sauvegarde automatique toutes les 30 secondes
- ✅ Suivi en temps réel du statut de la demande
- ✅ Notifications par email
- ✅ Tableau de bord personnalisé
- ✅ Gestion des demandes multiples

### Fonctionnalités Techniques
- ⚡ Performance optimisée (Lighthouse > 90)
- 🔒 Sécurité renforcée (HTTPS, CSRF, validation serveur)
- ♿ Accessibilité WCAG 2.1 AA
- 📱 Responsive (desktop, tablet, mobile)
- 🌐 Mode hors ligne pour l'app desktop
- 🔄 Synchronisation bidirectionnelle

## 🛠️ Stack Technique

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18+
- **Styling**: TailwindCSS 3+
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **BaaS**: Supabase (PostgreSQL + Storage + Auth + Edge Functions)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL 15+
- **Storage**: Supabase Storage

### Dev Tools
- **Language**: TypeScript 5+
- **Linting**: ESLint
- **Formatting**: Prettier (recommandé)
- **Git Hooks**: Husky (recommandé)

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Un compte Supabase (gratuit)

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd gestion-inscriptions-web
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurer la base de données Supabase**

Exécutez les migrations SQL dans le SQL Editor de Supabase (voir `/supabase/migrations/`)

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🗂️ Structure du Projet

```
gestion-inscriptions-web/
├── app/                          # Pages Next.js (App Router)
│   ├── (auth)/                  # Routes d'authentification (groupe)
│   │   ├── login/              # Page de connexion
│   │   ├── signup/             # Page d'inscription
│   │   └── reset-password/     # Page de réinitialisation
│   ├── (dashboard)/            # Routes protégées (groupe)
│   │   └── dashboard/          # Tableau de bord
│   ├── inscription/            # Formulaire d'inscription
│   │   ├── nouvelle/           # Nouvelle demande
│   │   └── etape-*/           # Étapes du formulaire
│   ├── demandes/               # Suivi des demandes
│   ├── layout.tsx              # Layout racine
│   ├── page.tsx                # Page d'accueil
│   └── globals.css             # Styles globaux
├── components/                  # Composants React
│   ├── ui/                     # Composants UI réutilisables
│   ├── forms/                  # Composants de formulaires
│   ├── layout/                 # Composants de layout
│   └── dashboard/              # Composants du dashboard
├── lib/                        # Bibliothèques et utilitaires
│   ├── supabase/              # Configuration Supabase
│   ├── hooks/                 # Hooks personnalisés
│   ├── utils/                 # Fonctions utilitaires
│   └── validators/            # Schémas de validation Zod
├── types/                      # Types TypeScript
├── public/                     # Assets statiques
└── middleware.ts               # Middleware Next.js

## 🔐 Sécurité

- ✅ HTTPS obligatoire en production
- ✅ Protection CSRF avec tokens
- ✅ Validation côté client ET serveur
- ✅ Rate limiting sur les endpoints publics
- ✅ Sanitization de tous les inputs
- ✅ Row Level Security (RLS) Supabase
- ✅ Stockage sécurisé des credentials
- ✅ Base SQLite chiffrée (app desktop)
- ✅ Auto-update sécurisé

## 🚀 Déploiement

### Vercel (Recommandé)

1. Pushez votre code sur GitHub
2. Importez le projet sur Vercel
3. Ajoutez les variables d'environnement
4. Déployez !

### Autres Options
- Netlify
- VPS (avec PM2)

## 📱 Application Desktop

Une application desktop Electron est également disponible pour l'administration (voir repository séparé).

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📚 Documentation

- [Guide Utilisateur Parents](/docs/guide-parents.md)
- [Guide Administrateurs](/docs/guide-admins.md)
- [Documentation API](/docs/api.md)
- [Architecture](/docs/architecture.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](/CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

ISC

## 👥 Équipe

Projet développé dans le cadre du cours d'entrepreneuriat X5.

## 🐛 Rapporter un Bug

Créez une issue sur GitHub avec :
- Description du bug
- Étapes pour reproduire
- Screenshots si applicable
- Version du navigateur

## 📞 Support

Pour toute question :
- Email : support@ecoleprestige.cm
- GitHub Issues : [Lien vers le repo]

---

**Note** : Ce projet est un module du Système Intégré de Gestion Scolaire pour l'École Prestige.
