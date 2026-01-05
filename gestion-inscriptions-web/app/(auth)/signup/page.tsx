'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserClient } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/validators/inscription';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Créer le compte utilisateur avec les métadonnées
      // Le trigger Supabase créera automatiquement le profil parent
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nom: data.nom,
            prenom: data.prenom,
            telephone: data.telephone,
            display_name: `${data.prenom} ${data.nom}`,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <Alert variant="success" title="Compte créé avec succès !">
              Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de
              réception et cliquer sur le lien de confirmation pour activer votre compte.
              <br />
              <br />
              Redirection vers la page de connexion...
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous pour pouvoir soumettre des demandes d'inscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <Alert variant="error">{error}</Alert>}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom"
                {...register('nom')}
                error={errors.nom?.message}
                autoComplete="family-name"
                required
              />

              <Input
                label="Prénom"
                {...register('prenom')}
                error={errors.prenom?.message}
                autoComplete="given-name"
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              {...register('telephone')}
              error={errors.telephone?.message}
              placeholder="690000000"
              autoComplete="tel"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              helperText="Minimum 8 caractères avec au moins une majuscule, une minuscule et un chiffre"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              required
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                J'accepte les conditions d'utilisation et la politique de confidentialité
              </span>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Créer mon compte
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Vous avez déjà un compte ? </span>
            <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
