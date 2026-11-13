import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  HelpCircle,
  Split,
  Timer,
  FileEdit,
  BatteryCharging,
  RotateCcw,
  Sparkles,
  BarChart2,
  AlertTriangle,
  ListOrdered,
} from 'lucide-react';
import {
  Task,
  ProcrastinationLog,
  ProcrastinationBarrier,
  RecoveryActionType,
} from '../../types/momentum';

interface AntiProcrastinationModuleProps {
  tasks: Task[];
  targetTask: Task | null;
  onSelectTargetTask: (task: Task | null) => void;
  onPostponeTask: (
    taskId: string,
    barrier: ProcrastinationBarrier,
    barrierLabel: string,
    reasonNotes: string,
    actionChosen: RecoveryActionType,
    actionLabel: string
  ) => void;
  onStartFocus: (task: Task) => void;
  onStartBreakdown: (task: Task) => void;
  procrastinationLogs: ProcrastinationLog[];
}

export const AntiProcrastinationModule: React.FC<AntiProcrastinationModuleProps> = ({
  tasks,
  targetTask,
  onSelectTargetTask,
  onPostponeTask,
  onStartFocus,
  onStartBreakdown,
  procrastinationLogs,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(targetTask || tasks[0] || null);
  const [selectedBarrier, setSelectedBarrier] = useState<ProcrastinationBarrier | null>(null);
  const [userReasonNotes, setUserReasonNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'protocol' | 'analytics' | 'two_minute' | 'logs'>('protocol');

  // 2-Minute Start timer state
  const [twoMinSeconds, setTwoMinSeconds] = useState(120);
  const [twoMinRunning, setTwoMinRunning] = useState(false);

  useEffect(() => {
    if (targetTask) {
      setSelectedTask(targetTask);
    }
  }, [targetTask]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (twoMinRunning && twoMinSeconds > 0) {
      interval = setInterval(() => {
        setTwoMinSeconds((prev) => prev - 1);
      }, 1000);
    } else if (twoMinSeconds === 0 && twoMinRunning) {
      setTwoMinRunning(false);
      alert('🎉 2 phút đã trôi qua! Quán tính khởi động đã được thiết lập. Hãy tiếp tục làm việc nhé!');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [twoMinRunning, twoMinSeconds]);

  const barriers: {
    id: ProcrastinationBarrier;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    recommendedAction: RecoveryActionType;
    actionTitle: string;
    actionDetail: string;
    colorClass: string;
  }[] = [
    {
      id: 'no_start',
      title: 'Không biết bắt đầu từ đâu',
      description: 'Mơ hồ về bước đi cụ thể đầu tiên nên tâm lý ngần ngại bắt tay vào làm.',
      icon: HelpCircle,
      recommendedAction: 'task_breakdown',
      actionTitle: 'Tạo Next Action cụ thể 2-5 phút',
      actionDetail: 'Mở Task Breakdown để xác định chính xác hành động vật lý đầu tiên (VD: mở file, gõ 1 dòng).',
      colorClass: 'bg-sky-500',
    },
    {
      id: 'too_big',
      title: 'Công việc quá lớn / Quá tải',
      description: 'Cảm giác choáng ngợp trước khối lượng đồ sộ của dự án.',
      icon: Split,
      recommendedAction: 'chunk_small',
      actionTitle: 'Chia nhỏ thành các mẩu 15–30 phút',
      actionDetail: 'Không làm cả dự án trong một lần. Chỉ cam kết hoàn thành đúng 1 bước nhỏ 15 phút.',
      colorClass: 'bg-indigo-500',
    },
    {
      id: 'distracted',
      title: 'Đang mất tập trung / Muốn lướt mạng',
      description: 'Tâm trí bị lôi kéo bởi thông báo, tin tức và dopamine ngắn hạn.',
      icon: Timer,
      recommendedAction: 'focus_mode',
      actionTitle: 'Bật Focus Mode + Distraction Parking Lot',
      actionDetail: 'Bật phiên đếm giờ 25 phút. Bất kỳ ý nghĩ xao nhãng nào xuất hiện sẽ được ghi vào Parking Lot.',
      colorClass: 'bg-amber-500',
    },
    {
      id: 'perfectionism',
      title: 'Sợ làm không tốt / Cầu toàn',
      description: 'Lo sợ sản phẩm không hoàn hảo nên liên tục trì hoãn việc bắt đầu.',
      icon: FileEdit,
      recommendedAction: 'draft_mode',
      actionTitle: 'Done tối thiểu (Chế độ bản nháp xí xóa)',
      actionDetail: 'Cho phép bản thân tạo ra một bản nháp thô tệ nhất có thể. Hoàn thành hơn hoàn hảo!',
      colorClass: 'bg-purple-500',
    },
    {
      id: 'low_energy',
      title: 'Cạn năng lượng / Mệt mỏi',
      description: 'Cơ thể hoặc tinh thần quá tải sau nhiều giờ làm việc căng thẳng.',
      icon: BatteryCharging,
      recommendedAction: 'rest_or_light',
      actionTitle: 'Phiên bản siêu nhẹ hoặc nghỉ ngơi có chủ đích',
      actionDetail: 'Chọn làm một phiên bản chỉ 5 phút nhẹ nhàng, hoặc lên lịch nghỉ ngơi 20 phút không cảm giác tội lỗi.',
      colorClass: 'bg-rose-500',
    },
    {
      id: 'inconsistent',
      title: 'Không duy trì được / Đã bỏ lỡ trước đó',
      description: 'Cảm giác thất bại khi đã lỡ một ngày làm nản lòng không muốn quay lại.',
      icon: RotateCcw,
      recommendedAction: 'retry_plan',
      actionTitle: 'Kế hoạch phục hồi (Retry Plan)',
      actionDetail: 'ESOL không có streak phạt bạn. Hãy tái thiết lập với một mục tiêu nhỏ để lấy lại nhịp độ.',
      colorClass: 'bg-emerald-500',
    },
  ];

  // --- Analytics: Procrastination Breakdown Calculation ---
  const reasonAnalytics = React.useMemo(() => {
    const totalLogs = procrastinationLogs.length;
    const counts: Record<ProcrastinationBarrier, number> = {
      no_start: 0,
      too_big: 0,
      distracted: 0,
      perfectionism: 0,
      low_energy: 0,
      inconsistent: 0,
    };

    procrastinationLogs.forEach((log) => {
      if (counts[log.barrier] !== undefined) {
        counts[log.barrier] += 1;
      }
    });

    const breakdown = barriers.map((b) => {
      const count = counts[b.id] || 0;
      const percentage = totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0;
      return {
        ...b,
        count,
        percentage,
      };
    }).sort((a, b) => b.count - a.count);

    const topReason = breakdown[0]?.count > 0 ? breakdown[0] : null;

    const mostPostponedTasks = [...tasks]
      .filter((t) => t.postponedCount > 0)
      .sort((a, b) => b.postponedCount - a.postponedCount)
      .slice(0, 5);

    return {
      totalLogs,
      breakdown,
      topReason,
      mostPostponedTasks,
    };
  }, [procrastinationLogs, tasks]);

  const handleApplyAction = (action: RecoveryActionType) => {
    if (!selectedTask || !selectedBarrier) return;

    const barrierObj = barriers.find((b) => b.id === selectedBarrier);
    const barrierLabel = barrierObj?.title || 'Khác';
    const actionLabel = barrierObj?.actionTitle || 'Phục hồi';

    onPostponeTask(
      selectedTask.id,
      selectedBarrier,
      barrierLabel,
      userReasonNotes,
      action,
      actionLabel
    );

    if (action === 'task_breakdown' || action === 'chunk_small') {
      onStartBreakdown(selectedTask);
    } else if (action === 'focus_mode') {
      onStartFocus(selectedTask);
    } else if (action === 'two_minute_start') {
      setActiveTab('two_minute');
      setTwoMinSeconds(120);
      setTwoMinRunning(true);
    } else {
      alert(`Đã ghi nhận giải pháp phục hồi: "${actionLabel}". Tiếp tục tiến lên nào!`);
    }

    setSelectedBarrier(null);
    setUserReasonNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Release 2.0
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Anti-Procrastination OS
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chẩn đoán tâm lý 6 rào cản, phân tích điểm nghẽn hành vi (Reason Tracker) và bộ đếm 2-Minute Start.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181a22] p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'protocol'
                ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Chẩn đoán &amp; Phục hồi
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Phân tích rào cản (V2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('two_minute')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'two_minute'
                ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            2-Minute Start
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Nhật ký ({procrastinationLogs.length})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PROTOCOL VIEW                                          */}
      {/* ========================================================= */}
      {activeTab === 'protocol' && (
        <div className="space-y-6">
          {/* Step 1: Select Task */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821]">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. Chọn công việc bạn đang thấy ngần ngại hoặc bị trì hoãn:
            </label>
            <select
              value={selectedTask?.id || ''}
              onChange={(e) => {
                const found = tasks.find((t) => t.id === e.target.value);
                setSelectedTask(found || null);
                onSelectTargetTask(found || null);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#2b2e3a] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {tasks
                .filter((t) => t.status !== 'done')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.category.toUpperCase()}] {t.title} {t.postponedCount > 0 ? `(Đã hoãn ${t.postponedCount} lần)` : ''}
                  </option>
                ))}
            </select>
          </div>

          {/* Step 2: Diagnostic 6 Barriers */}
          {selectedTask && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. Điều gì đang thực sự cản trở bạn bắt đầu?
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {barriers.map((bar) => {
                  const Icon = bar.icon;
                  const isSelected = selectedBarrier === bar.id;
                  return (
                    <button
                      key={bar.id}
                      type="button"
                      onClick={() => setSelectedBarrier(bar.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 dark:bg-[#20232c] text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {bar.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {bar.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Prescription & Recovery Action */}
          {selectedTask && selectedBarrier && (
            <div className="p-5 rounded-2xl border border-brand-500/40 bg-gradient-to-br from-brand-50/40 via-white to-indigo-50/20 dark:from-brand-950/30 dark:via-[#161821] dark:to-indigo-950/20 space-y-4 animate-scale-in">
              {(() => {
                const bar = barriers.find((b) => b.id === selectedBarrier);
                if (!bar) return null;
                return (
                  <>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Đề xuất giải pháp phục hồi theo quy tắc:</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        👉 {bar.actionTitle}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {bar.actionDetail}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Ghi chú suy nghĩ của bạn lúc này (tùy chọn):
                      </label>
                      <input
                        type="text"
                        value={userReasonNotes}
                        onChange={(e) => setUserReasonNotes(e.target.value)}
                        placeholder="VD: Đang hơi mệt, sợ viết code bị lỗi..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-white dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-500/20">
                      {/* 3 rescue options */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyAction('reschedule')}
                          className="px-3 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#20232c] border border-slate-200 dark:border-[#2a2d39] rounded-lg transition-colors"
                          title="Thực sự cần làm nhưng đổi lịch sang ngày mai"
                        >
                          Dời lịch (Reschedule)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyAction('drop')}
                          className="px-3 py-1.5 text-[11px] font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-lg transition-colors"
                          title="Không còn cần thiết nữa, chủ động loại bỏ mà không ân hận"
                        >
                          Buông bỏ (Drop)
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyAction('two_minute_start')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl transition-colors border border-brand-500/30"
                        >
                          Bắt đầu trong 2 phút
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyAction(bar.recommendedAction)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                        >
                          Áp dụng giải pháp ngay
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. REASON TRACKER & BOTTLENECKS (V2 NEW FEATURE)          */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Bottleneck Highlight Card */}
          {reasonAnalytics.topReason ? (
            <div className="p-6 rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-50/40 via-white to-amber-50/20 dark:from-brand-950/40 dark:via-[#161821] dark:to-amber-950/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Điểm nghẽn hành vi lớn nhất của bạn (#1 Bottleneck)
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {reasonAnalytics.topReason.percentage}% các lần trì hoãn
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                "{reasonAnalytics.topReason.title}"
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {reasonAnalytics.topReason.description}
              </p>

              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#121318]/80 border border-brand-500/20 text-xs text-slate-700 dark:text-slate-200">
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  Giải pháp cốt lõi cho bạn:{' '}
                </span>
                {reasonAnalytics.topReason.actionTitle} — {reasonAnalytics.topReason.actionDetail}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] text-center text-xs text-slate-400">
              Chưa có đủ dữ liệu trì hoãn để phân tích. Hãy ghi nhận khi bạn gặp rào cản!
            </div>
          )}

          {/* Breakdown Chart */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Phân bổ 6 rào cản tâm lý (Procrastination Breakdown)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Tổng cộng: {reasonAnalytics.totalLogs} lần ghi nhận
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {reasonAnalytics.breakdown.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.count} lần ({item.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-[#121318] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.colorClass} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Postponed Tasks Ranking */}
          {reasonAnalytics.mostPostponedTasks.length > 0 && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Công việc bị hoãn nhiều lần nhất (Cần cứu ngay)
                </h3>
              </div>

              <div className="space-y-2">
                {reasonAnalytics.mostPostponedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-[#20232c] bg-slate-50/50 dark:bg-[#121318] text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Next Action: {t.nextAction || 'Chưa có bước đầu tiên'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500">
                        Hoãn {t.postponedCount} lần
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTask(t);
                          setActiveTab('protocol');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
                      >
                        Chẩn đoán
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTask(t);
                          setActiveTab('two_minute');
                          setTwoMinSeconds(120);
                          setTwoMinRunning(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      >
                        2-Phút
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. 2-MINUTE START VIEW                                    */}
      {/* ========================================================= */}
      {activeTab === 'two_minute' && (
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] text-center max-w-lg mx-auto space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
              Kỹ thuật 2-Phút Khởi Động
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Chỉ cần làm đúng 120 giây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Không cam kết làm hết. Bạn chỉ cần mở file và làm đúng 2 phút. Sau 2 phút, nếu muốn dừng bạn hoàn toàn có quyền dừng lại.
            </p>
          </div>

          <div className="text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {Math.floor(twoMinSeconds / 60)}:
            {String(twoMinSeconds % 60).padStart(2, '0')}
          </div>

          {selectedTask && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121318] text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-[#22252e]">
              Công việc: <span className="font-bold text-brand-600 dark:text-brand-400">{selectedTask.title}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTwoMinRunning(!twoMinRunning)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
            >
              {twoMinRunning ? 'Tạm dừng' : 'Bắt đầu 2 phút ngay'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTwoMinRunning(false);
                setTwoMinSeconds(120);
              }}
              className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PROCRASTINATION LOG VIEW                               */}
      {/* ========================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Lịch sử các lần chẩn đoán và phục hồi:
          </div>
          {procrastinationLogs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200 dark:border-[#262934]">
              Chưa có bản ghi nào.
            </div>
          ) : (
            procrastinationLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {log.taskTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-rose-500">Rào cản:</span> {log.barrierLabel}
                  {log.reasonNotes && ` — "${log.reasonNotes}"`}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-emerald-500">Giải pháp:</span> {log.actionLabel}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
