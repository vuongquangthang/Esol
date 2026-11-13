import React, { useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  ShieldCheck,
  Database,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

interface SettingsModuleProps {
  isDark: boolean;
  onToggleTheme: () => void;
  showDemoData: boolean;
  onToggleDemoData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetToMock: () => void;
  onClearAllData: () => Promise<void>;
  statsPreview?: {
    tasksCount: number;
    habitsCount: number;
    focusSessionsCount: number;
    procLogsCount: number;
    financeCount: number;
    healthCount: number;
  };
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  isDark,
  onToggleTheme,
  showDemoData,
  onToggleDemoData,
  onExportData,
  onImportData,
  onResetToMock,
  onClearAllData,
  statsPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Release 2.0
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Cài đặt &amp; Quản trị Dữ liệu
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Toàn bộ dữ liệu của bạn được lưu trữ an toàn ngay trên trình duyệt (Offline-first &amp; Client-side).
        </p>
      </div>

      {/* Theme Preference */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Giao diện ứng dụng
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hiện tại: {isDark ? 'Modern Dark Mode' : 'Clean Light Mode'}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#2b2e3a] bg-slate-50 dark:bg-[#1f222b] hover:bg-slate-100 transition-colors"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Chuyển sang Sáng</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>Chuyển sang Tối</span>
            </>
          )}
        </button>
      </div>

      {/* Demo Data Visibility */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            {showDemoData ? (
              <Eye className="w-4 h-4 text-brand-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
            )}
            <span>Hiển thị dữ liệu mẫu</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {showDemoData
              ? 'Đang hiển thị dữ liệu mẫu để bạn khám phá các tính năng.'
              : 'Đang ẩn dữ liệu mẫu. Dữ liệu của bạn vẫn được giữ nguyên, không bị xóa.'}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={showDemoData}
          onClick={onToggleDemoData}
          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161821] ${
            showDemoData ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
          aria-label="Bật hoặc tắt dữ liệu mẫu"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform ${
              showDemoData ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Backup & Restore (V2 Enhanced) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-500" />
            <span>Sao lưu &amp; Phục hồi dữ liệu cá nhân (Backup &amp; Restore)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Xuất toàn bộ công việc, thói quen, dự án, phiên tập trung, thu chi và sức khỏe ra tệp JSON để lưu trữ an toàn hoặc chuyển đổi giữa các thiết bị.
          </p>
        </div>

        {/* Stats Preview of stored data */}
        {statsPreview && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#121318] border border-slate-100 dark:border-[#20232c] text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Công việc (Tasks):</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.tasksCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Thói quen (Habits):</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.habitsCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Phiên Focus:</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.focusSessionsCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Nhật ký trì hoãn:</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.procLogsCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Giao dịch thu chi:</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.financeCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Nhật ký sức khỏe:</span>{' '}
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {statsPreview.healthCount}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất dữ liệu JSON (Export)</span>
          </button>

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
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1f222b] hover:bg-slate-200 dark:hover:bg-[#282b36] border border-slate-200 dark:border-[#2b2e3a] rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Khôi phục từ JSON (Import)</span>
          </button>

          <button
            type="button"
            onClick={onResetToMock}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nạp lại dữ liệu mẫu gốc</span>
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-[#161821] space-y-3">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Xóa toàn bộ dữ liệu</h3>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Xóa toàn bộ dữ liệu ESOL trên trình duyệt này. Thao tác không thể hoàn tác.
          Bạn có thể xuất bản sao lưu JSON ở trên trước khi xóa.
        </p>
        <button
          type="button"
          onClick={onClearAllData}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Xóa toàn bộ dữ liệu</span>
        </button>
      </div>

      {/* 3 Design Boundaries of ESOL */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-slate-50/50 dark:bg-[#14161d] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>3 Giới Hạn Thiết Kế Cốt Lõi Của ESOL</span>
        </h4>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-brand-600 dark:text-brand-400">1.</span>
            <span>Không để việc ghi chép và cập nhật ứng dụng tốn nhiều thời gian hơn việc thực sự làm việc.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-brand-600 dark:text-brand-400">2.</span>
            <span>Không đưa quá nhiều biểu đồ, thông báo và chỉ số làm rối mắt Dashboard. Giữ cho tâm trí tĩnh lặng.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-brand-600 dark:text-brand-400">3.</span>
            <span>Tuyệt đối không dùng các hình thức phạt, trừ điểm tiêu cực hay chuỗi ngày (streaks) để tạo áp lực độc hại.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
