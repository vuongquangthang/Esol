import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  User,
  DollarSign,
  Heart,
  Flame,
  Trash2,
  TrendingDown,
  TrendingUp,
  Droplet,
  Moon,
  Activity,
  Plus,
  Zap,
  Wallet,
  PieChart,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  Task,
  Project,
  FinanceTransaction,
  HealthLog,
  Habit,
  LifeDomain,
} from '../../types/momentum';
import { notify } from '../../utils/feedback';

interface LifeManagementModuleProps {
  tasks: Task[];
  projects: Project[];
  financeTransactions: FinanceTransaction[];
  healthLogs: HealthLog[];
  habits: Habit[];
  onAddTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateHealthLog: (log: HealthLog) => void;
  todayStr: string;
}

const FINANCE_CATEGORIES = [
  'Ăn uống',
  'Học tập & Sách',
  'Tiện ích & Phần mềm',
  'Sức khỏe & Thể thao',
  'Đi lại',
  'Cá nhân & Mua sắm',
  'Khác',
];

export const LifeManagementModule: React.FC<LifeManagementModuleProps> = ({
  tasks,
  projects,
  financeTransactions,
  healthLogs,
  habits,
  onAddTransaction,
  onDeleteTransaction,
  onUpdateHealthLog,
  todayStr,
}) => {
  const [activeDomain, setActiveDomain] = useState<LifeDomain>('finance');

  // --- Finance Form State ---
  const [finDesc, setFinDesc] = useState('');
  const [finAmount, setFinAmount] = useState('');
  const [finType, setFinType] = useState<'income' | 'expense'>('expense');
  const [finCat, setFinCat] = useState('Ăn uống');
  const [finFilter, setFinFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [finSearch, setFinSearch] = useState('');

  // --- Health Today State ---
  const todayHealth: HealthLog = healthLogs.find((h) => h.date === todayStr) || {
    id: `health-${todayStr}`,
    date: todayStr,
    sleepHours: 7.0,
    waterLiters: 2.0,
    workoutMinutes: 30,
    energyLevel: 4,
    note: '',
  };

  // --- Finance Calculations ---
  const financeMetrics = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap: Record<string, number> = {};

    financeTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
        catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
      }
    });

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    const categoryBreakdown = Object.entries(catMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      expense,
      balance,
      savingsRate,
      categoryBreakdown,
    };
  }, [financeTransactions]);

  const filteredTransactions = financeTransactions.filter((tx) => {
    if (finFilter !== 'all' && tx.type !== finFilter) return false;
    if (finSearch.trim()) {
      const q = finSearch.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(finAmount);
    if (!finDesc.trim() || isNaN(amountNum) || amountNum <= 0) {
      notify('Vui lòng nhập mô tả và số tiền hợp lệ (> 0)!', 'error');
      return;
    }

    onAddTransaction({
      type: finType,
      category: finType === 'income' ? 'Thu nhập' : finCat,
      amount: amountNum,
      description: finDesc.trim(),
      date: todayStr,
    });

    setFinDesc('');
    setFinAmount('');
  };

  const handleQuickAddAmount = (addVal: number) => {
    const current = parseFloat(finAmount) || 0;
    setFinAmount(String(current + addVal));
  };

  // --- Health Handlers ---
  const handleUpdateHealthField = <K extends keyof HealthLog>(field: K, value: HealthLog[K]) => {
    const updated = {
      ...todayHealth,
      [field]: value,
    };
    onUpdateHealthLog(updated);
  };

  const handleQuickAddWater = (liters: number) => {
    const newLiters = Math.round((todayHealth.waterLiters + liters) * 10) / 10;
    handleUpdateHealthField('waterLiters', Math.min(5, Math.max(0, newLiters)));
  };

  // 7-day health averages
  const health7DayAvg = React.useMemo(() => {
    const recent = healthLogs.slice(0, 7);
    if (recent.length === 0) return { sleep: 7.0, water: 2.0, workout: 0 };
    const sleep =
      Math.round((recent.reduce((acc, h) => acc + h.sleepHours, 0) / recent.length) * 10) / 10;
    const water =
      Math.round((recent.reduce((acc, h) => acc + h.waterLiters, 0) / recent.length) * 10) / 10;
    const workout = recent.reduce((acc, h) => acc + h.workoutMinutes, 0);
    return { sleep, water, workout };
  }, [healthLogs]);

  const domainTabs = [
    { id: 'finance' as LifeDomain, label: 'Tài chính (Finance Tracker)', icon: DollarSign, badge: 'V2' },
    { id: 'health' as LifeDomain, label: 'Sức khỏe (Health Log)', icon: Heart, badge: 'V2' },
    { id: 'study' as LifeDomain, label: 'Học tập (Study)', icon: BookOpen },
    { id: 'projects' as LifeDomain, label: 'Dự án (Projects)', icon: Briefcase },
    { id: 'personal' as LifeDomain, label: 'Cá nhân (Personal)', icon: User },
    { id: 'habits' as LifeDomain, label: 'Kỷ luật (Habits)', icon: Flame },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Release 2.0
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Life Management OS
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Quản trị tài chính cá nhân thủ công (Finance Tracker) và nhật ký giấc ngủ, nước uống, năng lượng (Health Log).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {domainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDomain(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-[#161821] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#262934] hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. FINANCE TRACKER (V2 COMPLETED)                         */}
      {/* ========================================================= */}
      {activeDomain === 'finance' && (
        <div className="space-y-6">
          {/* Finance Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Số dư khả dụng</span>
                <Wallet className="w-4 h-4 text-brand-500" />
              </div>
              <div
                className={`text-2xl font-black font-mono mt-2 ${
                  financeMetrics.balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'
                }`}
              >
                {financeMetrics.balance.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Thu nhập trừ tổng chi tiêu</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Tổng thu nhập</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                +{financeMetrics.income.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Dự án freelance &amp; lương</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Tổng chi tiêu</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-2">
                -{financeMetrics.expense.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Sinh hoạt &amp; phát triển cá nhân</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Tỷ lệ tiết kiệm</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400 mt-2">
                {financeMetrics.savingsRate}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Mục tiêu lý tưởng: &gt; 30%</div>
            </div>
          </div>

          {/* Category Expense Breakdown */}
          {financeMetrics.categoryBreakdown.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-brand-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Phân bổ chi tiêu theo danh mục
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {financeMetrics.categoryBreakdown.length} nhóm
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {financeMetrics.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#121318] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{cat.category}</span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {cat.amount.toLocaleString('vi-VN')} đ ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Transaction Form (Clean & Modular) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-500" />
              <span>Ghi nhận giao dịch mới (Thủ công)</span>
            </h3>

            <form onSubmit={handleCreateTransaction} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Mô tả giao dịch <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={finDesc}
                    onChange={(e) => setFinDesc(e.target.value)}
                    placeholder="VD: Cơm trưa, Sách Machine Learning, Cước Net..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Số tiền (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={finAmount}
                    onChange={(e) => setFinAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Loại giao dịch
                  </label>
                  <select
                    value={finType}
                    onChange={(e) => setFinType(e.target.value as 'income' | 'expense')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="expense">Chi tiêu (-)</option>
                    <option value="income">Thu nhập (+)</option>
                  </select>
                </div>
              </div>

              {/* Quick Amount Chips & Category */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Cộng nhanh:</span>
                  {[
                    { label: '+50k', val: 50000 },
                    { label: '+100k', val: 100000 },
                    { label: '+200k', val: 200000 },
                    { label: '+500k', val: 500000 },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => handleQuickAddAmount(chip.val)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-[#20232c] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a2e3a] transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {finType === 'expense' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Danh mục:</span>
                    <select
                      value={finCat}
                      onChange={(e) => setFinCat(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                    >
                      {FINANCE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all"
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>

          {/* Transactions List with Filter & Search */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#181a22] p-1 rounded-xl text-xs font-semibold">
                {(['all', 'expense', 'income'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setFinFilter(filterKey)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      finFilter === filterKey
                        ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    {filterKey === 'all'
                      ? 'Tất cả'
                      : filterKey === 'expense'
                      ? 'Chi tiêu (-)'
                      : 'Thu nhập (+)'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={finSearch}
                  onChange={(e) => setFinSearch(e.target.value)}
                  placeholder="Tìm giao dịch..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200 dark:border-[#262934]">
                  Chưa có giao dịch nào phù hợp.
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-[#20232c] bg-slate-50/50 dark:bg-[#121318] text-xs hover:bg-slate-50 dark:hover:bg-[#181a23] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tx.description}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono font-bold text-sm ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {tx.amount.toLocaleString('vi-VN')} đ
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. HEALTH TRACKER (V2 COMPLETED)                          */}
      {/* ========================================================= */}
      {activeDomain === 'health' && (
        <div className="space-y-6">
          {/* Today's Interactive Health Logger */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#20232c]">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Ghi nhận thể trạng &amp; Sức khỏe hôm nay</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ngày {todayStr} • Lưu tự động và tính toán cho chu kỳ 30 ngày.
                </p>
              </div>

              {/* Energy Rating Chips */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Năng lượng:
                </span>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleUpdateHealthField('energyLevel', lvl)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      todayHealth.energyLevel === lvl
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'border-slate-200 dark:border-[#2a2d39] text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sleep Hours Slider */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-[#121318] border border-slate-200/60 dark:border-[#22252e] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-500" /> Giấc ngủ đêm qua
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    {todayHealth.sleepHours >= 7 && todayHealth.sleepHours <= 8.5
                      ? 'Tối ưu cho não bộ'
                      : todayHealth.sleepHours < 6
                      ? 'Thiếu ngủ'
                      : 'Bình thường'}
                  </span>
                </div>

                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {todayHealth.sleepHours} <span className="text-base font-medium text-slate-400">tiếng</span>
                </div>

                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={todayHealth.sleepHours}
                  onChange={(e) =>
                    handleUpdateHealthField('sleepHours', parseFloat(e.target.value))
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>4 tiếng</span>
                  <span>Mục tiêu: 7.5h</span>
                  <span>10 tiếng</span>
                </div>
              </div>

              {/* Water Intake Tracker */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-[#121318] border border-slate-200/60 dark:border-[#22252e] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-sky-500" /> Nước uống hôm nay
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                    {Math.round((todayHealth.waterLiters / 2.0) * 100)}% mục tiêu
                  </span>
                </div>

                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {todayHealth.waterLiters} <span className="text-base font-medium text-slate-400">/ 2.0 Lít</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (todayHealth.waterLiters / 2.0) * 100)}%` }}
                  />
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickAddWater(0.25)}
                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 border border-sky-200/60 dark:border-sky-800/40 transition-colors"
                  >
                    +250ml (1 ly)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddWater(0.5)}
                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 border border-sky-200/60 dark:border-sky-800/40 transition-colors"
                  >
                    +500ml (1 chai)
                  </button>
                </div>
              </div>

              {/* Workout Minutes */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-[#121318] border border-slate-200/60 dark:border-[#22252e] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" /> Vận động thể lực
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    {todayHealth.workoutMinutes >= 30 ? 'Đạt chuẩn' : 'Cần thêm'}
                  </span>
                </div>

                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {todayHealth.workoutMinutes} <span className="text-base font-medium text-slate-400">phút</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={todayHealth.workoutMinutes}
                  onChange={(e) =>
                    handleUpdateHealthField('workoutMinutes', parseInt(e.target.value))
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="flex gap-1.5 pt-1">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleUpdateHealthField('workoutMinutes', mins)}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        todayHealth.workoutMinutes === mins
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-200 dark:border-[#2a2d39] text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Note */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Ghi chú thể trạng &amp; Cảm giác cơ thể hôm nay:
              </label>
              <input
                type="text"
                value={todayHealth.note || ''}
                onChange={(e) => handleUpdateHealthField('note', e.target.value)}
                placeholder="VD: Thức dậy sảng khoái, không đau mỏi, năng lượng làm việc tốt..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* 7-Day Health Trend Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Trung bình giấc ngủ 7 ngày</div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {health7DayAvg.sleep} giờ / đêm
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Trung bình nước uống 7 ngày</div>
              <div className="text-xl font-bold font-mono text-sky-500">
                {health7DayAvg.water} Lít / ngày
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-white dark:bg-[#161821] text-center space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Tổng vận động trong tuần</div>
              <div className="text-xl font-bold font-mono text-emerald-500">
                {health7DayAvg.workout} phút
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. STUDY DOMAIN                                           */}
      {/* ========================================================= */}
      {activeDomain === 'study' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Học tập &amp; Phát triển chuyên môn</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Các đầu việc và dự án học tập đang theo dõi:
          </p>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.category === 'study')
              .map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-[#262934] bg-slate-50/50 dark:bg-[#121318] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{t.title}</span>
                    <div className="text-[11px] text-slate-400">Next Action: {t.nextAction}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300">
                    {t.status.toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PROJECTS DOMAIN                                        */}
      {/* ========================================================= */}
      {activeDomain === 'projects' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Dự án thực tế</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#262934] bg-slate-50/50 dark:bg-[#121318] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</span>
                  <span className="text-xs font-semibold text-brand-600">{p.progress}%</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.description}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PERSONAL DOMAIN                                        */}
      {/* ========================================================= */}
      {activeDomain === 'personal' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Đời sống cá nhân &amp; Gia đình</span>
          </h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.category === 'personal')
              .map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-[#262934] bg-slate-50/50 dark:bg-[#121318] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{t.title}</span>
                  <span className="text-[10px] text-slate-400">{t.deadline || 'Hôm nay'}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. HABITS DOMAIN                                          */}
      {/* ========================================================= */}
      {activeDomain === 'habits' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#22252e] bg-white dark:bg-[#161821] space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Kỷ luật thói quen</span>
          </h3>
          <div className="space-y-2">
            {habits.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-[#262934] bg-slate-50/50 dark:bg-[#121318] flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{h.title}</span>
                <span className="text-slate-400 text-[11px]">{h.minimumTarget}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
