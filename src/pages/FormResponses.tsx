import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { getForm, getResponses } from '../store';
import { Form, FormResponse } from '../types';

export default function FormResponses() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const f = getForm(id);
      if (f) {
        setForm(f);
        setResponses(getResponses(id));
      }
    }
  }, [id]);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Форма не найдена</p>
      </div>
    );
  }

  const getAnswerDisplay = (fieldId: string, answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer || '—';
  };

  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = ['Дата', ...form.fields.map(f => f.label || 'Без названия')];
    const rows = responses.map(r => {
      const row = [
        new Date(r.submittedAt).toLocaleString('ru-RU'),
        ...form.fields.map(f => {
          const answer = r.answers[f.id];
          return Array.isArray(answer) ? answer.join('; ') : (answer || '');
        })
      ];
      return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_ответы.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-sm text-gray-500">{responses.length} ответов</p>
            </div>
          </div>
          {responses.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Экспорт CSV
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {responses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет ответов</h2>
            <p className="text-gray-500 mb-4">Пока никто не заполнил эту форму</p>
            <p className="text-sm text-gray-400">
              Ссылка: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}/form/{form.id}</code>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((response, idx) => (
              <div key={response.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      Ответ #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(response.submittedAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  {expandedIdx === idx ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedIdx === idx && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <div className="mt-4 space-y-3">
                      {form.fields.map(field => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-500">
                            {field.label || 'Без названия'}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          <div className="md:col-span-2 text-sm text-gray-900">
                            {getAnswerDisplay(field.id, response.answers[field.id])}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
