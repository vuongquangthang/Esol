import React from 'react';
import {
  Compass,
  CheckSquare,
  ShieldAlert,
  Timer,
  Sparkles,
  Layers,
  CalendarCheck,
  TrendingUp,
  Settings,
  Plus,
  Sun,
  Moon,
  Flame,
  X,
} from 'lucide-react';
import { ActiveTab } from '../hooks/useMomentumStore';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenQuickCapture: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingTasksCount: number;
  procrastinationCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickCapture,
  isDark,
  onToggleTheme,
  isOpenMobile,
  onCloseMobile,
  pendingTasksCount,
  procrastinationCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tổng quan (Dashboard)',
      icon: Compass,
      badge: undefined,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Công việc & Dự án',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-slate-800 text-slate-300 dark:bg-slate-700',
    },
    {
      id: 'anti_procrastination' as ActiveTab,
      label: 'Xử lý trì hoãn',
      icon: ShieldAlert,
      badge: procrastinationCount > 0 ? `${procrastinationCount} log` : 'P0',
      badgeColor: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
      highlight: true,
    },
    {
      id: 'focus' as ActiveTab,
      label: 'Focus Mode (Pomodoro)',
      icon: Timer,
    },
    {
      id: 'habits' as ActiveTab,
      label: 'Thói quen & Mục tiêu',
      icon: Flame,
    },
    {
      id: 'life' as ActiveTab,
      label: '6 Lĩnh vực cuộc sống',
      icon: Layers,
    },
    {
      id: 'weekly_review' as ActiveTab,
      label: 'Weekly Review',
      icon: CalendarCheck,
    },
    {
      id: 'transformation' as ActiveTab,
      label: '30-Day Growth',
      icon: TrendingUp,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Cài đặt & Dữ liệu',
      icon: Settings,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#111317] border-r border-slate-200 dark:border-[#22252e] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#1e2129]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  ESOL
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  OS 1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Personal Productivity OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1a1c23] transition-colors"
              title="Đổi giao diện Sáng / Tối"
              aria-label="Đổi giao diện Sáng / Tối"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Capture Button */}
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={onOpenQuickCapture}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-[#111317]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm công việc nhanh (Capture)</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Trung tâm điều hành
          </div>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181a21]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400'
                        : item.highlight
                        ? 'text-rose-500'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Hệ sinh thái &amp; Đánh giá
          </div>
          {navItems.slice(4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181a21]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info: The ESOL Loop */}
        <div className="p-4 border-t border-slate-100 dark:border-[#1e2129] bg-slate-50/50 dark:bg-[#14161c]">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            THE ESOL LOOP
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Capture ➔ Plan ➔ Execute ➔ Track ➔ Review &amp; Improve
          </div>
        </div>
      </aside>
    </>
  );
};
