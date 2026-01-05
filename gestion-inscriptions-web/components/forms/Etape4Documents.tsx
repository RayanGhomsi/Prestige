'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FormulaireEtape4 } from '@/types';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import ProgressBar from '@/components/ui/ProgressBar';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/format';
import { validateFile, ACCEPTED_DOC_TYPES, MAX_FILE_SIZE } from '@/lib/validators/inscription';

interface Etape4DocumentsProps {
  defaultValues?: Partial<FormulaireEtape4>;
  onNext: (data: FormulaireEtape4) => void;
  onPrevious: () => void;
}

interface FileUploadState {
  file: File | null;
  error: string | null;
  uploading: boolean;
  progress: number;
}

export default function Etape4Documents({
  defaultValues,
  onNext,
  onPrevious,
}: Etape4DocumentsProps) {
  const [acteNaissance, setActeNaissance] = useState<FileUploadState>({
    file: null,
    error: null,
    uploading: false,
    progress: 0,
  });

  const [certificatVaccination, setCertificatVaccination] = useState<FileUploadState>({
    file: null,
    error: null,
    uploading: false,
    progress: 0,
  });

  const [bulletins, setBulletins] = useState<FileUploadState>({
    file: null,
    error: null,
    uploading: false,
    progress: 0,
  });

  const [justificatifDomicile, setJustificatifDomicile] = useState<FileUploadState>({
    file: null,
    error: null,
    uploading: false,
    progress: 0,
  });

  const { handleSubmit } = useForm<FormulaireEtape4>({
    defaultValues,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>,
    maxSize: number = MAX_FILE_SIZE
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, maxSize, ACCEPTED_DOC_TYPES);
    if (error) {
      setState({ file: null, error, uploading: false, progress: 0 });
      return;
    }

    setState({ file, error: null, uploading: false, progress: 100 });
  };

  const removeFile = (setState: React.Dispatch<React.SetStateAction<FileUploadState>>) => {
    setState({ file: null, error: null, uploading: false, progress: 0 });
  };

  const onSubmit = () => {
    const data: FormulaireEtape4 = {
      acte_naissance: acteNaissance.file || undefined,
      certificat_vaccination: certificatVaccination.file || undefined,
      bulletins: bulletins.file || undefined,
      justificatif_domicile: justificatifDomicile.file || undefined,
    };

    onNext(data);
  };

  const renderFileUpload = (
    label: string,
    state: FileUploadState,
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>,
    required: boolean = true,
    maxSize: number = 2 * 1024 * 1024
  ) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Format PDF, max {formatFileSize(maxSize)}
          </p>
        </div>
        {state.file && (
          <CheckCircle className="h-5 w-5 text-green-600" />
        )}
      </div>

      {!state.file ? (
        <>
          <label className="mt-2 cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Upload className="h-4 w-4 mr-2" />
            Choisir un fichier
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => handleFileChange(e, setState, maxSize)}
            />
          </label>
          {state.error && (
            <div className="mt-2 flex items-start text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}
        </>
      ) : (
        <div className="mt-2">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">{state.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(state.file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(setState)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Supprimer
            </button>
          </div>
          {state.uploading && (
            <div className="mt-2">
              <ProgressBar value={state.progress} showLabel />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const isFormValid =
    acteNaissance.file && certificatVaccination.file && justificatifDomicile.file;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents justificatifs</CardTitle>
        <CardDescription>
          Veuillez télécharger tous les documents requis au format PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Alert variant="info">
            Tous les documents doivent être lisibles et au format PDF. Assurez-vous que les
            informations sont clairement visibles.
          </Alert>

          <div className="space-y-4">
            {renderFileUpload(
              'Acte de naissance',
              acteNaissance,
              setActeNaissance,
              true,
              2 * 1024 * 1024
            )}

            {renderFileUpload(
              'Certificat de vaccination',
              certificatVaccination,
              setCertificatVaccination,
              true,
              2 * 1024 * 1024
            )}

            {renderFileUpload(
              'Justificatif de domicile',
              justificatifDomicile,
              setJustificatifDomicile,
              true,
              2 * 1024 * 1024
            )}

            {renderFileUpload(
              'Derniers bulletins scolaires (optionnel)',
              bulletins,
              setBulletins,
              false,
              5 * 1024 * 1024
            )}
          </div>

          {!isFormValid && (
            <Alert variant="warning">
              Veuillez télécharger tous les documents obligatoires pour continuer.
            </Alert>
          )}

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Précédent
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Suivant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
