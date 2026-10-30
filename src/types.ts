export type FieldType = 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';

export interface FieldOption {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  description?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  isActive: boolean;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
}
