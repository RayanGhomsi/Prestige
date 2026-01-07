'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  User, 
  Users, 
  Heart, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit
} from 'lucide-react';

interface DemandeDetail {
  id: string;
  numero_demande: string;
  statut: string;
  classe_souhaitee: string;
  date_soumission: string;
  created_at: string;
}

interface Eleve {
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: string;
}

interface InfosParents {
  pere_nom: string;
  pere_prenom: string;
  pere_telephone: string;
  pere_email: string;
  mere_nom: string;
  mere_prenom: string;
  mere_telephone: string;
  mere_email: string;
  adresse_complete: string;
}

interface InfosMedicales {
  groupe_sanguin: string;
  allergies: string;
  maladies_chroniques: string;
  medecin_nom: string;
  medecin_telephone: string;
}

const statutConfig: Record<string, { label: string; variant: any; icon: React.ReactNode }> = {
  en_attente: { label: 'En attente', variant: 'warning', icon: <Clock className="h-4 w-4" /> },
  en_cours: { label: 'En cours', variant: 'info', icon: <AlertCircle className="h-4 w-4" /> },
  documents_manquants: { label: 'Documents manquants', variant: 'warning', icon: <FileText className="h-4 w-4" /> },
  acceptee: { label: 'Acceptée', variant: 'success', icon: <CheckCircle className="h-4 w-4" /> },
  refusee: { label: 'Refusée', variant: 'danger', icon: <XCircle className="h-4 w-4" /> },
};

export default function DemandeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [demande, setDemande] = useState<DemandeDetail | null>(null);
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [infosParents, setInfosParents] = useState<InfosParents | null>(null);
  const [infosMedicales, setInfosMedicales] = useState<InfosMedicales | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && params.id) {
      fetchDemandeDetails();
    }
  }, [user, params.id]);

  const fetchDemandeDetails = async () => {
    try {
      setLoading(true);
      const demandeId = params.id as string;

      // Récupérer la demande
      const { data: demandeData, error: demandeError } = await supabase
        .from('demandes_inscription')
        .select('*')
        .eq('id', demandeId)
        .single();

      console.log('Demande:', demandeData, demandeError?.message);
      if (demandeError) throw demandeError;
      setDemande(demandeData);

      // Récupérer l'élève
      const { data: eleveData, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      console.log('Eleve:', eleveData, eleveError?.message);
      setEleve(eleveData);

      // Récupérer les infos parents
      const { data: parentsData, error: parentsError } = await supabase
        .from('informations_parents')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      console.log('Parents:', parentsData, parentsError?.message);
      setInfosParents(parentsData);

      // Récupérer les infos médicales
      const { data: medicalesData, error: medicalesError } = await supabase
        .from('informations_medicales')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      console.log('Medicales:', medicalesData, medicalesError?.message);
      setInfosMedicales(medicalesData);

    } catch (err: any) {
      console.error('Erreur:', err);
      setError('Impossible de charger les détails de la demande');
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

  if (error || !demande) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Demande non trouvée'}</p>
        <Link href="/dashboard">
          <Button variant="outline">Retour au dashboard</Button>
        </Link>
      </div>
    );
  }

  const statut = statutConfig[demande.statut] || statutConfig.en_attente;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Demande {demande.numero_demande}
            </h1>
            <p className="text-gray-600">
              Soumise le {new Date(demande.date_soumission || demande.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {demande.statut === 'en_attente' && (
            <Link href={`/demandes/${demande.id}/modifier`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          )}
          <Badge variant={statut.variant} className="flex items-center gap-2 px-4 py-2">
            {statut.icon}
            {statut.label}
          </Badge>
        </div>
      </div>

      {/* Classe souhaitée */}
      <Card>
        <CardContent className="py-4">
          <p className="text-gray-600">
            Classe souhaitée : <span className="font-semibold text-gray-900">{demande.classe_souhaitee}</span>
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations de l'enfant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Informations de l'enfant
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eleve ? (
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Nom complet</dt>
                  <dd className="font-medium">{eleve.prenom} {eleve.nom}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Date de naissance</dt>
                  <dd className="font-medium">{new Date(eleve.date_naissance).toLocaleDateString('fr-FR')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Lieu de naissance</dt>
                  <dd className="font-medium">{eleve.lieu_naissance}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Sexe</dt>
                  <dd className="font-medium">{eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">Informations non disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Informations médicales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Informations médicales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {infosMedicales ? (
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Groupe sanguin</dt>
                  <dd className="font-medium">{infosMedicales.groupe_sanguin}</dd>
                </div>
                {infosMedicales.allergies && (
                  <div>
                    <dt className="text-sm text-gray-500">Allergies</dt>
                    <dd className="font-medium">{infosMedicales.allergies}</dd>
                  </div>
                )}
                {infosMedicales.maladies_chroniques && (
                  <div>
                    <dt className="text-sm text-gray-500">Maladies chroniques</dt>
                    <dd className="font-medium">{infosMedicales.maladies_chroniques}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Médecin traitant</dt>
                  <dd className="font-medium">{infosMedicales.medecin_nom}</dd>
                  <dd className="text-sm text-gray-600">{infosMedicales.medecin_telephone}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">Informations non disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations des parents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Informations des parents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {infosParents ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Père</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Nom</dt>
                    <dd className="font-medium">{infosParents.pere_prenom} {infosParents.pere_nom}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Téléphone</dt>
                    <dd className="font-medium">{infosParents.pere_telephone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="font-medium">{infosParents.pere_email}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Mère</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Nom</dt>
                    <dd className="font-medium">{infosParents.mere_prenom} {infosParents.mere_nom}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Téléphone</dt>
                    <dd className="font-medium">{infosParents.mere_telephone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="font-medium">{infosParents.mere_email}</dd>
                  </div>
                </dl>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm text-gray-500">Adresse</dt>
                <dd className="font-medium">{infosParents.adresse_complete}</dd>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Informations non disponibles</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
