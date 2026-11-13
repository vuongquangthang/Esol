import React, { useState, useEffect, useRef } from 'react';
import { X, CornerDownLeft, Sparkles } from 'lucide-react';
import { LifeDomain, Priority, Task, DOMAINS } from '../types/momentum';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: Partial<Task> & { title: string }) => void;
  currentPriorityCount: number;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  currentPriorityCount,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LifeDomain>('study');
  const [priority, setPriority] = useState<Priority>('medium');
  const [nextAction, setNextAction] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [isTodayPriority, setIsTodayPriority] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    if (isTodayPriority && currentPriorityCount >= 3) {
      alert('Bạn đã có đủ 3 ưu tiên chính cho hôm nay! Công việc sẽ được lưu mà không ghim vào Top 3.');
      setIsTodayPriority(false);
    }

    onAddTask({
      title: trimmed,
      category,
      priority,
      nextAction: nextAction.trim() || 'Xác định bước đầu tiên 2-5 phút',
      estimatedMinutes,
      isTodayPriority: isTodayPriority && currentPriorityCount < 3,
      status: 'todo',
    });

    setTitle('');
    setNextAction('');
    setIsTodayPriority(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#16181f] border border-slate-200 dark:border-[#2a2d39] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#22252e]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ghi nhận nhanh (Quick Capture)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1f222b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nhiệm vụ cần làm <span className="text-rose-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Ôn tập thuật toán quy hoạch động, Làm bài lab AI..."
              className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Hành động đầu tiên (Next Action - 2 đến 5 phút)
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="VD: Mở slide trang 15, gõ 3 dòng code khởi tạo..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Xác định hành động cụ thể giúp đánh bại sự trì hoãn khi bắt đầu.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Lĩnh vực
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LifeDomain)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                {(Object.keys(DOMAINS) as LifeDomain[]).map((d) => (
                  <option key={d} value={d}>
                    {DOMAINS[d].vietnameseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="high">Cao</option>
                <option value="medium">Vừa</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Thời gian (phút)
              </label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 30)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                min={5}
                max={180}
              />
            </div>
          </div>

          {/* Today priority toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121318] border border-slate-200/60 dark:border-[#22252e]">
            <div className="flex items-center gap-2">
              <input
                id="isTodayPriority"
                type="checkbox"
                checked={isTodayPriority}
                onChange={(e) => setIsTodayPriority(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <label htmlFor="isTodayPriority" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Đặt làm 1 trong 3 Ưu tiên hàng đầu hôm nay
              </label>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({currentPriorityCount}/3)
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#22252e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1c23] rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm transition-all"
            >
              <span>Lưu công việc</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
