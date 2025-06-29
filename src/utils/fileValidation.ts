export interface FileValidationRules {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (
  file: File, 
  rules: FileValidationRules
): ValidationResult => {
  if (rules.maxSize && file.size > rules.maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${formatBytes(rules.maxSize)}`
    };
  }

  if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${rules.allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};