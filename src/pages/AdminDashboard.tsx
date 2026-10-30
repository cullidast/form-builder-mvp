import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, BarChart3, Trash2, Copy, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { getForms, getResponses, deleteForm, saveForm } from '../store';
import { Form } from '../types';

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    setForms(getForms());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Удалить форму и все ответы?')) {
      deleteForm(id);
      setForms(getForms());
    }
  };

  const handleToggleActive = (form: Form) => {
    const updated = { ...form, isActive: !form.isActive };
    saveForm(updated);
    setForms(getForms());
  };

  const handleDuplicate = (form: Form) => {
    const newForm: Form = {
      ...form,
      id: crypto.randomUUID(),
      title: `${form.title} (копия)`,
      createdAt: new Date().toISOString(),
    };
    saveForm(newForm);
    setForms(getForms());
  };

  const getResponseCount = (formId: string) => {
    return getResponses(formId).length;
  };

  const getFormLink = (id: string) => {
    return `${window.location.origin}/form/${id}`;
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(getFormLink(id));
    alert('Ссылка скопирована!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Формы отклика</h1>
          </div>
          <Link
            to="/admin/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Создать форму
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {forms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет форм</h2>
            <p className="text-gray-500 mb-6">Создайте первую форму для сбора откликов студентов</p>
            <Link
              to="/admin/new"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать форму
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map(form => (
              <div key={form.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {form.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                    {form.description && (
                      <p className="text-sm text-gray-500 mb-2">{form.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{form.fields.length} полей</span>
                      <span>•</span>
                      <span>{getResponseCount(form.id)} ответов</span>
                      <span>•</span>
                      <span>{new Date(form.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(form)}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title={form.isActive ? 'Деактивировать' : 'Активировать'}
                    >
                      {form.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => copyLink(form.id)}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Копировать ссылку"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(form)}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Дублировать"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/admin/${form.id}/responses`}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Ответы"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/admin/${form.id}/edit`}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Редактировать"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex-1 truncate">
                    {getFormLink(form.id)}
                  </code>
                  <a
                    href={`/form/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                  >
                    Открыть ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
