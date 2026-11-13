import React, { useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  ShieldAlert,
  Flame,
  Split,
  Plus,
  Sparkles,
  Calendar,
  Download,
  Upload,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';
import { Task, Habit, DOMAINS } from '../../types/momentum';

interface DashboardModuleProps {
  todayPriorities: Task[];
  nextActionTask: Task | null;
  dailyOverview: {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
  };
  todayFocusMinutes: number;
  habits: Habit[];
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onStartRecovery: (task: Task) => void;
  onStartBreakdown: (task: Task) => void;
  onOpenQuickCapture: () => void;
  todayStr: string;
  onExportData?: () => void;
  onImportData?: (jsonStr: string) => void;
  isWeeklyReviewDue?: boolean;
  onOpenWeeklyReview?: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  todayPriorities,
  nextActionTask,
  dailyOverview,
  todayFocusMinutes,
  habits,
  onToggleHabit,
  onToggleTaskStatus,
  onStartFocus,
  onStartRecovery,
  onStartBreakdown,
  onOpenQuickCapture,
  todayStr,
  onExportData,
  onImportData,
  isWeeklyReviewDue,
  onOpenWeeklyReview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && onImportData) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };
  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Trung tâm điều hành
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build consistency. Make progress visible.
          </p>
        </div>

        {/* Quick stats chips & Backup Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onExportData && (
            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181a22] border border-slate-200 dark:border-[#262934] hover:bg-slate-50 dark:hover:bg-[#20232c] shadow-sm transition-all"
              title="Xuất bản sao lưu dữ liệu JSON"
            >
              <Download className="w-3.5 h-3.5 text-brand-500" />
              <span>Backup JSON</span>
            </button>
          )}

          {onImportData && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181a22] border border-slate-200 dark:border-[#262934] hover:bg-slate-50 dark:hover:bg-[#20232c] shadow-sm transition-all"
                title="Khôi phục dữ liệu từ tệp JSON"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Import JSON</span>
              </button>
            </>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181a22] border border-slate-200 dark:border-[#262934] text-right">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Thời gian tập trung
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {todayFocusMinutes} phút
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181a22] border border-slate-200 dark:border-[#262934] text-right">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Tiến độ hôm nay
            </div>
            <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
              {dailyOverview.completed}/{dailyOverview.total} ({dailyOverview.percentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Automated Weekly Review Prompt Trigger (Release 3.0) */}
      {isWeeklyReviewDue && onOpenWeeklyReview && (
        <div className="p-4 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-600/10 via-brand-500/5 to-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Chủ Nhật / Định kỳ tuần: Đã đến giờ cho phiên Weekly Review (10 phút)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-600 text-white font-bold">
                  Khuyên dùng
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Đánh giá tuần qua, ghi nhận nguyên nhân trì hoãn và thiết lập 1–2 điều chỉnh thực tế cho tuần mới.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWeeklyReview}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all flex-shrink-0"
          >
            <span>Thực hiện Review ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. THE SPOTLIGHT: Next Action Card */}
      {nextActionTask ? (
        <section className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 via-slate-50 to-indigo-50/20 dark:from-brand-950/40 dark:via-[#161821] dark:to-indigo-950/20 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white shadow-sm">
                Next Action
              </span>
              <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                Ưu tiên cao nhất
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${DOMAINS[nextActionTask.category].badgeBg} ${DOMAINS[nextActionTask.category].darkBadgeBg}`}
            >
              {DOMAINS[nextActionTask.category].vietnameseName}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {nextActionTask.title}
          </h3>

          {/* Action step highlight */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#121319]/80 border border-brand-500/20 mb-4">
            <div className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mb-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hành động cụ thể đầu tiên:</span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              "{nextActionTask.nextAction || 'Bắt đầu bước nhỏ nhất trong 2-5 phút'}"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Dự kiến: {nextActionTask.estimatedMinutes || 30} phút</span>
              {nextActionTask.subtasks.length > 0 && (
                <span>
                  • {nextActionTask.subtasks.filter((s) => s.completed).length}/{nextActionTask.subtasks.length} subtask
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStartBreakdown(nextActionTask)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#1f222b] border border-slate-200 dark:border-[#2d313c] rounded-xl transition-colors"
                title="Mở Task Breakdown để chia nhỏ"
              >
                <Split className="w-3.5 h-3.5" />
                <span>Chia nhỏ việc</span>
              </button>

              <button
                type="button"
                onClick={() => onStartRecovery(nextActionTask)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 bg-white dark:bg-[#1f222b] border border-rose-200 dark:border-rose-900/40 rounded-xl transition-colors"
                title="Kích hoạt Recovery Protocol nếu bạn đang bị nghẽn"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Trì hoãn?</span>
              </button>

              <button
                type="button"
                onClick={() => onStartFocus(nextActionTask)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 rounded-xl transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bắt đầu ngay</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2d39] text-center bg-slate-50/50 dark:bg-[#14161d]">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Tất cả ưu tiên chính đã hoàn thành!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Bạn đã hoàn tất xuất sắc các mục tiêu quan trọng hôm nay. Hãy nghỉ ngơi hoặc chọn một việc từ danh sách để tiếp tục.
          </p>
        </div>
      )}

      {/* 3. Grid: Today's Priorities (Max 3) & Habit Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Priorities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                3 Ưu tiên hàng đầu hôm nay
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1a1c24] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#262934]">
                {todayPriorities.length}/3
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenQuickCapture}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm việc</span>
            </button>
          </div>

          <div className="space-y-3">
            {todayPriorities.length === 0 ? (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#14161c] text-center text-xs text-slate-400">
                Chưa có công việc nào được gán làm Ưu tiên hôm nay. Bấm nút "Thêm việc" để ghim tối đa 3 việc quan trọng nhất.
              </div>
            ) : (
              todayPriorities.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === 'done'
                      ? 'bg-slate-50/60 dark:bg-[#121419] border-slate-200 dark:border-[#1e2129] opacity-70'
                      : 'bg-white dark:bg-[#161821] border-slate-200 dark:border-[#262934] shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        task.status === 'done'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-white dark:bg-[#161821]'
                      }`}
                      aria-label="Toggle task"
                    >
                      {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            task.status === 'done'
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded border ${DOMAINS[task.category].badgeBg} ${DOMAINS[task.category].darkBadgeBg}`}
                        >
                          {DOMAINS[task.category].vietnameseName}
                        </span>
                      </div>

                      {task.nextAction && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          👉 {task.nextAction}
                        </p>
                      )}

                      {/* Subtasks summary */}
                      {task.subtasks.length > 0 && (
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                          <span>
                            Tiến độ: {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} bước
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Daily Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Thói quen hôm nay
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-3">
            {habits.slice(0, 5).map((habit) => {
              const isChecked = Boolean(habit.history[todayStr]);
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a1c24] transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'} truncate`}>
                      {habit.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Tối thiểu: {habit.minimumTarget}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleHabit(habit.id, todayStr)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-amber-500 bg-white dark:bg-[#161821]'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
