import React from 'react';
import { CheckCircle2, SearchX, Sparkles, Plus } from 'lucide-react';
import { FilterType } from '../types/task';

interface EmptyStateProps {
  filter: FilterType;
  isSearching: boolean;
  onAddTaskClick?: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filter,
  isSearching,
  onAddTaskClick,
  onClearSearch,
}) => {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 border border-slate-200 dark:border-border-dark">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Không tìm thấy công việc
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Không có công việc nào khớp với từ khóa tìm kiếm của bạn. Hãy thử từ khóa khác.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-lg transition-colors border border-transparent hover:border-brand-200 dark:hover:border-brand-800"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-200/60 dark:border-emerald-900/40">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Chưa có công việc nào hoàn thành
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Đánh dấu tick vào các công việc bạn đã hoàn tất để theo dõi thành quả tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="relative mb-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-100 dark:from-surface-dark dark:to-surface-dark flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-border-dark shadow-sm">
          <Sparkles className="w-7 h-7" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Tuyệt vời! Không còn việc nào tồn đọng
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        {filter === 'today'
          ? 'Tất cả công việc trong ngày hôm nay đã được xử lý xong. Hãy nghỉ ngơi hoặc lên kế hoạch mới!'
          : 'Danh sách này hiện đang trống. Bạn có thể thêm công việc mới bên dưới.'}
      </p>
      {onAddTaskClick && (
        <button
          onClick={onAddTaskClick}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-dark"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm công việc ngay</span>
        </button>
      )}
    </div>
  );
};
