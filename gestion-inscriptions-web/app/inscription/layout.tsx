'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { ArrowLeft, LogOut, Settings } from 'lucide-react';

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié pour le formulaire */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back button - adapté pour mobile */}
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Retour au tableau de bord</span>
                <span className="ml-2 sm:hidden">Retour</span>
              </Link>
            </div>

            {/* Logo - centré sur mobile */}
            <Link href="/dashboard" className="absolute left-1/2 transform -translate-x-1/2 sm:relative sm:left-auto sm:transform-none">
              <span className="text-lg sm:text-xl font-bold text-primary-600">École Prestige</span>
            </Link>

            {/* Right side - adapté pour mobile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.parent?.prenom} {profile?.parent?.nom}
                </p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <Link
                href="/profil"
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Mon profil"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      {children}
    </div>
  );
}
