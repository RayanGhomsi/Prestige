// Types pour le système de gestion des inscriptions scolaires

export type StatutDemande =
  | 'en_attente'
  | 'en_cours'
  | 'documents_manquants'
  | 'acceptee'
  | 'refusee';

export type TypeDocument =
  | 'acte_naissance'
  | 'certificat_vaccination'
  | 'bulletins'
  | 'justificatif_domicile'
  | 'autre';

export type ClasseType =
  | 'Maternelle Petite Section'
  | 'Maternelle Moyenne Section'
  | 'Maternelle Grande Section'
  | 'CP'
  | 'CE1'
  | 'CE2'
  | 'CM1'
  | 'CM2';

export interface Parent {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Eleve {
  id: string;
  demande_id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface InformationsParents {
  id: string;
  demande_id: string;
  pere_nom: string;
  pere_prenom: string;
  pere_profession: string;
  pere_telephone: string;
  pere_email: string;
  mere_nom: string;
  mere_prenom: string;
  mere_profession: string;
  mere_telephone: string;
  mere_email: string;
  tuteur_nom?: string;
  tuteur_prenom?: string;
  tuteur_lien?: string;
  tuteur_telephone?: string;
  adresse_complete: string;
  urgence_nom: string;
  urgence_telephone: string;
  urgence_lien: string;
}

export interface InformationsMedicales {
  id: string;
  demande_id: string;
  groupe_sanguin: string;
  allergies?: string;
  maladies_chroniques?: string;
  traitements_en_cours?: string;
  medecin_nom: string;
  medecin_telephone: string;
}

export interface Document {
  id: string;
  demande_id: string;
  type_document: TypeDocument;
  nom_fichier: string;
  url_storage: string;
  taille_fichier: number;
  date_upload: string;
  uploaded_by: 'parent' | 'admin';
}

export interface DemandeInscription {
  id: string;
  numero_demande: string;
  parent_id: string;
  statut: StatutDemande;
  classe_souhaitee: ClasseType;
  date_soumission?: string;
  date_derniere_modification: string;
  traite_par?: string;
  created_at: string;
  updated_at: string;
  // Relations
  parent?: Parent;
  eleve?: Eleve;
  informations_parents?: InformationsParents;
  informations_medicales?: InformationsMedicales;
  documents?: Document[];
  historique?: HistoriqueStatut[];
  messages?: Message[];
}

export interface HistoriqueStatut {
  id: string;
  demande_id: string;
  ancien_statut: StatutDemande;
  nouveau_statut: StatutDemande;
  commentaire?: string;
  modifie_par: string;
  date_modification: string;
}

export interface Message {
  id: string;
  demande_id: string;
  expediteur_type: 'parent' | 'admin';
  expediteur_id: string;
  message: string;
  lu: boolean;
  date_envoi: string;
}

export interface Notification {
  id: string;
  user_id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  lu: boolean;
  lien?: string;
  created_at: string;
}

export interface Classe {
  id: string;
  nom: ClasseType;
  niveau: string;
  capacite_max: number;
  effectif_actuel: number;
  inscriptions_ouvertes: boolean;
  created_at: string;
  updated_at: string;
}

// Formulaire d'inscription multi-étapes
// Types inférés des schémas de validation
import type {
  Etape1FormData,
  Etape2FormData,
  Etape3FormData,
} from '@/lib/validators/inscription';

export type FormulaireEtape1 = Etape1FormData;
export type FormulaireEtape2 = Etape2FormData;
export type FormulaireEtape3 = Etape3FormData;

export interface FormulaireEtape4 {
  acte_naissance?: File;
  certificat_vaccination?: File;
  bulletins?: File;
  justificatif_domicile?: File;
}

export interface FormulaireDonnees {
  etape1?: FormulaireEtape1;
  etape2?: FormulaireEtape2;
  etape3?: FormulaireEtape3;
  etape4?: FormulaireEtape4;
  etape_actuelle: number;
  demande_id?: string;
  derniere_sauvegarde?: string;
}

// Auth types
export interface UserProfile {
  id: string;
  email: string;
  role: 'parent' | 'admin';
  parent?: Parent;
}
