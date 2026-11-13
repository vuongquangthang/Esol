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
import { Menu, Plus } from 'lucide-react';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#0c0d11] text-slate-900 dark:text-slate-100 flex antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingTasksCount={pendingTasksCount}
        procrastinationCount={procrastinationLogs.length}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111317] border-b border-slate-200 dark:border-[#22252e] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1c23]"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
            ESOL OS
          </span>

          <button
            type="button"
            onClick={() => setIsQuickCaptureOpen(true)}
            className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40"
            aria-label="Thêm việc nhanh"
          >
            <Plus className="w-5 h-5" />
          </button>
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

          {activeTab === 'focus' && (
            <FocusModule
              tasks={tasks}
              targetTask={focusTargetTask}
              onRecordFocusSession={recordFocusSession}
              onSelectTargetTask={setFocusTargetTask}
            />
          )}

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
