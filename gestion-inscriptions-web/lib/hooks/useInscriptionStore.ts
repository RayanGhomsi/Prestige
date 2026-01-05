import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormulaireDonnees } from '@/types';

interface InscriptionStore {
  formulaireDonnees: FormulaireDonnees;
  setEtape1: (data: FormulaireDonnees['etape1']) => void;
  setEtape2: (data: FormulaireDonnees['etape2']) => void;
  setEtape3: (data: FormulaireDonnees['etape3']) => void;
  setEtape4: (data: FormulaireDonnees['etape4']) => void;
  setEtapeActuelle: (etape: number) => void;
  setDemandeId: (id: string) => void;
  resetFormulaire: () => void;
  updateDerniereSauvegarde: () => void;
}

const initialState: FormulaireDonnees = {
  etape_actuelle: 1,
};

export const useInscriptionStore = create<InscriptionStore>()(
  persist(
    (set) => ({
      formulaireDonnees: initialState,

      setEtape1: (data) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            etape1: data,
          },
        })),

      setEtape2: (data) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            etape2: data,
          },
        })),

      setEtape3: (data) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            etape3: data,
          },
        })),

      setEtape4: (data) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            etape4: data,
          },
        })),

      setEtapeActuelle: (etape) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            etape_actuelle: etape,
          },
        })),

      setDemandeId: (id) =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            demande_id: id,
          },
        })),

      resetFormulaire: () =>
        set({
          formulaireDonnees: initialState,
        }),

      updateDerniereSauvegarde: () =>
        set((state) => ({
          formulaireDonnees: {
            ...state.formulaireDonnees,
            derniere_sauvegarde: new Date().toISOString(),
          },
        })),
    }),
    {
      name: 'inscription-storage',
    }
  )
);
