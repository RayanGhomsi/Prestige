'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { etape3Schema } from '@/lib/validators/inscription';
import type { FormulaireEtape3 } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

interface Etape3MedicaleProps {
  defaultValues?: Partial<FormulaireEtape3>;
  onNext: (data: FormulaireEtape3) => void;
  onPrevious: () => void;
}

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

export default function Etape3Medicale({
  defaultValues,
  onNext,
  onPrevious,
}: Etape3MedicaleProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormulaireEtape3>({
    resolver: zodResolver(etape3Schema),
    defaultValues,
  });

  const onSubmit = (data: FormulaireEtape3) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations médicales</CardTitle>
        <CardDescription>
          Ces informations sont essentielles pour la sécurité et le bien-être de votre enfant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Alert variant="info">
            Toutes les informations médicales sont strictement confidentielles et ne seront
            utilisées qu'en cas d'urgence médicale.
          </Alert>

          <Select
            label="Groupe sanguin"
            {...register('groupe_sanguin')}
            options={GROUPES_SANGUINS}
            error={errors.groupe_sanguin?.message}
            required
          />

          <Textarea
            label="Allergies connues"
            {...register('allergies')}
            error={errors.allergies?.message}
            rows={3}
            placeholder="Mentionnez toutes les allergies (alimentaires, médicamenteuses, etc.)"
            helperText="Laissez vide si aucune allergie connue"
          />

          <Textarea
            label="Maladies chroniques"
            {...register('maladies_chroniques')}
            error={errors.maladies_chroniques?.message}
            rows={3}
            placeholder="Asthme, diabète, épilepsie, etc."
            helperText="Laissez vide si aucune maladie chronique"
          />

          <Textarea
            label="Traitements en cours"
            {...register('traitements_en_cours')}
            error={errors.traitements_en_cours?.message}
            rows={3}
            placeholder="Médicaments, dosages et fréquence"
            helperText="Laissez vide si aucun traitement en cours"
          />

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Médecin traitant</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nom complet du médecin"
                {...register('medecin_nom')}
                error={errors.medecin_nom?.message}
                placeholder="Dr. Nom Prénom"
                required
              />

              <Input
                label="Téléphone du médecin"
                type="tel"
                placeholder="690000000"
                {...register('medecin_telephone')}
                error={errors.medecin_telephone?.message}
                required
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Précédent
            </Button>
            <Button type="submit">Suivant</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
