import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Star,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, FocusSession } from '../../types/momentum';

interface FocusModuleProps {
  tasks: Task[];
  targetTask: Task | null;
  onRecordFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  onSelectTargetTask: (task: Task | null) => void;
}

export const FocusModule: React.FC<FocusModuleProps> = ({
  tasks,
  targetTask,
  onRecordFocusSession,
  onSelectTargetTask,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    targetTask || tasks.find((t) => t.isTodayPriority && t.status !== 'done') || tasks[0] || null
  );

  // Timer mode: 25, 45, 50, or custom minutes
  const [presetMinutes, setPresetMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Distraction Parking Lot
  const [parkingLotItems, setParkingLotItems] = useState<string[]>([]);
  const [newDistraction, setNewDistraction] = useState<string>('');

  // End of Session Summary Modal
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [accomplishment, setAccomplishment] = useState('');
  const [focusScore, setFocusScore] = useState<number>(5);

  useEffect(() => {
    if (targetTask) {
      setSelectedTask(targetTask);
    }
  }, [targetTask]);

  // Handle timer countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
      setIsSummaryModalOpen(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeftSeconds]);

  const handleSelectPreset = (mins: number) => {
    setPresetMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setIsRunning(false);
  };

  const handleAddDistraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistraction.trim()) return;
    setParkingLotItems((prev) => [...prev, newDistraction.trim()]);
    setNewDistraction('');
  };

  const handleDeleteDistraction = (idx: number) => {
    setParkingLotItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFinishEarly = () => {
    if (confirm('Bạn có muốn kết thúc phiên làm việc ngay bây giờ để ghi nhận kết quả không?')) {
      setIsRunning(false);
      setIsSummaryModalOpen(true);
    }
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const actualDuration = Math.max(1, Math.round((presetMinutes * 60 - timeLeftSeconds) / 60));

    onRecordFocusSession({
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title || 'Phiên làm việc tự do',
      durationMinutes: actualDuration > 0 ? actualDuration : presetMinutes,
      focusScore,
      accomplishment: accomplishment.trim() || 'Hoàn thành phiên làm việc đúng kế hoạch',
      distractions: parkingLotItems,
    });

    setIsSummaryModalOpen(false);
    setAccomplishment('');
    setParkingLotItems([]);
    setTimeLeftSeconds(presetMinutes * 60);
    alert('🎉 Tuyệt vời! Phiên làm việc đã được ghi nhận vào lịch sử năng suất của bạn.');
  };

  const minutesDisplay = Math.floor(timeLeftSeconds / 60);
  const secondsDisplay = timeLeftSeconds % 60;
  const progressPercent = Math.round(
    ((presetMinutes * 60 - timeLeftSeconds) / (presetMinutes * 60)) * 100
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-1">
          <Timer className="w-3.5 h-3.5" />
          <span>Deep Work &amp; Pomodoro Workspace</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Không Gian Tập Trung Cao Độ
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Chỉ một công việc duy nhất và một mục tiêu trước mắt. Loại bỏ hoàn toàn sự xao nhãng.
        </p>
      </div>

      {/* Target Task Selector / Callout */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Gắn phiên tập trung này với công việc:
        </label>
        <select
          value={selectedTask?.id || ''}
          onChange={(e) => {
            const found = tasks.find((t) => t.id === e.target.value);
            setSelectedTask(found || null);
            onSelectTargetTask(found || null);
          }}
          className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#2b2e3a] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
        >
          {tasks
            .filter((t) => t.status !== 'done')
            .map((t) => (
              <option key={t.id} value={t.id}>
                [{t.category.toUpperCase()}] {t.title}
              </option>
            ))}
        </select>

        {selectedTask?.nextAction && (
          <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 bg-brand-50/50 dark:bg-brand-950/20 p-2.5 rounded-xl border border-brand-500/20">
            <span className="font-semibold text-brand-600 dark:text-brand-400">Next Action: </span>
            {selectedTask.nextAction}
          </div>
        )}
      </div>

      {/* Timer Presets */}
      <div className="flex justify-center gap-2">
        {[
          { label: '25 phút (Pomodoro)', mins: 25 },
          { label: '45 phút (Deep Work)', mins: 45 },
          { label: '50 phút', mins: 50 },
          { label: '15 phút (Sprint)', mins: 15 },
        ].map((item) => (
          <button
            key={item.mins}
            type="button"
            onClick={() => handleSelectPreset(item.mins)}
            disabled={isRunning}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              presetMinutes === item.mins
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-[#161821] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#262934] hover:bg-slate-50 disabled:opacity-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Circular / Big Timer Display */}
      <div className="relative p-10 rounded-3xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-lg text-center space-y-6">
        <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none">
          {String(minutesDisplay).padStart(2, '0')}:
          {String(secondsDisplay).padStart(2, '0')}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#121318] h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt đầu phiên</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setTimeLeftSeconds(presetMinutes * 60);
            }}
            className="p-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-[#1f222b] rounded-2xl transition-colors"
            title="Đặt lại đồng hồ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isRunning && (
            <button
              type="button"
              onClick={handleFinishEarly}
              className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1f222b] rounded-2xl transition-colors"
            >
              Hoàn thành sớm
            </button>
          )}
        </div>
      </div>

      {/* DISTRACTION PARKING LOT (Bãi đỗ suy nghĩ xao nhãng) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 font-bold">
              P
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bãi đỗ xao nhãng (Distraction Parking Lot)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {parkingLotItems.length} ý nghĩ đã đỗ
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Nếu có một suy nghĩ ngẫu hứng xuất hiện (muốn xem tin tức, nhớ ra một việc vặt...), hãy gõ vào đây để giải phóng bộ nhớ não bộ và tiếp tục tập trung!
        </p>

        <form onSubmit={handleAddDistraction} className="flex gap-2">
          <input
            type="text"
            value={newDistraction}
            onChange={(e) => setNewDistraction(e.target.value)}
            placeholder="Ghi nhanh ý nghĩ vụt qua tại đây..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="submit"
            disabled={!newDistraction.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors"
          >
            Đỗ lại
          </button>
        </form>

        {parkingLotItems.length > 0 && (
          <div className="space-y-2 pt-2">
            {parkingLotItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#121318] border border-slate-100 dark:border-[#20232c] text-xs text-slate-700 dark:text-slate-300"
              >
                <span>• {item}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteDistraction(idx)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Reflection Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-[#161821] border border-slate-200 dark:border-[#2a2d39] rounded-2xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tổng kết phiên tập trung
              </h3>
            </div>

            <form onSubmit={handleSaveSummary} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Bạn đã thực hiện được những gì trong phiên vừa qua?
                </label>
                <textarea
                  value={accomplishment}
                  onChange={(e) => setAccomplishment(e.target.value)}
                  placeholder="VD: Viết xong 3 hàm xử lý dataframe, đọc xong trang 15..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Đánh giá mức độ tập trung của bạn (1 đến 5 sao):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFocusScore(score)}
                      className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                        focusScore >= score
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                          : 'border-slate-200 dark:border-[#2a2d39] text-slate-300 dark:text-slate-600'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {parkingLotItems.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121318] text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Suy nghĩ đã đỗ trong Parking Lot ({parkingLotItems.length}):
                  </span>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    {parkingLotItems.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#22252e]">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                >
                  Lưu &amp; Ghi nhận thời gian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
