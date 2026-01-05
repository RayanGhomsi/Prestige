'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Menu, X, Home, LogIn, UserPlus } from 'lucide-react';

interface HomeHeaderProps {
  isAuthenticated: boolean;
}

export default function HomeHeader({ isAuthenticated }: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-lg sm:text-2xl font-bold text-primary-600">École Prestige</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Mon tableau de bord</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Connexion</Button>
                </Link>
                <Link href="/signup">
                  <Button>Créer un compte</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-3" />
              Mon tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-3" />
                Connexion
              </Link>
              <Link
                href="/signup"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-3" />
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
