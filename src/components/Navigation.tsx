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
  Flame,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { ActiveTab } from '../hooks/useMomentumStore';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenQuickCapture: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingTasksCount: number;
  procrastinationCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickCapture,
  isOpenMobile,
  onCloseMobile,
  pendingTasksCount,
  procrastinationCount,
  isCollapsed = false,
  onToggleCollapse,
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
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 h-screen bg-white dark:bg-[#111317] border-r border-slate-200 dark:border-[#22252e] flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed
            ? 'lg:w-0 lg:min-w-0 lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:border-r-0 lg:pointer-events-none'
            : 'lg:w-72 lg:opacity-100'
        }`}
      >
        {/* Brand Header (Exact height h-14 matches main screen top bar) */}
        <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#22252e]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  ESOL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Personal Productivity OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1a1c23] transition-colors hidden lg:flex items-center justify-center"
                title="Thu gọn thanh điều hướng (Ctrl+B)"
                aria-label="Thu gọn thanh điều hướng"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
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
        <div className="px-4 py-3 shrink-0">
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
        <nav
          className={`flex-1 px-3 py-2 space-y-1 ${
            isCollapsed ? 'overflow-hidden pointer-events-none' : 'overflow-y-auto'
          }`}
        >
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

      </aside>
    </>
  );
};
