import React, { useState } from 'react';
import {
  Flame,
  Target,
  Sparkles,
  CheckCircle2,
  Plus,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Goal, Habit, DOMAINS, LifeDomain } from '../../types/momentum';

interface HabitGoalModuleProps {
  goals: Goal[];
  habits: Habit[];
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'history'>) => void;
  onUpdateGoalProgress: (goalId: string, progress: number) => void;
  onActivateHabitRecovery?: (habitId: string) => void;
  todayStr: string;
}

export const HabitGoalModule: React.FC<HabitGoalModuleProps> = ({
  goals,
  habits,
  onToggleHabitDay,
  onAddHabit,
  onUpdateGoalProgress,
  onActivateHabitRecovery,
  todayStr,
}) => {
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LifeDomain>('study');
  const [newFrequency, setNewFrequency] = useState('Hàng ngày');
  const [newMinTarget, setNewMinTarget] = useState('5 phút');
  const [newRecoveryNote, setNewRecoveryNote] = useState('');

  // Yesterday date string
  const yesterdayStr = React.useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const year = y.getFullYear();
    const month = String(y.getMonth() + 1).padStart(2, '0');
    const day = String(y.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Detect habits missed yesterday and not yet completed today
  const missedHabits = React.useMemo(() => {
    return habits.filter((h) => !h.history[yesterdayStr] && !h.history[todayStr]);
  }, [habits, yesterdayStr, todayStr]);

  // Generate 7 days ending today
  const last7Days = React.useMemo(() => {
    const list: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      list.push(`${y}-${m}-${day}`);
    }
    return list;
  }, []);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFrequency,
      minimumTarget: newMinTarget.trim() || 'Hành động nhỏ 2 phút',
      timeOfDay: 'anytime',
      missedRecoveryNote: newRecoveryNote.trim() || 'Làm phiên bản tối thiểu để giữ nhịp.',
    });

    setNewTitle('');
    setIsAddHabitModalOpen(false);
  };

  const handleCompleteMiniHabit = (habitId: string) => {
    onActivateHabitRecovery?.(habitId);
    onToggleHabitDay(habitId, todayStr);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Release 3.0
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mục tiêu &amp; Thói quen (Habits &amp; Goals)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phân biệt rõ Goal (kết quả mong muốn) và Habit (hành vi lặp lại) kèm giao thức phục hồi "Missed Habit Recovery".
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddHabitModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm thói quen mới</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MISSED HABIT RECOVERY PROTOCOL (NEW IN V3)                 */}
      {/* ========================================================= */}
      {missedHabits.length > 0 && (
        <section className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-white to-brand-50/20 dark:from-amber-950/30 dark:via-[#161821] dark:to-brand-950/20 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Giao thức phục hồi thói quen (Missed Habit Recovery)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Không chuỗi ngày phạt • Tái khởi động quán tính
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Hôm qua bạn đã lỡ mất {missedHabits.length} thói quen? <strong>Tuyệt đối không sao cả!</strong> ESOL không có hệ thống "streak" trừng phạt bạn. Để tái lập nhịp quán tính hôm nay mà không bị áp lực, hệ thống đề xuất bạn áp dụng <strong>Mục tiêu tối thiểu (Mini-Habit)</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {missedHabits.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-xl border border-amber-500/20 bg-white/80 dark:bg-[#121318]/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {h.title}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${DOMAINS[h.category].badgeBg} ${DOMAINS[h.category].darkBadgeBg}`}
                  >
                    {DOMAINS[h.category].vietnameseName}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Mini-Habit hôm nay:{' '}
                  </span>
                  "{h.minimumTarget}"
                  {h.missedRecoveryNote && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                      👉 {h.missedRecoveryNote}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Chỉ cần 2-5 phút để duy trì nhịp</span>

                  <button
                    type="button"
                    onClick={() => handleCompleteMiniHabit(h.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hoàn thành Mini-Habit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1. Goals Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Mục tiêu dài hạn (Goals)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${DOMAINS[goal.category].badgeBg} ${DOMAINS[goal.category].darkBadgeBg}`}
                  >
                    {DOMAINS[goal.category].vietnameseName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Hạn: {goal.targetDate}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {goal.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Ý nghĩa: </span>
                  {goal.whyItMatters}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Tiến độ</span>
                  <span className="text-brand-600 dark:text-brand-400">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#121318] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex justify-end gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => onUpdateGoalProgress(goal.id, goal.progress - 5)}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-[#20232c] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    -5%
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateGoalProgress(goal.id, goal.progress + 5)}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-[#20232c] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    +5%
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Habits Matrix Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Theo dõi thói quen 7 ngày gần nhất (Habit Tracker)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Không phạt khi lỡ ngày • Tập trung vào sự phục hồi
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#20232c] text-[11px] text-slate-400">
                <th className="p-4 font-semibold">Tên Thói Quen &amp; Mục Tiêu Tối Thiểu</th>
                <th className="p-4 font-semibold">Lĩnh vực</th>
                {last7Days.map((d) => {
                  const isToday = d === todayStr;
                  const dateObj = new Date(d);
                  return (
                    <th key={d} className={`p-4 text-center ${isToday ? 'text-brand-600 font-bold' : ''}`}>
                      <div>{dateObj.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                      <div className="text-[10px]">{dateObj.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#20232c]">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-slate-50/50 dark:hover:bg-[#181a23] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {habit.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Tối thiểu: <span className="text-slate-600 dark:text-slate-300">{habit.minimumTarget}</span>
                    </div>
                    {habit.missedRecoveryNote && (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Kế hoạch phục hồi: {habit.missedRecoveryNote}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${DOMAINS[habit.category].badgeBg} ${DOMAINS[habit.category].darkBadgeBg}`}
                    >
                      {DOMAINS[habit.category].vietnameseName}
                    </span>
                  </td>
                  {last7Days.map((d) => {
                    const isChecked = Boolean(habit.history[d]);
                    const isToday = d === todayStr;
                    return (
                      <td key={d} className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleHabitDay(habit.id, d)}
                          className={`w-7 h-7 mx-auto rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                              : isToday
                              ? 'border-brand-500 bg-brand-500/10 hover:bg-brand-500/20'
                              : 'border-slate-200 dark:border-[#2a2d39] hover:border-slate-300'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddHabitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-[#161821] border border-slate-200 dark:border-[#2a2d39] rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tạo thói quen mới
            </h3>

            <form onSubmit={handleCreateHabit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên thói quen
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Học từ mới tiếng Anh, Chống đẩy..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mục tiêu tối thiểu (Mini-habit)
                </label>
                <input
                  type="text"
                  value={newMinTarget}
                  onChange={(e) => setNewMinTarget(e.target.value)}
                  placeholder="VD: Chỉ cần đọc đúng 1 trang, làm 5 phút..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lĩnh vực
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LifeDomain)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  >
                    {(Object.keys(DOMAINS) as LifeDomain[]).map((d) => (
                      <option key={d} value={d}>
                        {DOMAINS[d].vietnameseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tần suất
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Hàng ngày">Hàng ngày</option>
                    <option value="5 ngày/tuần">5 ngày/tuần</option>
                    <option value="Cuối tuần">Cuối tuần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kế hoạch phục hồi nếu lỡ bỏ quên:
                </label>
                <input
                  type="text"
                  value={newRecoveryNote}
                  onChange={(e) => setNewRecoveryNote(e.target.value)}
                  placeholder="VD: Hôm sau chỉ làm phiên bản siêu nhẹ 2 phút..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#20232c]">
                <button
                  type="button"
                  onClick={() => setIsAddHabitModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl"
                >
                  Lưu thói quen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
