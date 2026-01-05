'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInscriptionStore } from '@/lib/hooks/useInscriptionStore';
import { useAuth } from '@/lib/hooks/useAuth';
import StepIndicator from '@/components/forms/StepIndicator';
import Etape1Enfant from '@/components/forms/Etape1Enfant';
import Etape2Parents from '@/components/forms/Etape2Parents';
import Etape3Medicale from '@/components/forms/Etape3Medicale';
import Etape4Documents from '@/components/forms/Etape4Documents';
import Etape5Recapitulatif from '@/components/forms/Etape5Recapitulatif';
import type { FormulaireEtape1, FormulaireEtape2, FormulaireEtape3, FormulaireEtape4 } from '@/types';
import { createBrowserClient } from '@/lib/supabase/client';
import { generateNuméroDemande } from '@/lib/utils/format';
import Alert from '@/components/ui/Alert';

const STEPS = [
  { number: 1, title: 'Enfant', description: 'Informations de l\'enfant' },
  { number: 2, title: 'Parents', description: 'Coordonnées des parents' },
  { number: 3, title: 'Médical', description: 'Informations médicales' },
  { number: 4, title: 'Documents', description: 'Pièces justificatives' },
  { number: 5, title: 'Validation', description: 'Récapitulatif' },
];

export default function NouvelleInscriptionPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const {
    formulaireDonnees,
    setEtape1,
    setEtape2,
    setEtape3,
    setEtape4,
    setEtapeActuelle,
    setDemandeId,
    updateDerniereSauvegarde,
  } = useInscriptionStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Auto-save toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (formulaireDonnees.demande_id) {
        updateDerniereSauvegarde();
        console.log('Auto-save:', new Date().toISOString());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formulaireDonnees.demande_id, updateDerniereSauvegarde]);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNext1 = (data: FormulaireEtape1) => {
    setEtape1(data);
    setEtapeActuelle(2);
  };

  const handleNext2 = (data: FormulaireEtape2) => {
    setEtape2(data);
    setEtapeActuelle(3);
  };

  const handleNext3 = (data: FormulaireEtape3) => {
    setEtape3(data);
    setEtapeActuelle(4);
  };

  const handleNext4 = (data: FormulaireEtape4) => {
    setEtape4(data);
    setEtapeActuelle(5);
  };

  const handlePrevious = () => {
    setEtapeActuelle(Math.max(1, formulaireDonnees.etape_actuelle - 1));
  };

  const handleEdit = (etape: number) => {
    setEtapeActuelle(etape);
  };

  const uploadFile = async (file: File, demande_id: string, type: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${demande_id}/${type}_${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('inscriptions-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('inscriptions-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      let parentId = profile?.parent?.id;

      // Si pas de profil parent, en créer un
      if (!parentId && user) {
        console.log('Création du profil parent...');
        const { data: newParent, error: createError } = await supabase
          .from('parents')
          .insert({
            user_id: user.id,
            nom: user.user_metadata?.nom || '',
            prenom: user.user_metadata?.prenom || '',
            telephone: user.user_metadata?.telephone || '',
            email: user.email || '',
          })
          .select()
          .single();

        if (createError) {
          console.log('Erreur création parent, tentative récupération...', createError.message);
          // Peut-être que le profil existe déjà, essayons de le récupérer
          const { data: existingParent, error: fetchError } = await supabase
            .from('parents')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (existingParent) {
            parentId = existingParent.id;
          } else {
            throw new Error(`Impossible de créer ou récupérer le profil parent: ${createError.message}`);
          }
        } else {
          parentId = newParent.id;
        }
      }

      if (!parentId) {
        throw new Error('Profil parent non trouvé. Veuillez vous reconnecter.');
      }

      console.log('Parent ID:', parentId);

      // 1. Créer la demande d'inscription
      const numeroDemande = generateNuméroDemande();
      console.log('Création demande...', numeroDemande);
      const { data: demande, error: demandeError } = await supabase
        .from('demandes_inscription')
        .insert({
          numero_demande: numeroDemande,
          parent_id: parentId,
          classe_souhaitee: formulaireDonnees.etape1!.classe_souhaitee,
          statut: 'en_attente',
          date_soumission: new Date().toISOString(),
        })
        .select()
        .single();

      if (demandeError) {
        throw new Error(`Erreur création demande: ${demandeError.message}`);
      }

      console.log('Demande créée:', demande.id);
      setDemandeId(demande.id);

      // 2. Insérer les informations de l'élève
      console.log('Insertion élève...');
      const { error: eleveError } = await supabase.from('eleves').insert({
        demande_id: demande.id,
        nom: formulaireDonnees.etape1!.nom,
        prenom: formulaireDonnees.etape1!.prenom,
        date_naissance: formulaireDonnees.etape1!.date_naissance,
        lieu_naissance: formulaireDonnees.etape1!.lieu_naissance,
        sexe: formulaireDonnees.etape1!.sexe,
      });

      if (eleveError) {
        throw new Error(`Erreur insertion élève: ${eleveError.message}`);
      }

      // 3. Insérer les informations des parents
      console.log('Insertion infos parents...');
      const { error: parentsError } = await supabase
        .from('informations_parents')
        .insert({
          demande_id: demande.id,
          ...formulaireDonnees.etape2,
        });

      if (parentsError) {
        throw new Error(`Erreur insertion infos parents: ${parentsError.message}`);
      }

      // 4. Insérer les informations médicales
      console.log('Insertion infos médicales...');
      const { error: medicaleError } = await supabase
        .from('informations_medicales')
        .insert({
          demande_id: demande.id,
          ...formulaireDonnees.etape3,
        });

      if (medicaleError) {
        throw new Error(`Erreur insertion infos médicales: ${medicaleError.message}`);
      }

      // 5. Upload des documents (optionnel - on continue même si ça échoue)
      console.log('Upload documents...');
      if (formulaireDonnees.etape4) {
        try {
          if (formulaireDonnees.etape4.acte_naissance) {
            const url = await uploadFile(
              formulaireDonnees.etape4.acte_naissance,
              demande.id,
              'acte_naissance'
            );
            await supabase.from('documents').insert({
              demande_id: demande.id,
              type_document: 'acte_naissance',
              nom_fichier: formulaireDonnees.etape4.acte_naissance.name,
              url_storage: url,
              taille_fichier: formulaireDonnees.etape4.acte_naissance.size,
              uploaded_by: 'parent',
            });
          }

          if (formulaireDonnees.etape4.certificat_vaccination) {
            const url = await uploadFile(
              formulaireDonnees.etape4.certificat_vaccination,
              demande.id,
              'certificat_vaccination'
            );
            await supabase.from('documents').insert({
              demande_id: demande.id,
              type_document: 'certificat_vaccination',
              nom_fichier: formulaireDonnees.etape4.certificat_vaccination.name,
              url_storage: url,
              taille_fichier: formulaireDonnees.etape4.certificat_vaccination.size,
              uploaded_by: 'parent',
            });
          }

          if (formulaireDonnees.etape4.justificatif_domicile) {
            const url = await uploadFile(
              formulaireDonnees.etape4.justificatif_domicile,
              demande.id,
              'justificatif_domicile'
            );
            await supabase.from('documents').insert({
              demande_id: demande.id,
              type_document: 'justificatif_domicile',
              nom_fichier: formulaireDonnees.etape4.justificatif_domicile.name,
              url_storage: url,
              taille_fichier: formulaireDonnees.etape4.justificatif_domicile.size,
              uploaded_by: 'parent',
            });
          }

          if (formulaireDonnees.etape4.bulletins) {
            const url = await uploadFile(
              formulaireDonnees.etape4.bulletins,
              demande.id,
              'bulletins'
            );
            await supabase.from('documents').insert({
              demande_id: demande.id,
              type_document: 'bulletins',
              nom_fichier: formulaireDonnees.etape4.bulletins.name,
              url_storage: url,
              taille_fichier: formulaireDonnees.etape4.bulletins.size,
              uploaded_by: 'parent',
            });
          }
        } catch (uploadErr: any) {
          console.warn('Erreur upload documents (non bloquant):', uploadErr.message);
        }
      }

      // 6. Rediriger vers la page de confirmation
      console.log('Succès! Redirection...');
      router.push(`/inscription/confirmation?numero=${numeroDemande}`);
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.message || 'Une erreur est survenue lors de la soumission de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nouvelle demande d'inscription</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Complétez le formulaire en 5 étapes simples. Vos données sont automatiquement
            sauvegardées.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <StepIndicator steps={STEPS} currentStep={formulaireDonnees.etape_actuelle} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Forms */}
        <div className="animate-fade-in">
          {formulaireDonnees.etape_actuelle === 1 && (
            <Etape1Enfant defaultValues={formulaireDonnees.etape1} onNext={handleNext1} />
          )}

          {formulaireDonnees.etape_actuelle === 2 && (
            <Etape2Parents
              defaultValues={formulaireDonnees.etape2}
              onNext={handleNext2}
              onPrevious={handlePrevious}
            />
          )}

          {formulaireDonnees.etape_actuelle === 3 && (
            <Etape3Medicale
              defaultValues={formulaireDonnees.etape3}
              onNext={handleNext3}
              onPrevious={handlePrevious}
            />
          )}

          {formulaireDonnees.etape_actuelle === 4 && (
            <Etape4Documents
              defaultValues={formulaireDonnees.etape4}
              onNext={handleNext4}
              onPrevious={handlePrevious}
            />
          )}

          {formulaireDonnees.etape_actuelle === 5 && (
            <Etape5Recapitulatif
              donnees={formulaireDonnees}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              onEdit={handleEdit}
            />
          )}
        </div>

        {/* Last Save Info */}
        {formulaireDonnees.derniere_sauvegarde && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Dernière sauvegarde : {new Date(formulaireDonnees.derniere_sauvegarde).toLocaleTimeString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
}
