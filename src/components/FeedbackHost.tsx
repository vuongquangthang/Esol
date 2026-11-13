import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { FeedbackTone, subscribeToFeedback } from '../utils/feedback';

interface Notice {
  id: number;
  message: string;
  tone: FeedbackTone;
}

interface Confirmation {
  message: string;
  resolve: (confirmed: boolean) => void;
}

const toneStyles: Record<FeedbackTone, { icon: React.ReactNode; className: string }> = {
  info: {
    icon: <Info className="w-5 h-5" />,
    className: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
  },
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    className: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
  },
};

export const FeedbackHost: React.FC = () => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  useEffect(() => {
    return subscribeToFeedback((detail) => {
      if (detail.kind === 'confirm') {
        setConfirmation({ message: detail.message, resolve: detail.resolve });
      } else {
        setNotice({ id: Date.now(), message: detail.message, tone: detail.tone });
      }
    });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const resolveConfirmation = (confirmed: boolean) => {
    confirmation?.resolve(confirmed);
    setConfirmation(null);
  };

  return (
    <>
      {notice && (
        <div className="fixed top-5 right-5 z-[100] w-[min( calc(100vw-2rem), 24rem)]" role="status" aria-live="polite">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-[#2a2d39] bg-white dark:bg-[#161821] p-4 shadow-2xl animate-fade-in">
            <div className={`mt-0.5 rounded-lg p-2 ${toneStyles[notice.tone].className}`}>
              {toneStyles[notice.tone].icon}
            </div>
            <p className="flex-1 text-sm leading-5 text-slate-700 dark:text-slate-200">{notice.message}</p>
            <button type="button" onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Đóng thông báo">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {confirmation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="presentation">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#2a2d39] bg-white dark:bg-[#161821] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="feedback-confirmation-title">
            <h2 id="feedback-confirmation-title" className="text-base font-bold text-slate-900 dark:text-white">Xác nhận thao tác</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{confirmation.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => resolveConfirmation(false)} className="rounded-xl border border-slate-200 dark:border-[#2b2e3a] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f222b]">
                Hủy
              </button>
              <button type="button" onClick={() => resolveConfirmation(true)} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

