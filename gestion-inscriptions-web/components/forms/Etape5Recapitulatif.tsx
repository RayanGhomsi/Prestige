'use client';

import { useState } from 'react';
import type { FormulaireDonnees } from '@/types';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { CheckCircle, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

interface Etape5RecapitulatifProps {
  donnees: FormulaireDonnees;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  onEdit: (etape: number) => void;
}

export default function Etape5Recapitulatif({
  donnees,
  onPrevious,
  onSubmit,
  isLoading = false,
  onEdit,
}: Etape5RecapitulatifProps) {
  const [attestation, setAttestation] = useState(false);

  const handleSubmit = () => {
    if (!attestation) {
      alert('Veuillez cocher la case d\'attestation');
      return;
    }
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif de la demande</CardTitle>
        <CardDescription>
          Vérifiez attentivement toutes les informations avant de soumettre votre demande
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations de l'enfant */}
        {donnees.etape1 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations de l'enfant
              </h3>
              <button
                type="button"
                onClick={() => onEdit(1)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Nom complet</dt>
                <dd className="text-gray-900">
                  {donnees.etape1.nom} {donnees.etape1.prenom}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Date de naissance</dt>
                <dd className="text-gray-900">
                  {formatDate(donnees.etape1.date_naissance)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Lieu de naissance</dt>
                <dd className="text-gray-900">{donnees.etape1.lieu_naissance}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Sexe</dt>
                <dd className="text-gray-900">
                  {donnees.etape1.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-gray-700">Classe souhaitée</dt>
                <dd className="text-gray-900">{donnees.etape1.classe_souhaitee}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Informations des parents */}
        {donnees.etape2 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations des parents
              </h3>
              <button
                type="button"
                onClick={() => onEdit(2)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Père</h4>
                <p className="text-gray-900">
                  {donnees.etape2.pere_prenom} {donnees.etape2.pere_nom}
                </p>
                <p className="text-gray-600">{donnees.etape2.pere_profession}</p>
                <p className="text-gray-600">
                  {donnees.etape2.pere_telephone} • {donnees.etape2.pere_email}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Mère</h4>
                <p className="text-gray-900">
                  {donnees.etape2.mere_prenom} {donnees.etape2.mere_nom}
                </p>
                <p className="text-gray-600">{donnees.etape2.mere_profession}</p>
                <p className="text-gray-600">
                  {donnees.etape2.mere_telephone} • {donnees.etape2.mere_email}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Adresse</h4>
                <p className="text-gray-900">{donnees.etape2.adresse_complete}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Contact d'urgence</h4>
                <p className="text-gray-900">
                  {donnees.etape2.urgence_nom} ({donnees.etape2.urgence_lien})
                </p>
                <p className="text-gray-600">{donnees.etape2.urgence_telephone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Informations médicales */}
        {donnees.etape3 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations médicales
              </h3>
              <button
                type="button"
                onClick={() => onEdit(3)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Groupe sanguin</dt>
                <dd className="text-gray-900">{donnees.etape3.groupe_sanguin}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Médecin traitant</dt>
                <dd className="text-gray-900">
                  {donnees.etape3.medecin_nom}
                  <br />
                  <span className="text-gray-600">{donnees.etape3.medecin_telephone}</span>
                </dd>
              </div>
              {donnees.etape3.allergies && (
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-700">Allergies</dt>
                  <dd className="text-gray-900">{donnees.etape3.allergies}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Documents */}
        {donnees.etape4 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents joints</h3>
              <button
                type="button"
                onClick={() => onEdit(4)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {donnees.etape4.acte_naissance && (
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Acte de naissance
                </li>
              )}
              {donnees.etape4.certificat_vaccination && (
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Certificat de vaccination
                </li>
              )}
              {donnees.etape4.justificatif_domicile && (
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Justificatif de domicile
                </li>
              )}
              {donnees.etape4.bulletins && (
                <li className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Bulletins scolaires
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Attestation */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={attestation}
              onChange={(e) => setAttestation(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-900">
              J'atteste sur l'honneur que toutes les informations fournies sont exactes et
              complètes. Je comprends que toute fausse déclaration peut entraîner le refus de
              la demande d'inscription.
            </span>
          </label>
        </div>

        <Alert variant="info">
          Une fois votre demande soumise, vous recevrez un email de confirmation avec un
          numéro de suivi. Vous pourrez suivre l'évolution de votre demande depuis votre
          tableau de bord.
        </Alert>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!attestation}>
            Soumettre la demande
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
