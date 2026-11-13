export type Priority = 'high' | 'medium' | 'low';

export type Category = 'study' | 'project' | 'personal';

export type QuickFilter = 'all' | 'today' | 'important' | 'completed';

export type FilterType = QuickFilter | Category;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
  dueDate: string; // 'YYYY-MM-DD'
  completedAt?: string;
}

export interface CategoryMeta {
  id: Category;
  label: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  study: {
    id: 'study',
    label: 'Học tập',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    darkBgColor: 'dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
  },
  project: {
    id: 'project',
    label: 'Dự án',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    darkBgColor: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
  },
  personal: {
    id: 'personal',
    label: 'Cá nhân',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    darkBgColor: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; dotColor: string; badgeClass: string }> = {
  high: {
    label: 'Cao',
    dotColor: 'bg-rose-500',
    badgeClass: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  },
  medium: {
    label: 'Trung bình',
    dotColor: 'bg-amber-500',
    badgeClass: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  },
  low: {
    label: 'Thấp',
    dotColor: 'bg-emerald-500',
    badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  },
};
