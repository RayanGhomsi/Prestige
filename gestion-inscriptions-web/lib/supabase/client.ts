import { createBrowserClient as createClient } from '@supabase/ssr';

// Singleton pour éviter de recréer le client à chaque appel
let browserClient: ReturnType<typeof createClient> | null = null;

// Client pour les composants côté client
export const createBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }
  
  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return browserClient;
};
