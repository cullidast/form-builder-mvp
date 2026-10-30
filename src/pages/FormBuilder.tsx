import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getForm, saveForm } from '../store';
import { Form, FormField, FieldType, FieldOption } from '../types';
import FieldEditor from '../components/FieldEditor';

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text', label: 'Текст', icon: '📝' },
  { type: 'textarea', label: 'Длинный текст', icon: '📄' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Телефон', icon: '📱' },
  { type: 'number', label: 'Число', icon: '🔢' },
  { type: 'date', label: 'Дата', icon: '📅' },
  { type: 'select', label: 'Выпадающий список', icon: '📋' },
  { type: 'radio', label: 'Один вариант', icon: '⭕' },
  { type: 'checkbox', label: 'Несколько вариантов', icon: '☑️' },
];

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const form = getForm(id);
      if (form) {
        setTitle(form.title);
        setDescription(form.description);
        setFields(form.fields);
      } else {
        navigate('/admin');
      }
    }
  }, [id, navigate]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: '',
      required: false,
      placeholder: '',
      description: '',
      options: ['select', 'radio', 'checkbox'].includes(type)
        ? [{ id: uuidv4(), label: 'Вариант 1' }]
        : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (idx: number, updates: Partial<FormField>) => {
    setFields(fields.map((f, i) => i === idx ? { ...f, ...updates } : f));
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const duplicateField = (idx: number) => {
    const field = { ...fields[idx], id: uuidv4() };
    const newFields = [...fields];
    newFields.splice(idx + 1, 0, field);
    setFields(newFields);
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newFields = [...fields];
    const [moved] = newFields.splice(dragIdx, 1);
    newFields.splice(idx, 0, moved);
    setFields(newFields);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Введите название формы');
      return;
    }
    if (fields.length === 0) {
      alert('Добавьте хотя бы одно поле');
      return;
    }

    const form: Form = {
      id: id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      fields,
      createdAt: id ? getForm(id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      isActive: true,
    };

    saveForm(form);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Редактирование формы' : 'Новая форма'}
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Сохранить
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Основные настройки
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название формы *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Например: Отклик на стажировку в Яндекс"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Краткое описание формы для студентов"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Поля формы</h2>
              {fields.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Добавьте поля с помощью панели справа</p>
                </div>
              )}
              {fields.map((field, idx) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={idx}
                  onUpdate={(updates) => updateField(idx, updates)}
                  onRemove={() => removeField(idx)}
                  onDuplicate={() => duplicateField(idx)}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIdx === idx}
                />
              ))}
            </div>
          </div>

          {/* Field type palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Добавить поле</h3>
              <div className="grid grid-cols-1 gap-2">
                {FIELD_TYPES.map(ft => (
                  <button
                    key={ft.type}
                    onClick={() => addField(ft.type)}
                    className="flex items-center gap-2 px-3 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <span>{ft.icon}</span>
                    <span className="text-gray-700">{ft.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
