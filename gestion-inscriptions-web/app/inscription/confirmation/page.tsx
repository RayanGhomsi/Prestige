'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { useInscriptionStore } from '@/lib/hooks/useInscriptionStore';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const numeroDemande = searchParams.get('numero');
  const demandeId = searchParams.get('id');
  const { resetFormulaire } = useInscriptionStore();

  useEffect(() => {
    // Réinitialiser le formulaire après confirmation
    resetFormulaire();
  }, [resetFormulaire]);

  if (!numeroDemande) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <Card variant="elevated">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Demande soumise avec succès !
              </h1>

              {/* Numero de demande */}
              <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Votre numéro de demande</p>
                <p className="text-3xl font-bold text-primary-600">{numeroDemande}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Conservez ce numéro pour le suivi de votre demande
                </p>
              </div>

              {/* Info Alert */}
              <Alert variant="info" className="text-left mb-6">
                <div className="space-y-2">
                  <p className="font-medium">Prochaines étapes :</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Un email de confirmation vous a été envoyé</li>
                    <li>Votre demande sera examinée dans les 5-7 jours ouvrables</li>
                    <li>Vous serez notifié par email à chaque étape</li>
                    <li>Suivez l'évolution depuis votre tableau de bord</li>
                  </ol>
                </div>
              </Alert>

              {/* Info boxes */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Délai de traitement
                  </h3>
                  <p className="text-sm text-gray-600">
                    5 à 7 jours ouvrables en moyenne pour le traitement complet de votre
                    demande.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Besoin d'aide ?</h3>
                  <p className="text-sm text-gray-600">
                    Contactez-nous au +237 6XX XX XX XX ou par email à
                    contact@ecoleprestige.cm
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Home className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </Button>
                </Link>

                {demandeId && (
                  <Link href={`/demandes/${demandeId}`}>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir ma demande
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
