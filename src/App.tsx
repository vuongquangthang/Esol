import { useState, useEffect, useMemo } from 'react';
import { useMomentumStore } from './hooks/useMomentumStore';
import { useTheme } from './hooks/useTheme';
import { Navigation } from './components/Navigation';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { DashboardModule } from './components/modules/DashboardModule';
import { TaskManagementModule } from './components/modules/TaskManagementModule';
import { AntiProcrastinationModule } from './components/modules/AntiProcrastinationModule';
import { FocusModule } from './components/modules/FocusModule';
import { HabitGoalModule } from './components/modules/HabitGoalModule';
import { LifeManagementModule } from './components/modules/LifeManagementModule';
import { WeeklyReviewModule } from './components/modules/WeeklyReviewModule';
import { TransformationModule } from './components/modules/TransformationModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { getTodayDateString } from './constants/momentumMockData';
import { Menu, Plus, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('momentum_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('momentum_sidebar_collapsed', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const {
    activeTab,
    setActiveTab,
    tasks,
    projects,
    goals,
    habits,
    procrastinationLogs,
    focusSessions,
    financeTransactions,
    healthLogs,
    weeklyReviews,
    transformationStats,
    // Task operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTodayPriority,
    postponeTask,
    // Focus operations
    focusTargetTask,
    setFocusTargetTask,
    recordFocusSession,
    startFocusWithTask,
    // Anti-procrastination
    procrastinationTargetTask,
    setProcrastinationTargetTask,
    startRecoveryWithTask,
    // Breakdown
    startBreakdownWithTask,
    // Habit operations
    toggleHabitDay,
    addHabit,
    activateHabitRecovery,
    updateGoalProgress,
    // Finance operations
    addTransaction,
    deleteTransaction,
    // Health operations
    updateHealthLog,
    // Weekly review
    saveWeeklyReview,
    isWeeklyReviewDue,
    currentWeekNumber,
    // Transformation
    updateTransformationStats,
    // Backup & Reset
    resetToMockData,
    exportDataJSON,
    importDataJSON,
    showDemoData,
    toggleDemoData,
    // Computed
    todayPriorities,
    nextActionTask,
    dailyOverview,
    todayFocusMinutes,
  } = useMomentumStore();

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modals/drawers
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsQuickCaptureOpen(false);
      }
      // Alt+C or Ctrl+Q opens Quick Capture
      if ((e.altKey && e.key.toLowerCase() === 'c') || (e.ctrlKey && e.key.toLowerCase() === 'q')) {
        e.preventDefault();
        setIsQuickCaptureOpen((prev) => !prev);
      }
      // Ctrl+B or Cmd+B toggles Toolbar / Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabTitles: Record<string, string> = {
    dashboard: 'Tổng quan (Dashboard)',
    tasks: 'Công việc & Dự án',
    anti_procrastination: 'Xử lý trì hoãn',
    focus: 'Focus Mode (Pomodoro)',
    habits: 'Thói quen & Mục tiêu',
    life: '6 Lĩnh vực cuộc sống',
    weekly_review: 'Weekly Review',
    transformation: '30-Day Growth',
    settings: 'Cài đặt & Dữ liệu',
  };

  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status !== 'done').length;
  }, [tasks]);

  // Current weekly stats for Weekly Review
  const currentWeeklyStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const focusHours = Math.round((todayFocusMinutes / 60) * 10) / 10;
    return {
      completionRate: rate,
      startRate: Math.min(100, rate + 12),
      postponementCount: procrastinationLogs.length,
      focusHours: Math.max(focusHours, 8.5),
      habitRate: 75,
    };
  }, [tasks, todayFocusMinutes, procrastinationLogs]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fafafc] dark:bg-[#0c0d11] text-slate-900 dark:text-slate-100 flex antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingTasksCount={pendingTasksCount}
        procrastinationCount={procrastinationLogs.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Header / Toolbar Bar (Desktop & Mobile) - Exact height h-14 matches sidebar brand row */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-[#111317]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#22252e] sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Open */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1c23]"
              aria-label="Mở menu di động"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Toolbar Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center rounded-xl p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-[#1a1c23]"
              title={isSidebarCollapsed ? "Mở thanh điều hướng (Ctrl+B)" : "Thu gọn thanh điều hướng (Ctrl+B)"}
              aria-label="Đóng mở toolbar"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            {/* Current Active Module Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
                ESOL OS
              </span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {tabTitles[activeTab] || 'Tổng quan'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Capture Button */}
            <button
              type="button"
              onClick={() => setIsQuickCaptureOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-sm shadow-brand-500/20 transition-all"
              title="Thêm công việc nhanh (Alt+C hoặc Ctrl+Q)"
              aria-label="Thêm việc nhanh"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Thêm nhanh</span>
            </button>

            {/* Theme Toggle stays on the right in every toolbar state */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1a1c23] transition-colors"
              title="Đổi giao diện Sáng / Tối"
              aria-label="Đổi giao diện Sáng / Tối"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Dynamic Modules View */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardModule
              todayPriorities={todayPriorities}
              nextActionTask={nextActionTask}
              dailyOverview={dailyOverview}
              todayFocusMinutes={todayFocusMinutes}
              habits={habits}
              onToggleHabit={toggleHabitDay}
              onToggleTaskStatus={toggleTaskStatus}
              onStartFocus={startFocusWithTask}
              onStartRecovery={startRecoveryWithTask}
              onStartBreakdown={startBreakdownWithTask}
              onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
              todayStr={todayStr}
              onExportData={exportDataJSON}
              onImportData={importDataJSON}
              isWeeklyReviewDue={isWeeklyReviewDue}
              onOpenWeeklyReview={() => setActiveTab('weekly_review')}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManagementModule
              tasks={tasks}
              projects={projects}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onToggleTaskStatus={toggleTaskStatus}
              onSetTodayPriority={setTodayPriority}
              onStartFocus={startFocusWithTask}
              onStartRecovery={startRecoveryWithTask}
            />
          )}

          {activeTab === 'anti_procrastination' && (
            <AntiProcrastinationModule
              tasks={tasks}
              targetTask={procrastinationTargetTask}
              onSelectTargetTask={setProcrastinationTargetTask}
              onPostponeTask={postponeTask}
              onStartFocus={startFocusWithTask}
              onStartBreakdown={startBreakdownWithTask}
              procrastinationLogs={procrastinationLogs}
            />
          )}

          <FocusModule
            tasks={tasks}
            targetTask={focusTargetTask}
            onRecordFocusSession={recordFocusSession}
            onSelectTargetTask={setFocusTargetTask}
            isVisible={activeTab === 'focus'}
          />

          {activeTab === 'habits' && (
            <HabitGoalModule
              goals={goals}
              habits={habits}
              onToggleHabitDay={toggleHabitDay}
              onAddHabit={addHabit}
              onUpdateGoalProgress={updateGoalProgress}
              onActivateHabitRecovery={activateHabitRecovery}
              todayStr={todayStr}
            />
          )}

          {activeTab === 'life' && (
            <LifeManagementModule
              tasks={tasks}
              projects={projects}
              financeTransactions={financeTransactions}
              healthLogs={healthLogs}
              habits={habits}
              onAddTransaction={addTransaction}
              onDeleteTransaction={deleteTransaction}
              onUpdateHealthLog={updateHealthLog}
              todayStr={todayStr}
            />
          )}

          {activeTab === 'weekly_review' && (
            <WeeklyReviewModule
              weeklyReviews={weeklyReviews}
              onSaveWeeklyReview={saveWeeklyReview}
              currentWeeklyStats={currentWeeklyStats}
              currentWeekNumber={currentWeekNumber}
            />
          )}

          {activeTab === 'transformation' && (
            <TransformationModule
              stats={transformationStats}
              onUpdateReflection={(refl) => updateTransformationStats({ reflection: refl })}
              onExportData={exportDataJSON}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule
              isDark={isDark}
              onToggleTheme={toggleTheme}
              showDemoData={showDemoData}
              onToggleDemoData={toggleDemoData}
              onExportData={exportDataJSON}
              onImportData={importDataJSON}
              onResetToMock={resetToMockData}
              statsPreview={{
                tasksCount: tasks.length,
                habitsCount: habits.length,
                focusSessionsCount: focusSessions.length,
                procLogsCount: procrastinationLogs.length,
                financeCount: financeTransactions.length,
                healthCount: healthLogs.length,
              }}
            />
          )}
        </main>
      </div>

      {/* Quick Capture Floating Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onAddTask={addTask}
        currentPriorityCount={todayPriorities.length}
      />
    </div>
  );
}

export default App;
