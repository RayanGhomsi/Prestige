'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import type { DemandeInscription, StatutDemande } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [demandes, setDemandes] = useState<DemandeInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    en_cours: 0,
    acceptees: 0,
    refusees: 0,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    if (profile) {
      fetchDemandes();
    } else if (!authLoading) {
      // Si pas de profil et auth terminé, arrêter le loading
      setLoading(false);
    }
  }, [profile, authLoading]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);

      // Si pas de parent_id, on ne peut pas charger les demandes
      if (!profile?.parent?.id) {
        setDemandes([]);
        setStats({
          total: 0,
          en_attente: 0,
          en_cours: 0,
          acceptees: 0,
          refusees: 0,
        });
        return;
      }

      const { data, error } = await supabase
        .from('demandes_inscription')
        .select('*, eleves(nom, prenom)')
        .eq('parent_id', profile.parent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDemandes(data || []);

      // Calculer les statistiques
      const newStats = {
        total: data?.length || 0,
        en_attente: data?.filter((d: DemandeInscription) => d.statut === 'en_attente').length || 0,
        en_cours: data?.filter((d: DemandeInscription) => d.statut === 'en_cours').length || 0,
        acceptees: data?.filter((d: DemandeInscription) => d.statut === 'acceptee').length || 0,
        refusees: data?.filter((d: DemandeInscription) => d.statut === 'refusee').length || 0,
      };

      setStats(newStats);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut: StatutDemande) => {
    const variants: Record<StatutDemande, { variant: any; icon: any }> = {
      en_attente: { variant: 'warning', icon: Clock },
      en_cours: { variant: 'info', icon: AlertCircle },
      documents_manquants: { variant: 'warning', icon: FileText },
      acceptee: { variant: 'success', icon: CheckCircle },
      refusee: { variant: 'danger', icon: XCircle },
    };

    const config = variants[statut];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statut.replace(/_/g, ' ')}
      </Badge>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue{profile?.parent ? `, ${profile.parent.prenom} ${profile.parent.nom}` : ''}
          </p>
        </div>
        <Link href="/inscription/nouvelle">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.en_attente}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-blue-600">{stats.en_cours}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-3xl font-bold text-green-600">{stats.acceptees}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes demandes d'inscription</CardTitle>
        </CardHeader>
        <CardContent>
          {demandes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de demande d'inscription</p>
              <Link href="/inscription/nouvelle">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une demande
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {demandes.map((demande) => {
                const eleve = (demande as any).eleves
                  ? (Array.isArray((demande as any).eleves) ? (demande as any).eleves[0] : (demande as any).eleves)
                  : null;
                return (
                  <div
                    key={demande.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {eleve ? `${eleve.prenom} ${eleve.nom}` : demande.numero_demande}
                          </h3>
                          {getStatutBadge(demande.statut)}
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Classe souhaitée :</span>{' '}
                            {demande.classe_souhaitee}
                          </p>
                          <p>
                            <span className="font-medium">Date de soumission :</span>{' '}
                            {demande.date_soumission
                              ? formatDate(demande.date_soumission)
                              : 'Brouillon'}
                          </p>
                        </div>
                      </div>
                      <Link href={`/demandes/${demande.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aide rapide */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe est disponible pour répondre à toutes vos questions concernant le
              processus d'inscription.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email :</span> contact@ecoleprestige.cm
              </p>
              <p>
                <span className="font-medium">Téléphone :</span> +237 6XX XX XX XX
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Vérifiez régulièrement le statut de vos demandes
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Répondez rapidement aux demandes de documents
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                Consultez votre email pour les notifications
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
