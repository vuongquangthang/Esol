import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Check, Edit2, Trash2, CornerDownLeft, X } from 'lucide-react';
import { Task, CATEGORIES, PRIORITY_CONFIG } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onUpdateTitle,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = useCallback(() => {
    setDraftTitle(task.title);
    setIsEditing(true);
  }, [task.title]);

  const handleCancelEdit = useCallback(() => {
    setDraftTitle(task.title);
    setIsEditing(false);
  }, [task.title]);

  const handleSaveEdit = useCallback(() => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    } else {
      setDraftTitle(task.title);
    }
    setIsEditing(false);
  }, [draftTitle, task.id, task.title, onUpdateTitle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const categoryMeta = CATEGORIES[task.category];
  const priorityMeta = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 sm:px-4 sm:py-3.5 rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-surface-darker/60 border-slate-200/60 dark:border-border-dark/60 opacity-75'
          : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Bỏ đánh dấu hoàn thành: ${task.title}` : `Đánh dấu hoàn thành: ${task.title}`}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-dark ${
          task.completed
            ? 'bg-brand-600 border-brand-600 dark:bg-brand-500 dark:border-brand-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 bg-white dark:bg-surface-dark'
        }`}
      >
        {task.completed ? (
          <Check className="w-3.5 h-3.5 stroke-[2.5] animate-scale-in" />
        ) : (
          <span className="w-2 h-2 rounded-sm bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors" />
        )}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium px-2.5 py-1.5 rounded-lg border border-brand-500 bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              aria-label="Chỉnh sửa tiêu đề công việc"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-1.5 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-surface-darker rounded-md transition-colors"
              title="Lưu (Enter)"
              aria-label="Lưu thay đổi"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-darker rounded-md transition-colors"
              title="Hủy (Esc)"
              aria-label="Hủy chỉnh sửa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span
              onDoubleClick={handleStartEdit}
              title="Nhấn đúp chuột để sửa nhanh"
              className={`text-sm font-medium leading-relaxed select-text cursor-pointer transition-colors duration-200 break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {task.title}
            </span>

            {/* Badges / Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {/* Category badge */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${categoryMeta.bgColor} ${categoryMeta.darkBgColor}`}
              >
                {categoryMeta.label}
              </span>

              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${priorityMeta.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dotColor}`} />
                {priorityMeta.label}
              </span>

              {/* Completed timestamp hint */}
              {task.completed && task.completedAt && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
                  Đã xong lúc {new Date(task.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons (Visible on hover on desktop, or focus-within) */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={handleStartEdit}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-darker rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            title="Chỉnh sửa công việc (hoặc bấm đúp)"
            aria-label={`Sửa công việc: ${task.title}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title="Xóa công việc"
            aria-label={`Xóa công việc: ${task.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});
