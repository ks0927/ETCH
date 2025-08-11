export interface ProjectFileUploadProps {
  uploadedFiles: File[];
  onFileUpload: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  maxFiles: number;
  maxFileSize: number; // bytes
  acceptedTypes: string[];
  disabled?: boolean;
}

export interface FileValidationResult {
  validFiles: File[];
  invalidFiles: File[];
  errors: string[];
}
