'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, Save, Upload, Trash2, FileText } from 'lucide-react';
import type { ClasseType } from '@/types';

const CLASSES: Array<{ value: ClasseType; label: ClasseType }> = [
  { value: 'Maternelle Petite Section', label: 'Maternelle Petite Section' },
  { value: 'Maternelle Moyenne Section', label: 'Maternelle Moyenne Section' },
  { value: 'Maternelle Grande Section', label: 'Maternelle Grande Section' },
  { value: 'CP', label: 'CP' },
  { value: 'CE1', label: 'CE1' },
  { value: 'CE2', label: 'CE2' },
  { value: 'CM1', label: 'CM1' },
  { value: 'CM2', label: 'CM2' },
];

const GROUPES_SANGUINS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export default function ModifierDemandePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [demande, setDemande] = useState<any>(null);
  const [eleve, setEleve] = useState({
    nom: '', prenom: '', date_naissance: '', lieu_naissance: '', sexe: 'M'
  });
  const [classesouhaitee, setClasseSouhaitee] = useState('');
  const [infosParents, setInfosParents] = useState({
    pere_nom: '', pere_prenom: '', pere_profession: '', pere_telephone: '', pere_email: '',
    mere_nom: '', mere_prenom: '', mere_profession: '', mere_telephone: '', mere_email: '',
    adresse_complete: '', urgence_nom: '', urgence_telephone: '', urgence_lien: ''
  });
  const [infosMedicales, setInfosMedicales] = useState({
    groupe_sanguin: '', allergies: '', maladies_chroniques: '', 
    traitements_en_cours: '', medecin_nom: '', medecin_telephone: ''
  });
  const [documents, setDocuments] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<{[key: string]: File | null}>({
    acte_naissance: null,
    certificat_vaccination: null,
    justificatif_domicile: null,
    bulletins: null
  });

  useEffect(() => {
    if (user && params.id) {
      fetchData();
    }
  }, [user, params.id]);

  const fetchData = async () => {
    try {
      const demandeId = params.id as string;

      const { data: demandeData, error: demandeError } = await supabase
        .from('demandes_inscription')
        .select('*')
        .eq('id', demandeId)
        .single();

      if (demandeError || !demandeData) {
        setError('Demande non trouvée');
        return;
      }

      if (demandeData.statut !== 'en_attente') {
        setError('Cette demande ne peut plus être modifiée');
        return;
      }

      setDemande(demandeData);
      setClasseSouhaitee(demandeData.classe_souhaitee);

      const { data: eleveData } = await supabase
        .from('eleves')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      
      if (eleveData) {
        setEleve({
          nom: eleveData.nom || '',
          prenom: eleveData.prenom || '',
          date_naissance: eleveData.date_naissance || '',
          lieu_naissance: eleveData.lieu_naissance || '',
          sexe: eleveData.sexe || 'M'
        });
      }

      const { data: parentsData } = await supabase
        .from('informations_parents')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      
      if (parentsData) {
        setInfosParents({
          pere_nom: parentsData.pere_nom || '',
          pere_prenom: parentsData.pere_prenom || '',
          pere_profession: parentsData.pere_profession || '',
          pere_telephone: parentsData.pere_telephone || '',
          pere_email: parentsData.pere_email || '',
          mere_nom: parentsData.mere_nom || '',
          mere_prenom: parentsData.mere_prenom || '',
          mere_profession: parentsData.mere_profession || '',
          mere_telephone: parentsData.mere_telephone || '',
          mere_email: parentsData.mere_email || '',
          adresse_complete: parentsData.adresse_complete || '',
          urgence_nom: parentsData.urgence_nom || '',
          urgence_telephone: parentsData.urgence_telephone || '',
          urgence_lien: parentsData.urgence_lien || ''
        });
      }

      const { data: medicalesData } = await supabase
        .from('informations_medicales')
        .select('*')
        .eq('demande_id', demandeId)
        .maybeSingle();
      
      if (medicalesData) {
        setInfosMedicales({
          groupe_sanguin: medicalesData.groupe_sanguin || '',
          allergies: medicalesData.allergies || '',
          maladies_chroniques: medicalesData.maladies_chroniques || '',
          traitements_en_cours: medicalesData.traitements_en_cours || '',
          medecin_nom: medicalesData.medecin_nom || '',
          medecin_telephone: medicalesData.medecin_telephone || ''
        });
      }

      // Récupérer les documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('demande_id', demandeId);
      
      if (docsData) {
        setDocuments(docsData);
      }

    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const demandeId = params.id as string;

      // Mettre à jour la classe souhaitée
      await supabase
        .from('demandes_inscription')
        .update({ classe_souhaitee: classesouhaitee })
        .eq('id', demandeId);

      // Mettre à jour l'élève
      await supabase
        .from('eleves')
        .update(eleve)
        .eq('demande_id', demandeId);

      // Mettre à jour les infos parents
      await supabase
        .from('informations_parents')
        .update(infosParents)
        .eq('demande_id', demandeId);

      // Mettre à jour les infos médicales
      await supabase
        .from('informations_medicales')
        .update(infosMedicales)
        .eq('demande_id', demandeId);

      // Upload des nouveaux documents
      for (const [type, file] of Object.entries(newFiles)) {
        if (file) {
          await uploadDocument(demandeId, type, file);
        }
      }

      setSuccess('Modifications enregistrées avec succès');
      setTimeout(() => router.push(`/demandes/${demandeId}`), 1500);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const uploadDocument = async (demandeId: string, type: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${demandeId}/${type}_${Date.now()}.${fileExt}`;

    // Upload le fichier
    const { error: uploadError } = await supabase.storage
      .from('inscriptions-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('inscriptions-documents')
      .getPublicUrl(fileName);

    // Supprimer l'ancien document du même type s'il existe
    const existingDoc = documents.find(d => d.type_document === type);
    if (existingDoc) {
      await supabase.from('documents').delete().eq('id', existingDoc.id);
    }

    // Insérer le nouveau document
    await supabase.from('documents').insert({
      demande_id: demandeId,
      type_document: type,
      nom_fichier: file.name,
      url_storage: publicUrl,
      taille_fichier: file.size,
      uploaded_by: 'parent'
    });
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await supabase.from('documents').delete().eq('id', docId);
      setDocuments(documents.filter(d => d.id !== docId));
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const handleFileChange = (type: string, file: File | null) => {
    setNewFiles(prev => ({ ...prev, [type]: file }));
  };

  const getDocumentByType = (type: string) => {
    return documents.find(d => d.type_document === type);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !demande) {
    return (
      <div className="text-center py-12">
        <Alert variant="error">{error}</Alert>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button variant="outline">Retour au dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/demandes/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier la demande {demande?.numero_demande}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Informations de l'enfant */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'enfant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              value={eleve.nom}
              onChange={(e) => setEleve({...eleve, nom: e.target.value})}
            />
            <Input
              label="Prénom"
              value={eleve.prenom}
              onChange={(e) => setEleve({...eleve, prenom: e.target.value})}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Date de naissance"
              type="date"
              value={eleve.date_naissance}
              onChange={(e) => setEleve({...eleve, date_naissance: e.target.value})}
            />
            <Input
              label="Lieu de naissance"
              value={eleve.lieu_naissance}
              onChange={(e) => setEleve({...eleve, lieu_naissance: e.target.value})}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="M"
                    checked={eleve.sexe === 'M'}
                    onChange={(e) => setEleve({...eleve, sexe: e.target.value})}
                    className="mr-2"
                  />
                  Masculin
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="F"
                    checked={eleve.sexe === 'F'}
                    onChange={(e) => setEleve({...eleve, sexe: e.target.value})}
                    className="mr-2"
                  />
                  Féminin
                </label>
              </div>
            </div>
            <Select
              label="Classe souhaitée"
              value={classesouhaitee}
              onChange={(e) => setClasseSouhaitee(e.target.value)}
              options={CLASSES}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations des parents */}
      <Card>
        <CardHeader>
          <CardTitle>Informations des parents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Père</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Nom" value={infosParents.pere_nom} onChange={(e) => setInfosParents({...infosParents, pere_nom: e.target.value})} />
              <Input label="Prénom" value={infosParents.pere_prenom} onChange={(e) => setInfosParents({...infosParents, pere_prenom: e.target.value})} />
              <Input label="Profession" value={infosParents.pere_profession} onChange={(e) => setInfosParents({...infosParents, pere_profession: e.target.value})} />
              <Input label="Téléphone" value={infosParents.pere_telephone} onChange={(e) => setInfosParents({...infosParents, pere_telephone: e.target.value})} />
              <Input label="Email" type="email" value={infosParents.pere_email} onChange={(e) => setInfosParents({...infosParents, pere_email: e.target.value})} className="md:col-span-2" />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Mère</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Nom" value={infosParents.mere_nom} onChange={(e) => setInfosParents({...infosParents, mere_nom: e.target.value})} />
              <Input label="Prénom" value={infosParents.mere_prenom} onChange={(e) => setInfosParents({...infosParents, mere_prenom: e.target.value})} />
              <Input label="Profession" value={infosParents.mere_profession} onChange={(e) => setInfosParents({...infosParents, mere_profession: e.target.value})} />
              <Input label="Téléphone" value={infosParents.mere_telephone} onChange={(e) => setInfosParents({...infosParents, mere_telephone: e.target.value})} />
              <Input label="Email" type="email" value={infosParents.mere_email} onChange={(e) => setInfosParents({...infosParents, mere_email: e.target.value})} className="md:col-span-2" />
            </div>
          </div>
          <Textarea
            label="Adresse complète"
            value={infosParents.adresse_complete}
            onChange={(e) => setInfosParents({...infosParents, adresse_complete: e.target.value})}
            rows={2}
          />
          <div>
            <h4 className="font-medium mb-3">Contact d'urgence</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Nom" value={infosParents.urgence_nom} onChange={(e) => setInfosParents({...infosParents, urgence_nom: e.target.value})} />
              <Input label="Téléphone" value={infosParents.urgence_telephone} onChange={(e) => setInfosParents({...infosParents, urgence_telephone: e.target.value})} />
              <Input label="Lien" value={infosParents.urgence_lien} onChange={(e) => setInfosParents({...infosParents, urgence_lien: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations médicales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations médicales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Groupe sanguin"
              value={infosMedicales.groupe_sanguin}
              onChange={(e) => setInfosMedicales({...infosMedicales, groupe_sanguin: e.target.value})}
              options={GROUPES_SANGUINS}
            />
          </div>
          <Textarea label="Allergies" value={infosMedicales.allergies} onChange={(e) => setInfosMedicales({...infosMedicales, allergies: e.target.value})} rows={2} />
          <Textarea label="Maladies chroniques" value={infosMedicales.maladies_chroniques} onChange={(e) => setInfosMedicales({...infosMedicales, maladies_chroniques: e.target.value})} rows={2} />
          <Textarea label="Traitements en cours" value={infosMedicales.traitements_en_cours} onChange={(e) => setInfosMedicales({...infosMedicales, traitements_en_cours: e.target.value})} rows={2} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Médecin traitant" value={infosMedicales.medecin_nom} onChange={(e) => setInfosMedicales({...infosMedicales, medecin_nom: e.target.value})} />
            <Input label="Téléphone médecin" value={infosMedicales.medecin_telephone} onChange={(e) => setInfosMedicales({...infosMedicales, medecin_telephone: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acte de naissance */}
          <DocumentUploadField
            label="Acte de naissance"
            type="acte_naissance"
            existingDoc={getDocumentByType('acte_naissance')}
            newFile={newFiles.acte_naissance}
            onFileChange={(file) => handleFileChange('acte_naissance', file)}
            onDelete={handleDeleteDocument}
            required
          />

          {/* Certificat de vaccination */}
          <DocumentUploadField
            label="Certificat de vaccination"
            type="certificat_vaccination"
            existingDoc={getDocumentByType('certificat_vaccination')}
            newFile={newFiles.certificat_vaccination}
            onFileChange={(file) => handleFileChange('certificat_vaccination', file)}
            onDelete={handleDeleteDocument}
            required
          />

          {/* Justificatif de domicile */}
          <DocumentUploadField
            label="Justificatif de domicile"
            type="justificatif_domicile"
            existingDoc={getDocumentByType('justificatif_domicile')}
            newFile={newFiles.justificatif_domicile}
            onFileChange={(file) => handleFileChange('justificatif_domicile', file)}
            onDelete={handleDeleteDocument}
            required
          />

          {/* Bulletins scolaires */}
          <DocumentUploadField
            label="Bulletins scolaires (optionnel)"
            type="bulletins"
            existingDoc={getDocumentByType('bulletins')}
            newFile={newFiles.bulletins}
            onFileChange={(file) => handleFileChange('bulletins', file)}
            onDelete={handleDeleteDocument}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}

// Composant pour l'upload de document
function DocumentUploadField({
  label,
  type,
  existingDoc,
  newFile,
  onFileChange,
  onDelete,
  required = false
}: {
  label: string;
  type: string;
  existingDoc: any;
  newFile: File | null;
  onFileChange: (file: File | null) => void;
  onDelete: (id: string) => void;
  required?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {existingDoc && !newFile ? (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{existingDoc.nom_fichier}</span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={existingDoc.url_storage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              Voir
            </a>
            <button
              type="button"
              onClick={() => onDelete(existingDoc.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : newFile ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">{newFile.name} (nouveau)</span>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-colors">
          <div className="text-center">
            <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
            <span className="text-sm text-gray-500">Cliquez pour ajouter</span>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
