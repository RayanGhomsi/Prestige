'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Home, FileText, Bell, LogOut, Plus, Settings } from 'lucide-react';

export default function DashboardLayout({
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">École Prestige</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
                <Link
                  href="/demandes"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mes demandes
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/inscription/nouvelle">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle inscription
                </Button>
              </Link>

              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              <div className="flex items-center space-x-3">
                <Link href="/profil" className="text-right hidden sm:block hover:opacity-80">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.parent?.prenom} {profile?.parent?.nom}
                  </p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </Link>
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
