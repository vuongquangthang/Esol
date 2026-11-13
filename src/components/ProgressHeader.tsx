import React from 'react';
import { Menu, Calendar, CheckCheck, RotateCcw } from 'lucide-react';
import { FilterType, CATEGORIES } from '../types/task';

interface ProgressHeaderProps {
  activeFilter: FilterType;
  onOpenMobileMenu: () => void;
  completedCount: number;
  totalFilteredCount: number;
  onClearCompleted?: () => void;
  onResetSample?: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  activeFilter,
  onOpenMobileMenu,
  completedCount,
  totalFilteredCount,
  onClearCompleted,
  onResetSample,
}) => {
  // Format current date in Vietnamese
  const todayFormatted = React.useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('vi-VN', options);
  }, []);

  const getTitle = () => {
    switch (activeFilter) {
      case 'today':
        return 'Công việc hôm nay';
      case 'all':
        return 'Tất cả công việc';
      case 'important':
        return 'Việc quan trọng';
      case 'completed':
        return 'Đã hoàn thành';
      case 'study':
      case 'project':
      case 'personal':
        return `Nhóm: ${CATEGORIES[activeFilter].label}`;
      default:
        return 'Danh sách công việc';
    }
  };

  const getSubtitle = () => {
    switch (activeFilter) {
      case 'today':
        return 'Tập trung vào những mục tiêu cần hoàn tất trong ngày.';
      case 'all':
        return 'Toàn bộ danh sách nhiệm vụ đã lên kế hoạch.';
      case 'important':
        return 'Các nhiệm vụ ưu tiên mức độ Cao cần xử lý trước.';
      case 'completed':
        return 'Lịch sử những việc bạn đã hoàn tất xuất sắc.';
      default:
        return 'Quản lý và theo dõi tiến độ các đầu việc.';
    }
  };

  return (
    <header className="mb-6">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between pb-3 lg:hidden border-b border-slate-100 dark:border-border-dark mb-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Daily Focus
        </span>
        <div className="w-8" /> {/* spacer */}
      </div>

      {/* Date badge */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
        <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        <span className="capitalize">{todayFormatted}</span>
      </div>

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getTitle()}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {getSubtitle()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {completedCount > 0 && onClearCompleted && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-rose-200 dark:hover:border-rose-900/60 rounded-xl transition-all shadow-sm"
              title="Xóa tất cả việc đã hoàn thành"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Dọn việc đã xong ({completedCount})</span>
            </button>
          )}

          {totalFilteredCount === 0 && onResetSample && (
            <button
              type="button"
              onClick={onResetSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl transition-all shadow-sm"
              title="Khôi phục các task mẫu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mẫu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
