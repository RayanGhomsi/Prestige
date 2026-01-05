'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Bell, LogOut, Plus, Settings, Menu, X } from 'lucide-react';
import Button from './Button';

interface NavigationProps {
  user: any;
  profile: any;
  onSignOut: () => void;
}

export default function Navigation({ user, profile, onSignOut }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = () => {
    closeMobileMenu();
    onSignOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center" onClick={closeMobileMenu}>
              <span className="text-lg sm:text-xl font-bold text-primary-600">École Prestige</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                href="/dashboard"
                className={`px-3 py-2 text-sm font-medium flex items-center transition-colors ${
                  isActive('/dashboard')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Tableau de bord
              </Link>
              <Link
                href="/demandes"
                className={`px-3 py-2 text-sm font-medium flex items-center transition-colors ${
                  isActive('/demandes')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Mes demandes
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/inscription/nouvelle">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle inscription
              </Button>
            </Link>

            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-3">
              <Link href="/profil" className="text-right hidden lg:block hover:opacity-80">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.parent?.prenom} {profile?.parent?.nom}
                </p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </Link>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {/* Profile Info */}
          <div className="px-3 py-3 border-b border-gray-200 mb-2">
            <p className="text-sm font-medium text-gray-900">
              {profile?.parent?.prenom} {profile?.parent?.nom}
            </p>
            <p className="text-xs text-gray-500">{profile?.email}</p>
          </div>

          {/* Navigation Links */}
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Tableau de bord
          </Link>

          <Link
            href="/demandes"
            onClick={closeMobileMenu}
            className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
              isActive('/demandes')
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Mes demandes
          </Link>

          <Link
            href="/inscription/nouvelle"
            onClick={closeMobileMenu}
            className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-5 w-5 mr-3" />
            Nouvelle inscription
          </Link>

          <Link
            href="/profil"
            onClick={closeMobileMenu}
            className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 mr-3" />
            Mon profil
          </Link>

          {/* Notifications */}
          <button className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Bell className="h-5 w-5 mr-3" />
            Notifications
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              3
            </span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-200 pt-3"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
