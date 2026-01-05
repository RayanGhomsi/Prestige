'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { etape1Schema } from '@/lib/validators/inscription';
import type { FormulaireEtape1, ClasseType } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useState } from 'react';
import { Upload } from 'lucide-react';

interface Etape1EnfantProps {
  defaultValues?: Partial<FormulaireEtape1>;
  onNext: (data: FormulaireEtape1) => void;
}

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

export default function Etape1Enfant({ defaultValues, onNext }: Etape1EnfantProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormulaireEtape1>({
    resolver: zodResolver(etape1Schema),
    defaultValues,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormulaireEtape1) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations sur l'enfant</CardTitle>
        <CardDescription>
          Veuillez remplir les informations concernant l'enfant à inscrire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              {...register('nom')}
              error={errors.nom?.message}
              required
            />

            <Input
              label="Prénom(s)"
              {...register('prenom')}
              error={errors.prenom?.message}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Date de naissance"
              type="date"
              {...register('date_naissance')}
              error={errors.date_naissance?.message}
              required
            />

            <Input
              label="Lieu de naissance"
              {...register('lieu_naissance')}
              error={errors.lieu_naissance?.message}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sexe <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="M"
                  {...register('sexe')}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Masculin</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="F"
                  {...register('sexe')}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Féminin</span>
              </label>
            </div>
            {errors.sexe && (
              <p className="mt-1 text-sm text-red-600">{errors.sexe.message}</p>
            )}
          </div>

          <Select
            label="Classe souhaitée"
            {...register('classe_souhaitee')}
            options={CLASSES}
            error={errors.classe_souhaitee?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de l'enfant
            </label>
            <div className="mt-1 flex items-center gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-full border-2 border-gray-200"
                />
              )}
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Upload className="h-4 w-4 mr-2" />
                Choisir une photo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Formats acceptés : JPG, PNG. Taille maximale : 5MB
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Suivant</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
