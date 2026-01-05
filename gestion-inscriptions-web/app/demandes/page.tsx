'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

interface Demande {
  id: string;
  statut: string;
  created_at: string;
  enfant: {
    nom: string;
    prenom: string;
    niveau_demande: string;
  };
}

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: <FileText className="h-4 w-4" /> },
  soumise: { label: 'Soumise', color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
  en_revision: { label: 'En révision', color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-4 w-4" /> },
  acceptee: { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  refusee: { label: 'Refusée', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
};

export default function DemandesPage() {
  const { user, loading: authLoading } = useAuth();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDemandes();
    }
  }, [user]);

  const fetchDemandes = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('demandes_inscription')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error.message, error.code);
        // Si la table n'existe pas ou erreur de permission, on affiche juste une liste vide
        setDemandes([]);
        return;
      }
      setDemandes(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des demandes:', error?.message || error);
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes d'inscription</h1>
          <p className="text-gray-600 mt-1">Suivez l'état de vos demandes d'inscription</p>
        </div>
        <Link href="/inscription/nouvelle">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {demandes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore soumis de demande d'inscription.
            </p>
            <Link href="/inscription/nouvelle">
              <Button>Créer une demande</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande) => {
            const statut = statutConfig[demande.statut] || statutConfig.brouillon;
            const enfant = Array.isArray(demande.enfant) ? demande.enfant[0] : demande.enfant;
            
            return (
              <Card key={demande.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {enfant?.prenom} {enfant?.nom}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {enfant?.niveau_demande || 'Niveau non spécifié'} • 
                          Créée le {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statut.color}`}>
                        {statut.icon}
                        <span className="ml-2">{statut.label}</span>
                      </span>
                      <Link href={`/inscription/${demande.id}`}>
                        <Button variant="outline" size="sm">Voir détails</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
