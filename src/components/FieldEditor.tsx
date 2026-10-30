import { GripVertical, Trash2, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FieldOption } from '../types';

interface Props {
  field: FormField;
  index: number;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  textarea: 'Длинный текст',
  email: 'Email',
  phone: 'Телефон',
  number: 'Число',
  date: 'Дата',
  select: 'Выпадающий список',
  radio: 'Один вариант',
  checkbox: 'Несколько вариантов',
};

export default function FieldEditor({ field, index, onUpdate, onRemove, onDuplicate, onDragStart, onDragOver, onDragEnd, isDragging }: Props) {
  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);

  const addOption = () => {
    const opts = field.options || [];
    onUpdate({ options: [...opts, { id: uuidv4(), label: `Вариант ${opts.length + 1}` }] });
  };

  const updateOption = (optId: string, label: string) => {
    const opts = (field.options || []).map(o => o.id === optId ? { ...o, label } : o);
    onUpdate({ options: opts });
  };

  const removeOption = (optId: string) => {
    onUpdate({ options: (field.options || []).filter(o => o.id !== optId) });
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-xl border p-4 transition-all ${isDragging ? 'border-indigo-400 shadow-lg opacity-70' : 'border-gray-200 hover:border-gray-300'}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[field.type]}
            </span>
            <span className="text-xs text-gray-400">#{index + 1}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вопрос / Название поля</label>
            <input
              type="text"
              value={field.label}
              onChange={e => onUpdate({ label: e.target.value })}
              placeholder="Введите вопрос"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подсказка (placeholder)</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={e => onUpdate({ placeholder: e.target.value })}
              placeholder="Подсказка для пользователя"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание (необязательно)</label>
            <input
              type="text"
              value={field.description || ''}
              onChange={e => onUpdate({ description: e.target.value })}
              placeholder="Дополнительная подсказка"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>

          {hasOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Варианты ответов</label>
              <div className="space-y-2">
                {(field.options || []).map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={e => updateOption(opt.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                    <button
                      onClick={() => removeOption(opt.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Добавить вариант
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => onUpdate({ required: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Обязательное</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
            title="Дублировать"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
