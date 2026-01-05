# Mode Démo - Test sans Supabase

L'application fonctionne actuellement en **mode démo** avec des valeurs d'environnement fictives.

## ✅ Ce que vous pouvez tester

### 1. Navigation et Design
- ✅ Page d'accueil : http://localhost:3002
- ✅ Interface responsive (redimensionnez la fenêtre)
- ✅ Tous les composants visuels

### 2. Formulaires (Interface uniquement)
- ✅ Formulaire de connexion : http://localhost:3002/login
- ✅ Formulaire d'inscription : http://localhost:3002/signup
- ✅ Réinitialisation mot de passe : http://localhost:3002/reset-password

### 3. Validation côté client
- ✅ Les formulaires valident les champs
- ✅ Messages d'erreur s'affichent
- ✅ Règles de validation (email, téléphone, etc.)

## ⚠️ Limitations en mode démo

Sans Supabase configuré :
- ❌ Impossible de créer un compte
- ❌ Impossible de se connecter
- ❌ Impossible de soumettre des formulaires
- ❌ Pas d'accès au tableau de bord
- ❌ Pas d'upload de fichiers

## 🚀 Pour activer toutes les fonctionnalités

### Étape 1 : Créer un projet Supabase (5 min)

1. Allez sur https://supabase.com
2. Cliquez sur "Start your project" (gratuit)
3. Créez un nouveau projet :
   - Nom : `ecole-prestige-inscriptions`
   - Mot de passe : Choisissez un mot de passe fort
   - Région : Europe West (recommandé)

### Étape 2 : Configurer la base de données (2 min)

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez TOUT le contenu de `supabase/migrations/001_initial_schema.sql`
4. Collez dans l'éditeur
5. Cliquez sur **Run** (▶️)
6. Vérifiez qu'il n'y a pas d'erreurs (tout doit être vert)

### Étape 3 : Créer le bucket Storage (1 min)

1. Allez dans **Storage** (menu gauche)
2. Cliquez sur **Create a new bucket**
3. Nom : `inscriptions-documents`
4. ✅ Cochez **Public bucket**
5. Cliquez sur **Create bucket**

### Étape 4 : Récupérer les clés (1 min)

1. Allez dans **Settings** > **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (longue clé dans "Project API keys")

### Étape 5 : Mettre à jour .env.local (30 sec)

Ouvrez le fichier `.env.local` et remplacez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-vraie-cle-ici
```

### Étape 6 : Redémarrer le serveur

Le serveur se rechargera automatiquement et l'application sera **100% fonctionnelle** ! 🎉

## 🎨 Test Visuel en Mode Démo

Même sans Supabase, vous pouvez :

### Tester le Design
```
✓ Couleurs et thème
✓ Typographie
✓ Espacement et layout
✓ Composants UI (boutons, cards, alerts)
✓ Responsive design
```

### Voir les Formulaires
```
✓ Formulaire multi-étapes (5 étapes)
✓ Validation des champs
✓ Messages d'erreur
✓ Upload de fichiers (interface)
```

### Navigation
```
✓ Header et footer
✓ Menus de navigation
✓ Redirections (vers login si non connecté)
✓ Liens entre pages
```

## 💡 Astuces

### Pour voir le formulaire d'inscription multi-étapes :

Vous pouvez temporairement désactiver la protection de route :

1. Ouvrez `middleware.ts`
2. Commentez temporairement le contenu :

```typescript
export async function middleware(request: NextRequest) {
  return NextResponse.next(); // Bypass pour démo
}
```

3. Allez sur http://localhost:3002/inscription/nouvelle
4. Vous verrez tout le formulaire !
5. N'oubliez pas de restaurer le middleware après

### Pour voir les composants UI :

Créez une page de test : `app/test/page.tsx`

```tsx
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Test des composants</h1>

      <Button>Bouton Primary</Button>
      <Button variant="outline">Bouton Outline</Button>

      <Alert variant="success">Message de succès</Alert>
      <Alert variant="error">Message d'erreur</Alert>

      <Card>
        <p>Contenu de la carte</p>
      </Card>
    </div>
  );
}
```

Accédez à : http://localhost:3002/test

## 📊 Résumé

| Fonctionnalité | Sans Supabase | Avec Supabase |
|----------------|---------------|---------------|
| Interface visuelle | ✅ | ✅ |
| Navigation | ✅ | ✅ |
| Validation formulaires | ✅ | ✅ |
| Authentification | ❌ | ✅ |
| Sauvegarde données | ❌ | ✅ |
| Upload fichiers | ❌ | ✅ |
| Tableau de bord | ❌ | ✅ |

## 🎯 Recommandation

Pour une **expérience complète** et tester toutes les fonctionnalités, prenez 10 minutes pour configurer Supabase. C'est gratuit et vous pourrez :

- ✅ Créer des comptes
- ✅ Se connecter
- ✅ Soumettre des demandes d'inscription
- ✅ Voir le tableau de bord avec données réelles
- ✅ Tester l'upload de documents
- ✅ Voir les notifications

---

**Bon test !** 🚀
