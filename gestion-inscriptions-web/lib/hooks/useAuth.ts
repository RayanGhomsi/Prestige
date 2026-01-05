import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data: parent, error } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (parent) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          role: 'parent',
          parent,
        });
      } else {
        // Pas de profil parent trouvé, créer un profil minimal
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          role: 'parent',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // En cas d'erreur, créer un profil minimal pour ne pas bloquer l'UI
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        role: 'parent',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
