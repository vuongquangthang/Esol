import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Star,
  Trash2,
  Volume2,
  VolumeX,
  Bell,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, FocusSession } from '../../types/momentum';
import { notify, requestConfirmation } from '../../utils/feedback';
import { soundManager, SoundTheme } from '../../utils/soundEffects';

type FocusMode = 'pomodoro' | 'deep_work' | 'stopwatch';
type PomodoroPhase = 'work' | 'break';

interface FocusModuleProps {
  tasks: Task[];
  targetTask: Task | null;
  onRecordFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  onSelectTargetTask: (task: Task | null) => void;
  isVisible?: boolean;
}

export const FocusModule: React.FC<FocusModuleProps> = ({
  tasks,
  targetTask,
  onRecordFocusSession,
  onSelectTargetTask,
  isVisible = true,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    targetTask || tasks.find((t) => t.isTodayPriority && t.status !== 'done') || tasks[0] || null
  );

  const [focusMode, setFocusMode] = useState<FocusMode>('pomodoro');
  const [presetMinutes, setPresetMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(60);
  const [pomodoroCycles, setPomodoroCycles] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [totalFocusSeconds, setTotalFocusSeconds] = useState<number>(0);

  // Distraction Parking Lot
  const [parkingLotItems, setParkingLotItems] = useState<string[]>([]);
  const [newDistraction, setNewDistraction] = useState<string>('');

  // End of Session Summary Modal
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [accomplishment, setAccomplishment] = useState('');
  const [focusScore, setFocusScore] = useState<number>(5);

  // Sound Notification State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isSoundEnabled());
  const [soundTheme, setSoundTheme] = useState<SoundTheme>(() => soundManager.getTheme());

  const toggleSound = () => {
    soundManager.unlockAudio();
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    if (next) {
      soundManager.testCurrentSound();
      notify('🔔 Đã bật âm thanh chuông báo khi kết thúc đếm ngược.', 'info');
    } else {
      notify('🔕 Đã tắt âm thanh thông báo.', 'info');
    }
  };

  const handleThemeChange = (newTheme: SoundTheme) => {
    soundManager.unlockAudio();
    setSoundTheme(newTheme);
    soundManager.setTheme(newTheme);
    soundManager.testCurrentSound();
    notify(`Đã đổi âm điệu: ${newTheme === 'zen_bell' ? 'Chuông thiền (Zen Bell)' : newTheme === 'marimba' ? 'Marimba vui tươi' : 'Chuông cổ điển'}`, 'info');
  };

  const handleTestSound = () => {
    soundManager.unlockAudio();
    soundManager.testCurrentSound();
    notify('🔔 Đang phát thử âm thanh chuông báo kết thúc...', 'info');
  };

  const handleToggleRunning = () => {
    soundManager.unlockAudio();
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (targetTask) {
      setSelectedTask(targetTask);
    }
  }, [targetTask]);

  // Handle timer countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && (focusMode === 'stopwatch' || timeLeftSeconds > 0)) {
      timer = setInterval(() => {
        if (focusMode === 'stopwatch') {
          setTimeLeftSeconds((prev) => prev + 1);
          setTotalFocusSeconds((prev) => prev + 1);
        } else {
          setTimeLeftSeconds((prev) => prev - 1);
          if (focusMode === 'deep_work' || pomodoroPhase === 'work') {
            setTotalFocusSeconds((prev) => prev + 1);
          }
        }
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning && focusMode !== 'stopwatch') {
      if (focusMode === 'pomodoro' && pomodoroPhase === 'work' && currentCycle < pomodoroCycles) {
        setPomodoroPhase('break');
        setTimeLeftSeconds(presetMinutes === 25 ? 5 * 60 : 10 * 60);
        soundManager.playBreakChime();
        notify(`Chu kỳ ${currentCycle} đã hoàn thành. Bắt đầu nghỉ ${presetMinutes === 25 ? 5 : 10} phút.`, 'success');
      } else if (focusMode === 'pomodoro' && pomodoroPhase === 'break') {
        setCurrentCycle((prev) => prev + 1);
        setPomodoroPhase('work');
        setTimeLeftSeconds(presetMinutes * 60);
        soundManager.playResumeChime();
        notify(`Hết giờ nghỉ. Bắt đầu chu kỳ ${currentCycle + 1}/${pomodoroCycles}.`, 'info');
      } else {
        setIsRunning(false);
        soundManager.playCompletionChime();
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
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeftSeconds, focusMode, pomodoroPhase, currentCycle, pomodoroCycles, presetMinutes]);

  const resetTimer = (mode = focusMode, durationMinutes = mode === 'deep_work' ? customMinutes : presetMinutes) => {
    setIsRunning(false);
    setPomodoroPhase('work');
    setCurrentCycle(1);
    setTotalFocusSeconds(0);
    setTimeLeftSeconds(mode === 'stopwatch' ? 0 : durationMinutes * 60);
  };

  const handleSelectPomodoro = (mins: number) => {
    setFocusMode('pomodoro');
    setPresetMinutes(mins);
    resetTimer('pomodoro', mins);
  };

  const handleSelectDeepWork = () => {
    setFocusMode('deep_work');
    resetTimer('deep_work', customMinutes);
  };

  const handleSelectStopwatch = () => {
    setFocusMode('stopwatch');
    resetTimer('stopwatch');
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

  const handleFinishEarly = async () => {
    if (await requestConfirmation('Bạn có muốn kết thúc phiên làm việc ngay bây giờ để ghi nhận kết quả không?')) {
      setIsRunning(false);
      setIsSummaryModalOpen(true);
    }
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const actualDuration = Math.max(1, Math.round(totalFocusSeconds / 60));

    onRecordFocusSession({
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title || 'Phiên làm việc tự do',
      durationMinutes: actualDuration,
      focusScore,
      accomplishment: accomplishment.trim() || 'Hoàn thành phiên làm việc đúng kế hoạch',
      distractions: parkingLotItems,
    });

    setIsSummaryModalOpen(false);
    setAccomplishment('');
    setParkingLotItems([]);
    resetTimer();
    notify('🎉 Tuyệt vời! Phiên làm việc đã được ghi nhận vào lịch sử năng suất của bạn.', 'success');
  };

  const minutesDisplay = Math.floor(timeLeftSeconds / 60);
  const secondsDisplay = timeLeftSeconds % 60;
  const activeDurationSeconds = focusMode === 'deep_work' ? customMinutes * 60 : presetMinutes * 60;
  const progressPercent = focusMode === 'stopwatch'
    ? 100
    : Math.max(0, Math.min(100, Math.round((timeLeftSeconds / activeDurationSeconds) * 100)));

  return (
    <div className={`${isVisible ? 'block' : 'hidden'} space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto`}>
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

      {/* Focus Modes */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: 'Pomodoro 25/5', mode: 'pomodoro' as FocusMode, action: () => handleSelectPomodoro(25), active: focusMode === 'pomodoro' && presetMinutes === 25 },
          { label: 'Pomodoro 50/10', mode: 'pomodoro' as FocusMode, action: () => handleSelectPomodoro(50), active: focusMode === 'pomodoro' && presetMinutes === 50 },
          { label: 'Làm việc sâu', mode: 'deep_work' as FocusMode, action: handleSelectDeepWork, active: focusMode === 'deep_work' },
          { label: 'Đếm giờ tập trung', mode: 'stopwatch' as FocusMode, action: handleSelectStopwatch, active: focusMode === 'stopwatch' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            disabled={isRunning}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              item.active
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-[#161821] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#262934] hover:bg-slate-50 disabled:opacity-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {focusMode === 'pomodoro' && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            Số chu kỳ
            <select
              value={pomodoroCycles}
              onChange={(e) => {
                setPomodoroCycles(Number(e.target.value));
                resetTimer('pomodoro', presetMinutes);
              }}
              disabled={isRunning}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold dark:border-[#2b2e3a] dark:bg-[#161821]"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((cycle) => (
                <option key={cycle} value={cycle}>{cycle} vòng</option>
              ))}
            </select>
          </label>
          <span className="text-slate-400">
            {presetMinutes === 25 ? 'Làm 25 phút · Nghỉ 5 phút' : 'Làm 50 phút · Nghỉ 10 phút'}
          </span>
        </div>
      )}

      {focusMode === 'deep_work' && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <label htmlFor="deep-work-duration">Thời lượng đếm ngược (phút)</label>
          <input
            id="deep-work-duration"
            type="number"
            min={1}
            max={720}
            value={customMinutes}
            disabled={isRunning}
            onChange={(e) => {
              const nextMinutes = Math.max(1, Number(e.target.value) || 1);
              setCustomMinutes(nextMinutes);
              setTimeLeftSeconds(nextMinutes * 60);
              setTotalFocusSeconds(0);
            }}
            className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center font-semibold dark:border-[#2b2e3a] dark:bg-[#161821]"
          />
          {[-15, 15, 30, 60].map((adjustment) => (
            <button
              key={adjustment}
              type="button"
              disabled={isRunning}
              onClick={() => {
                const nextMinutes = Math.max(1, customMinutes + adjustment);
                setCustomMinutes(nextMinutes);
                setTimeLeftSeconds(nextMinutes * 60);
                setTotalFocusSeconds(0);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2b2e3a] dark:bg-[#161821] dark:text-slate-300 dark:hover:border-brand-500 dark:hover:bg-brand-950/30 dark:hover:text-brand-400"
            >
              {adjustment > 0 ? `+${adjustment}` : adjustment} phút
            </button>
          ))}
        </div>
      )}

      {/* Circular / Big Timer Display */}
      <div className="relative p-10 rounded-3xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-lg text-center space-y-6">
        <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none">
          {focusMode === 'pomodoro' && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              {pomodoroPhase === 'work' ? `Làm việc · Vòng ${currentCycle}/${pomodoroCycles}` : 'Nghỉ'}
            </div>
          )}
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
            onClick={handleToggleRunning}
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
              resetTimer();
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

        {/* Sound Notification Control Bar */}
        <div className="pt-5 border-t border-slate-100 dark:border-[#22252e] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                soundEnabled
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-500/20'
                  : 'bg-slate-100 text-slate-500 dark:bg-[#1f222b] dark:text-slate-400 border border-transparent'
              }`}
              title={soundEnabled ? 'Bấm để tắt âm thanh thông báo' : 'Bấm để bật âm thanh thông báo'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Âm chuông: Bật</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Âm chuông: Tắt</span>
                </>
              )}
            </button>

            {soundEnabled && (
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Chọn âm điệu chuông"
                  value={soundTheme}
                  onChange={(e) => handleThemeChange(e.target.value as SoundTheme)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#2b2e3a] bg-slate-50 dark:bg-[#1a1c24] text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="zen_bell">🔔 Chuông thiền (Zen Bell)</option>
                  <option value="marimba">🎶 Marimba vui tươi</option>
                  <option value="classic_chime">🔔 Chuông cổ điển (Ding-dong)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {soundEnabled && (
              <button
                type="button"
                onClick={handleTestSound}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2b2e3a] bg-slate-50 dark:bg-[#1a1c24] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232631] font-semibold text-xs transition-colors"
                title="Nghe thử âm thanh chuông kết thúc"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Nghe thử chuông</span>
              </button>
            )}

            <span className="text-[11px] text-slate-400 dark:text-slate-400 hidden sm:inline">
              Tự động chuông khi hết giờ đếm ngược
            </span>
          </div>
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
