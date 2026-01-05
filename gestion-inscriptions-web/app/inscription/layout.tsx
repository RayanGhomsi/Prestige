'use client';

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
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié pour le formulaire */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au tableau de bord
              </Link>
            </div>

            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">École Prestige</span>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.parent?.prenom} {profile?.parent?.nom}
                </p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <Link
                href="/profil"
                className="p-2 text-gray-400 hover:text-primary-600"
                title="Mon profil"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600"
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
