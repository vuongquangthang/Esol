import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BookOpen,
  Edit2,
  Save,
  Download,
} from 'lucide-react';
import { TransformationStats } from '../../types/momentum';
import { notify } from '../../utils/feedback';

interface TransformationModuleProps {
  stats: TransformationStats;
  onUpdateReflection?: (reflection: {
    improvedHabits: string;
    remainingChallenges: string;
    nextMonthChanges: string;
  }) => void;
  onExportData?: () => void;
}

export const TransformationModule: React.FC<TransformationModuleProps> = ({
  stats,
  onUpdateReflection,
  onExportData,
}) => {
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [improvedHabits, setImprovedHabits] = useState(stats.reflection.improvedHabits);
  const [remainingChallenges, setRemainingChallenges] = useState(stats.reflection.remainingChallenges);
  const [nextMonthChanges, setNextMonthChanges] = useState(stats.reflection.nextMonthChanges);

  const weeks = [
    { label: 'W1 (Tuần 1)', rate: stats.week1.completionRate, focus: stats.week1.focusHours },
    { label: 'W2 (Tuần 2)', rate: stats.week2.completionRate, focus: stats.week2.focusHours },
    { label: 'W3 (Tuần 3)', rate: stats.week3.completionRate, focus: stats.week3.focusHours },
    { label: 'W4 (Tuần 4)', rate: stats.week4.completionRate, focus: stats.week4.focusHours },
  ];

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateReflection) {
      onUpdateReflection({
        improvedHabits,
        remainingChallenges,
        nextMonthChanges,
      });
    }
    setIsEditingReflection(false);
    notify('🎉 Đã cập nhật thành công đánh giá chuyển hóa 30 ngày của bạn!', 'success');
  };

  const kpis = [
    {
      kpi: 'Task Completion Rate',
      name: 'Tỷ lệ hoàn thành công việc',
      formula: 'Công việc hoàn thành / Công việc đến hạn',
      desc: 'Công việc hủy được loại trừ; công việc chưa đến hạn không bị tính là thất bại.',
    },
    {
      kpi: 'Task Start Rate',
      name: 'Tỷ lệ bắt tay vào làm',
      formula: 'Công việc đã bắt đầu / Công việc được lên kế hoạch',
      desc: 'Đo lường khả năng vượt qua quán tính ì ban đầu nhờ Next Action.',
    },
    {
      kpi: 'Postponement Rate',
      name: 'Tần suất trì hoãn',
      formula: 'Số lần trì hoãn / Số công việc được lên kế hoạch',
      desc: 'Mục tiêu là giảm dần qua các tuần khi kế hoạch ngày càng thực tế.',
    },
    {
      kpi: 'Focus Time',
      name: 'Thời gian tập trung sâu (Deep Work)',
      formula: 'Tổng thời gian các phiên Focus Mode ghi nhận',
      desc: 'Chỉ tính các phiên có mục tiêu và hoàn thành phản chiếu.',
    },
    {
      kpi: 'Habit Consistency',
      name: 'Độ nhất quán thói quen',
      formula: 'Số lần thực hiện / Số lần dự kiến',
      desc: 'Không yêu cầu streak tuyệt đối, tập trung vào việc phục hồi sau khi lỡ ngày.',
    },
    {
      kpi: 'Plan Accuracy',
      name: 'Độ chính xác kế hoạch',
      formula: 'Thời gian thực tế so với thời gian dự kiến',
      desc: 'Giúp bạn rèn luyện trực giác ước lượng khối lượng công việc ngày càng chuẩn.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>My 30-Day Transformation (Release 2.0)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Báo Cáo Chuyển Hóa 30 Ngày
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            "Không phải bạn đã hoàn thành bao nhiêu việc, mà là bạn đã thay đổi cách hành động của mình như thế nào."
          </p>
        </div>

        {onExportData && (
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất báo cáo JSON</span>
          </button>
        )}
      </div>

      {/* 1. BEFORE & AFTER COMPARISON (Tuần 1 vs Tuần 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tuần 1 Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-slate-50/50 dark:bg-[#14161d] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Giai đoạn bắt đầu
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              TUẦN 1
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-4xl font-black font-mono text-slate-700 dark:text-slate-300">
              {stats.week1.completionRate}%
            </div>
            <p className="text-xs text-slate-500">Tỷ lệ hoàn thành công việc</p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-[#20232c] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Việc bị trì hoãn:</span>
              <span className="font-semibold text-rose-500">{stats.week1.postponedCount} lần</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời gian tập trung (Focus):</span>
              <span className="font-semibold">{stats.week1.focusHours} giờ / tuần</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duy trì thói quen:</span>
              <span className="font-semibold">{stats.week1.habitConsistency}%</span>
            </div>
          </div>
        </div>

        {/* Tuần 4 Card */}
        <div className="p-6 rounded-2xl border border-brand-500/40 bg-gradient-to-br from-brand-50/30 via-white to-emerald-50/20 dark:from-brand-950/40 dark:via-[#161821] dark:to-emerald-950/20 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Chuyển hóa sau 30 ngày
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-600 text-white shadow-sm">
              TUẦN 4
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {stats.week4.completionRate}%
              </div>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                +{stats.week4.completionRate - stats.week1.completionRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tỷ lệ hoàn thành công việc</p>
          </div>

          <div className="pt-2 border-t border-brand-500/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Việc bị trì hoãn:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                Giảm còn {stats.week4.postponedCount} lần (-{stats.week1.postponedCount - stats.week4.postponedCount})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Thời gian tập trung (Focus):</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {stats.week4.focusHours} giờ (+{stats.week4.focusHours - stats.week1.focusHours}h)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Duy trì thói quen:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.week4.habitConsistency}% (+{stats.week4.habitConsistency - stats.week1.habitConsistency}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BAR CHART: 4-Week Progression */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tiến độ hoàn thành công việc qua 4 tuần (Weekly Completion Rate)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Chu kỳ 30 ngày</span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-4 gap-4 h-48 items-end pt-4 pb-2 border-b border-slate-100 dark:border-[#20232c]">
          {weeks.map((wk, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {wk.rate}%
              </span>
              <div
                className="w-full max-w-[64px] bg-gradient-to-t from-brand-600 to-indigo-500 rounded-t-xl transition-all duration-700 shadow-sm"
                style={{ height: `${wk.rate}%` }}
              />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center">
                {wk.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 3-Question Transformation Reflection (Editable in V2) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ba câu hỏi chuyển hóa sau 30 ngày (Personal Reflection)</span>
          </h3>

          {!isEditingReflection ? (
            <button
              type="button"
              onClick={() => setIsEditingReflection(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa đánh giá</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingReflection(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
            >
              Hủy
            </button>
          )}
        </div>

        {isEditingReflection ? (
          <form onSubmit={handleSaveReflection} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                1. Tôi đã cải thiện được hành vi nào rõ rệt nhất?
              </label>
              <textarea
                value={improvedHabits}
                onChange={(e) => setImprovedHabits(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                2. Tôi vẫn đang gặp vấn đề gì cần lưu ý?
              </label>
              <textarea
                value={remainingChallenges}
                onChange={(e) => setRemainingChallenges(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                3. Tôi nên thay đổi điều gì trong chu kỳ 30 ngày tiếp theo?
              </label>
              <textarea
                value={nextMonthChanges}
                onChange={(e) => setNextMonthChanges(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu đánh giá 30 ngày</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121318] border border-slate-100 dark:border-[#22252e]">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                1. Tôi đã cải thiện được hành vi nào rõ rệt nhất?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {stats.reflection.improvedHabits}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121318] border border-slate-100 dark:border-[#22252e]">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                2. Tôi vẫn đang gặp vấn đề gì cần lưu ý?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {stats.reflection.remainingChallenges}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121318] border border-slate-100 dark:border-[#22252e]">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                3. Tôi nên thay đổi điều gì trong chu kỳ 30 ngày tiếp theo?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {stats.reflection.nextMonthChanges}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. PRODUCTIVITY KPI GLOSSARY (Release 2.0) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Bộ định nghĩa chỉ số hành vi (Productivity KPI Glossary)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {kpis.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-[#121318] border border-slate-100 dark:border-[#20232c] space-y-1 text-xs"
            >
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400">
                  {item.kpi}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Công thức: {item.formula}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
