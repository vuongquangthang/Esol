import React, { useState } from 'react';
import {
  CalendarCheck,
  Save,
  History,
} from 'lucide-react';
import { WeeklyReview } from '../../types/momentum';

interface WeeklyReviewModuleProps {
  weeklyReviews: WeeklyReview[];
  onSaveWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  currentWeeklyStats: {
    completionRate: number;
    startRate: number;
    postponementCount: number;
    focusHours: number;
    habitRate: number;
  };
  currentWeekNumber?: number;
}

export const WeeklyReviewModule: React.FC<WeeklyReviewModuleProps> = ({
  weeklyReviews,
  onSaveWeeklyReview,
  currentWeeklyStats,
  currentWeekNumber = 46,
}) => {
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatPostponed, setWhatPostponed] = useState('');
  const [rootCauses, setRootCauses] = useState('');
  const [unrealisticPlans, setUnrealisticPlans] = useState('');
  const [nextWeekChanges, setNextWeekChanges] = useState('');

  const previousReview = weeklyReviews[0] || null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatWentWell.trim() && !nextWeekChanges.trim()) {
      alert('Vui lòng chia sẻ ít nhất điều bạn đã làm tốt và kế hoạch cải tiến cho tuần sau!');
      return;
    }

    onSaveWeeklyReview({
      weekNumber: currentWeekNumber,
      year: 2026,
      startDate: '2026-11-09',
      endDate: '2026-11-15',
      whatWentWell,
      whatPostponed,
      rootCauses,
      unrealisticPlans,
      nextWeekChanges,
      stats: currentWeeklyStats,
    });

    setWhatWentWell('');
    setWhatPostponed('');
    setRootCauses('');
    setUnrealisticPlans('');
    setNextWeekChanges('');
    alert('🎉 Đã hoàn tất và lưu lại phiên Weekly Review! Chúc bạn có tuần mới tràn đầy năng suất!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-1">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Phiên Đánh Giá Tuần (Weekly Review Ritual — Release 3.0)</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Weekly Review — Tuần {currentWeekNumber}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Nhìn lại tuần qua với góc nhìn trung thực, không phán xét. Tinh chỉnh hệ thống để tuần tới hoạt động thực tế hơn.
        </p>
      </div>

      {/* Auto-Aggregated Weekly Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center">
          <div className="text-[10px] font-semibold text-slate-400">Hoàn thành việc</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {currentWeeklyStats.completionRate}%
          </div>
          {previousReview && (
            <div className="text-[10px] text-emerald-500 mt-0.5">
              So với tuần trước: {currentWeeklyStats.completionRate >= previousReview.stats.completionRate ? '+' : ''}
              {currentWeeklyStats.completionRate - previousReview.stats.completionRate}%
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center">
          <div className="text-[10px] font-semibold text-slate-400">Focus Time tuần</div>
          <div className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">
            {currentWeeklyStats.focusHours}h
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Deep Work thực tế</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center">
          <div className="text-[10px] font-semibold text-slate-400">Lần trì hoãn</div>
          <div className="text-xl font-bold text-amber-500 mt-1">
            {currentWeeklyStats.postponementCount} lần
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đã ghi vào Log</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center">
          <div className="text-[10px] font-semibold text-slate-400">Duy trì thói quen</div>
          <div className="text-xl font-bold text-emerald-500 mt-1">
            {currentWeeklyStats.habitRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tính cả Mini-Habit</div>
        </div>
      </div>

      {/* Form 5 Core Questions */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            1. Điều gì bạn đã thực hiện tốt trong tuần qua?
          </label>
          <textarea
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder="Ghi nhận những thắng lợi nhỏ, thời gian tập trung tốt, thói quen duy trì..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            2. Những công việc hoặc thói quen nào thường xuyên bị trì hoãn?
          </label>
          <textarea
            value={whatPostponed}
            onChange={(e) => setWhatPostponed(e.target.value)}
            placeholder="Những đầu việc bị dời lịch nhiều hơn 2 lần..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            3. Nguyên nhân cốt lõi dẫn đến việc đó là gì?
          </label>
          <textarea
            value={rootCauses}
            onChange={(e) => setRootCauses(e.target.value)}
            placeholder="Do quá tải? Chưa có Next Action cụ thể? Hay mệt mỏi thể chất?..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            4. Kế hoạch nào đã được đặt ra quá thiếu thực tế?
          </label>
          <textarea
            value={unrealisticPlans}
            onChange={(e) => setUnrealisticPlans(e.target.value)}
            placeholder="Nhận quá nhiều việc trong ngày? Kỳ vọng học 5 tiếng sau giờ làm?..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            5. Một đến hai điều quan trọng nhất bạn sẽ điều chỉnh cho tuần tới?
          </label>
          <textarea
            value={nextWeekChanges}
            onChange={(e) => setNextWeekChanges(e.target.value)}
            placeholder="Cam kết chỉ tối đa 3 ưu tiên mỗi ngày, đi ngủ trước 23h..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#20232c]">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu phiên đánh giá tuần</span>
          </button>
        </div>
      </form>

      {/* Review Archive */}
      {weeklyReviews.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <History className="w-4 h-4" />
            <span>Lịch sử các tuần trước ({weeklyReviews.length})</span>
          </div>

          <div className="space-y-3">
            {weeklyReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-400 font-semibold">
                  <span>Tuần {rev.weekNumber} / {rev.year}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Đã làm tốt: <span className="font-normal text-slate-600 dark:text-slate-300">{rev.whatWentWell}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-rose-500">Trì hoãn &amp; Nguyên nhân:</span> {rev.whatPostponed} — {rev.rootCauses}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-emerald-500">Điều chỉnh tuần sau:</span> {rev.nextWeekChanges}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
