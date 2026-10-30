import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, saveResponse } from '../store';
import { Form, FormResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Send } from 'lucide-react';

export default function PublicForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const f = getForm(id);
      if (f) {
        if (!f.isActive) {
          setNotFound(true);
          return;
        }
        setForm(f);
        // Initialize answers
        const initial: Record<string, string | string[]> = {};
        f.fields.forEach(field => {
          if (field.type === 'checkbox') {
            initial[field.id] = [];
          } else {
            initial[field.id] = '';
          }
        });
        setAnswers(initial);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  const updateAnswer = (fieldId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const toggleCheckbox = (fieldId: string, optionLabel: string) => {
    setAnswers(prev => {
      const current = (prev[fieldId] as string[]) || [];
      if (current.includes(optionLabel)) {
        return { ...prev, [fieldId]: current.filter(v => v !== optionLabel) };
      }
      return { ...prev, [fieldId]: [...current, optionLabel] };
    });
    setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    form!.fields.forEach(field => {
      const answer = answers[field.id];
      if (field.required) {
        if (Array.isArray(answer)) {
          if (answer.length === 0) {
            newErrors[field.id] = 'Выберите хотя бы один вариант';
          }
        } else if (!answer || !answer.trim()) {
          newErrors[field.id] = 'Обязательное поле';
        }
      }
      // Type-specific validation
      if (answer && typeof answer === 'string' && answer.trim()) {
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) {
          newErrors[field.id] = 'Некорректный email';
        }
        if (field.type === 'phone' && !/^[\d\s\-\+\(\)]+$/.test(answer)) {
          newErrors[field.id] = 'Некорректный номер телефона';
        }
        if (field.type === 'number' && isNaN(Number(answer))) {
          newErrors[field.id] = 'Введите число';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !validate()) return;

    setSubmitting(true);

    // Simulate a small delay for UX
    setTimeout(() => {
      const response: FormResponse = {
        id: uuidv4(),
        formId: form.id,
        answers,
        submittedAt: new Date().toISOString(),
      };
      saveResponse(response);
      setSubmitting(false);
      navigate('/thank-you');
    }, 500);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Форма не найдена</h2>
          <p className="text-gray-500">Возможно, она была удалена или деактивирована</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Загрузка...</div>
      </div>
    );
  }

  const renderField = (field: typeof form.fields[0]) => {
    const value = answers[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value as string}
            onChange={e => updateAnswer(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors[field.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value as string}
            onChange={e => updateAnswer(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors ${errors[field.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value as string}
            onChange={e => updateAnswer(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors[field.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
        );
      case 'select':
        return (
          <select
            value={value as string}
            onChange={e => updateAnswer(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors[field.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">Выберите вариант</option>
            {(field.options || []).map(opt => (
              <option key={opt.id} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {(field.options || []).map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.label}
                  checked={value === opt.label}
                  onChange={() => updateAnswer(field.id, opt.label)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(field.options || []).map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(opt.label)}
                  onChange={() => toggleCheckbox(field.id, opt.label)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="mt-2 text-indigo-100">{form.description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {form.fields.map((field, idx) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {idx + 1}. {field.label || 'Без названия'}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                )}
                {renderField(field)}
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>Отправка...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Отправить
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Карьерная платформа для студентов
        </p>
      </div>
    </div>
  );
}
