import React from 'react';
import {
  Inbox,
  Sun,
  Flame,
  CheckCircle2,
  BookOpen,
  Briefcase,
  User,
  Moon,
  Search,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { FilterType, Category, CATEGORIES } from '../types/task';

interface SidebarProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  uncompletedCounts: {
    all: number;
    today: number;
    important: number;
    completed: number;
    study: number;
    project: number;
    personal: number;
  };
  todayStats: {
    total: number;
    completed: number;
    percentage: number;
    remaining: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  onSelectFilter,
  uncompletedCounts,
  todayStats,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  isOpenMobile,
  onCloseMobile,
}) => {
  const quickFilters = [
    {
      id: 'today' as FilterType,
      label: 'Hôm nay',
      icon: Sun,
      count: uncompletedCounts.today,
      badgeColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'all' as FilterType,
      label: 'Tất cả công việc',
      icon: Inbox,
      count: uncompletedCounts.all,
      badgeColor: 'text-slate-500 bg-slate-100 dark:bg-surface-dark',
    },
    {
      id: 'important' as FilterType,
      label: 'Quan trọng',
      icon: Flame,
      count: uncompletedCounts.important,
      badgeColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      id: 'completed' as FilterType,
      label: 'Đã hoàn thành',
      icon: CheckCircle2,
      count: uncompletedCounts.completed,
      badgeColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  const categoryItems: { id: Category; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    {
      id: 'study',
      label: 'Học tập',
      icon: BookOpen,
      count: uncompletedCounts.study,
    },
    {
      id: 'project',
      label: 'Dự án',
      icon: Briefcase,
      count: uncompletedCounts.project,
    },
    {
      id: 'personal',
      label: 'Cá nhân',
      icon: User,
      count: uncompletedCounts.personal,
    },
  ];

  const handleSelect = (filter: FilterType) => {
    onSelectFilter(filter);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-border-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Daily Focus
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Linear &amp; Things 3 style
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-surface-darker transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title={isDark ? 'Chuyển sang Giao diện sáng' : 'Chuyển sang Giao diện tối'}
              aria-label={isDark ? 'Chuyển sang Giao diện sáng' : 'Chuyển sang Giao diện tối'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-border-dark/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm công việc..."
              className="w-full pl-9 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-surface-darker/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Nav list - scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Quick Filters */}
          <div>
            <div className="px-2 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Bộ lọc nhanh
            </div>
            <nav className="space-y-0.5">
              {quickFilters.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-surface-darker/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-brand-200/60 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200'
                            : item.badgeColor
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <div className="px-2 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Nhóm công việc
            </div>
            <nav className="space-y-0.5">
              {categoryItems.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeFilter === cat.id;
                const meta = CATEGORIES[cat.id];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-surface-darker/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                      <span>{cat.label}</span>
                    </div>
                    {cat.count > 0 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-surface-darker text-slate-500 dark:text-slate-400">
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Progress Bar Widget in Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-border-dark/60 bg-slate-50/60 dark:bg-surface-darker/50">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Tiến độ hôm nay
            </span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {todayStats.percentage}%
            </span>
          </div>

          {/* Progress track */}
          <div
            role="progressbar"
            aria-label="Tiến độ hoàn thành công việc hôm nay"
            aria-valuenow={todayStats.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full bg-slate-200 dark:bg-border-dark h-2 rounded-full overflow-hidden"
          >
            <div
              className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${todayStats.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>
              {todayStats.completed}/{todayStats.total} việc đã xong
            </span>
            {todayStats.percentage === 100 && todayStats.total > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Hoàn hảo! 🎉</span>
            ) : (
              <span>Còn {todayStats.remaining} việc</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
