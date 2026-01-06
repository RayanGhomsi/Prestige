import { z } from 'zod';

// Schéma de validation pour l'étape 1 - Informations sur l'enfant
export const etape1Schema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance est requis'),
  sexe: z.enum(['M', 'F'], { message: 'Le sexe est requis' }),
  classe_souhaitee: z.string().min(1, 'La classe souhaitée est requise'),
  photo: z.instanceof(File).optional(),
});

export type Etape1FormData = z.infer<typeof etape1Schema>;

// Schéma de validation pour l'étape 2 - Informations des parents
export const etape2Schema = z.object({
  pere_nom: z.string().optional().or(z.literal('')),
  pere_prenom: z.string().optional().or(z.literal('')),
  pere_profession: z.string().optional().or(z.literal('')),
  pere_telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres')
    .optional()
    .or(z.literal('')),
  pere_email: z.string().email('Email invalide').optional().or(z.literal('')),
  mere_nom: z.string().optional().or(z.literal('')),
  mere_prenom: z.string().optional().or(z.literal('')),
  mere_profession: z.string().optional().or(z.literal('')),
  mere_telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres')
    .optional()
    .or(z.literal('')),
  mere_email: z.string().email('Email invalide').optional().or(z.literal('')),
  tuteur_nom: z.string().optional(),
  tuteur_prenom: z.string().optional(),
  tuteur_lien: z.string().optional(),
  tuteur_telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres')
    .optional()
    .or(z.literal('')),
  adresse_complete: z.string().optional().or(z.literal('')),
  urgence_nom: z.string().min(2, 'Le nom de la personne à contacter est requis'),
  urgence_telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres'),
  urgence_lien: z.string().min(2, 'Le lien de parenté est requis'),
}).refine(
  (data) => {
    // Au moins un parent doit être renseigné (père ou mère)
    const pereRempli = !!(data.pere_nom && data.pere_prenom && data.pere_telephone);
    const mereRemplie = !!(data.mere_nom && data.mere_prenom && data.mere_telephone);
    return pereRempli || mereRemplie;
  },
  {
    message: 'Vous devez renseigner au moins un parent (père ou mère)',
    path: ['pere_nom'], // Afficher l'erreur sur le premier champ
  }
);

export type Etape2FormData = z.infer<typeof etape2Schema>;

// Schéma de validation pour l'étape 3 - Informations médicales
export const etape3Schema = z.object({
  groupe_sanguin: z.string().optional().or(z.literal('')),
  allergies: z.string().optional(),
  maladies_chroniques: z.string().optional(),
  traitements_en_cours: z.string().optional(),
  medecin_nom: z.string().optional().or(z.literal('')),
  medecin_telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres')
    .optional()
    .or(z.literal('')),
});

export type Etape3FormData = z.infer<typeof etape3Schema>;

// Schéma d'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const signupSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

// Validation des fichiers
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ACCEPTED_DOC_TYPES = ['application/pdf'];

export function validateFile(file: File, maxSize: number, acceptedTypes: string[]): string | null {
  if (file.size > maxSize) {
    return `Le fichier est trop volumineux. Taille maximale: ${maxSize / 1024 / 1024}MB`;
  }

  if (!acceptedTypes.includes(file.type)) {
    return `Type de fichier non accepté. Types acceptés: ${acceptedTypes.join(', ')}`;
  }

  return null;
}
