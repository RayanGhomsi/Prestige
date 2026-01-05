import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Clock, CheckCircle, Users } from 'lucide-react';
import HomeHeader from '@/components/layout/HomeHeader';

export default async function HomePage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <HomeHeader isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Inscriptions en ligne simplifiées
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Inscrivez votre enfant à l'École Prestige en quelques minutes grâce à notre
            plateforme en ligne sécurisée et intuitive.
          </p>
          <Link href="/inscription/nouvelle">
            <Button size="lg" className="px-6 sm:px-8">
              Nouvelle inscription
            </Button>
          </Link>
        </div>
      </section>

      {/* Processus d'inscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          Comment ça marche ?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          <Card variant="elevated">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">1. Créez un compte</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Inscrivez-vous en tant que parent avec votre email
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">2. Remplissez le formulaire</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Complétez les informations et téléchargez les documents
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">3. Suivez votre demande</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Consultez le statut en temps réel depuis votre tableau de bord
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-secondary-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-600" />
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">4. Recevez la confirmation</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Nous vous notifions par email de l'avancement
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Documents requis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 bg-gray-50 rounded-lg my-8 sm:my-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
          Documents requis
        </h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Documents obligatoires</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Acte de naissance (PDF, max 2MB)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Certificat de vaccination (PDF, max 2MB)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Justificatif de domicile (PDF, max 2MB)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents optionnels</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Derniers bulletins scolaires (si applicable)</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Photo de l'enfant (JPG/PNG, max 5MB)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          Questions fréquentes
        </h3>
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-2">
                Combien de temps prend le traitement d'une demande ?
              </h4>
              <p className="text-gray-600">
                Le traitement d'une demande complète prend généralement entre 5 et 7 jours
                ouvrables. Vous serez notifié par email à chaque étape.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-2">
                Puis-je sauvegarder mon formulaire et le compléter plus tard ?
              </h4>
              <p className="text-gray-600">
                Oui ! Votre formulaire est automatiquement sauvegardé toutes les 30 secondes.
                Vous pouvez vous déconnecter et revenir à tout moment pour le compléter.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-2">
                Que faire si j'ai oublié de télécharger un document ?
              </h4>
              <p className="text-gray-600">
                Pas de panique ! Vous pouvez ajouter des documents manquants à tout moment
                depuis votre tableau de bord. L'administration vous contactera également si
                un document est manquant.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h5 className="font-semibold text-lg mb-4">École Prestige</h5>
              <p className="text-gray-400">
                Un établissement d'excellence pour l'éducation de vos enfants.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-4">Contact</h5>
              <p className="text-gray-400">
                Email: contact@ecoleprestige.cm
                <br />
                Tél: +237 6XX XX XX XX
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-4">Aide</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guide d'inscription
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 École Prestige. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
