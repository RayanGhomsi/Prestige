'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { etape2Schema } from '@/lib/validators/inscription';
import type { FormulaireEtape2 } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface Etape2ParentsProps {
  defaultValues?: Partial<FormulaireEtape2>;
  onNext: (data: FormulaireEtape2) => void;
  onPrevious: () => void;
}

export default function Etape2Parents({
  defaultValues,
  onNext,
  onPrevious,
}: Etape2ParentsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormulaireEtape2>({
    resolver: zodResolver(etape2Schema),
    defaultValues,
  });

  const onSubmit = (data: FormulaireEtape2) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations des parents</CardTitle>
        <CardDescription>
          Remplissez les coordonnées d'au moins un parent (père ou mère)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations Père */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations du père</h3>
            <p className="text-sm text-gray-600 mb-4">Ces informations sont optionnelles</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  {...register('pere_nom')}
                  error={errors.pere_nom?.message}
                />
                <Input
                  label="Prénom"
                  {...register('pere_prenom')}
                  error={errors.pere_prenom?.message}
                />
              </div>

              <Input
                label="Profession"
                {...register('pere_profession')}
                error={errors.pere_profession?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="690000000"
                  {...register('pere_telephone')}
                  error={errors.pere_telephone?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('pere_email')}
                  error={errors.pere_email?.message}
                />
              </div>
            </div>
          </div>

          {/* Informations Mère */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations de la mère</h3>
            <p className="text-sm text-gray-600 mb-4">Ces informations sont optionnelles</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  {...register('mere_nom')}
                  error={errors.mere_nom?.message}
                />
                <Input
                  label="Prénom"
                  {...register('mere_prenom')}
                  error={errors.mere_prenom?.message}
                />
              </div>

              <Input
                label="Profession"
                {...register('mere_profession')}
                error={errors.mere_profession?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="690000000"
                  {...register('mere_telephone')}
                  error={errors.mere_telephone?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('mere_email')}
                  error={errors.mere_email?.message}
                />
              </div>
            </div>
          </div>

          {/* Tuteur légal (optionnel) */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tuteur légal (si différent)
            </h3>
            <p className="text-sm text-gray-600 mb-4">Ces informations sont optionnelles</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  {...register('tuteur_nom')}
                  error={errors.tuteur_nom?.message}
                />
                <Input
                  label="Prénom"
                  {...register('tuteur_prenom')}
                  error={errors.tuteur_prenom?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Lien de parenté"
                  placeholder="Ex: Grand-père, Oncle..."
                  {...register('tuteur_lien')}
                  error={errors.tuteur_lien?.message}
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="690000000"
                  {...register('tuteur_telephone')}
                  error={errors.tuteur_telephone?.message}
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse et contact d'urgence</h3>
            <div className="space-y-4">
              <Textarea
                label="Adresse complète du domicile"
                {...register('adresse_complete')}
                error={errors.adresse_complete?.message}
                rows={3}
                placeholder="Numéro, rue, quartier, ville..."
                helperText="Optionnel"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Personne à contacter (urgence)"
                  {...register('urgence_nom')}
                  error={errors.urgence_nom?.message}
                  required
                />
                <Input
                  label="Téléphone (urgence)"
                  type="tel"
                  placeholder="690000000"
                  {...register('urgence_telephone')}
                  error={errors.urgence_telephone?.message}
                  required
                />
                <Input
                  label="Lien de parenté"
                  {...register('urgence_lien')}
                  error={errors.urgence_lien?.message}
                  placeholder="Ex: Tante, Voisin..."
                  required
                />
              </div>
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
