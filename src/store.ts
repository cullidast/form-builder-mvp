import { Form, FormResponse } from './types';

const FORMS_KEY = 'formbuilder_forms';
const RESPONSES_KEY = 'formbuilder_responses';

export function getForms(): Form[] {
  const data = localStorage.getItem(FORMS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getForm(id: string): Form | undefined {
  return getForms().find(f => f.id === id);
}

export function saveForm(form: Form): void {
  const forms = getForms();
  const idx = forms.findIndex(f => f.id === form.id);
  if (idx >= 0) {
    forms[idx] = form;
  } else {
    forms.push(form);
  }
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

export function deleteForm(id: string): void {
  const forms = getForms().filter(f => f.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  // Also delete responses
  const responses = getResponses().filter(r => r.formId !== id);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
}

export function getResponses(formId?: string): FormResponse[] {
  const data = localStorage.getItem(RESPONSES_KEY);
  const all: FormResponse[] = data ? JSON.parse(data) : [];
  if (formId) {
    return all.filter(r => r.formId === formId);
  }
  return all;
}

export function saveResponse(response: FormResponse): void {
  const responses = getResponses();
  responses.push(response);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
}
