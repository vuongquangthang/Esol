import React, { useState, useCallback, useRef } from 'react';
import { Plus, CornerDownLeft } from 'lucide-react';
import { Category, Priority, CATEGORIES, PRIORITY_CONFIG } from '../types/task';

interface TaskInputProps {
  onAddTask: (title: string, category: Category, priority: Priority) => void;
  defaultCategory?: Category;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  defaultCategory = 'personal',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [priority, setPriority] = useState<Priority>('medium');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;

      onAddTask(trimmed, category, priority);
      setTitle('');
    },
    [title, category, priority, onAddTask]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative rounded-2xl border transition-all duration-200 bg-white dark:bg-surface-dark ${
        isFocused
          ? 'border-brand-500/80 shadow-md ring-4 ring-brand-500/10 dark:ring-brand-500/20'
          : 'border-slate-200 dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      <div className="flex items-center px-4 pt-3.5 pb-2">
        <span className="text-slate-400 dark:text-slate-500 mr-2.5">
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Thêm công việc mới... (Nhấn Enter để lưu)"
          className="w-full bg-transparent text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none"
          aria-label="Tiêu đề công việc mới"
        />
        {title.trim() && (
          <button
            type="submit"
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-dark"
          >
            <span>Thêm</span>
            <CornerDownLeft className="w-3 h-3 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-100 dark:border-border-dark/60 bg-slate-50/50 dark:bg-surface-darker/40 rounded-b-2xl text-xs">
        {/* Category Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1">
            Nhóm:
          </span>
          {(Object.keys(CATEGORIES) as Category[]).map((catKey) => {
            const meta = CATEGORIES[catKey];
            const isSelected = category === catKey;
            return (
              <button
                key={catKey}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Chọn nhóm ${meta.label}`}
                onClick={() => setCategory(catKey)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? `${meta.bgColor} ${meta.darkBgColor} ring-1 ring-inset ring-current`
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-dark'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Priority Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1">
            Ưu tiên:
          </span>
          {(['high', 'medium', 'low'] as Priority[]).map((pKey) => {
            const pMeta = PRIORITY_CONFIG[pKey];
            const isSelected = priority === pKey;
            return (
              <button
                key={pKey}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Chọn mức ưu tiên ${pMeta.label}`}
                onClick={() => setPriority(pKey)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? `${pMeta.badgeClass} ring-1 ring-inset ring-current`
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-dark'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pMeta.dotColor}`} />
                {pMeta.label}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
};
