export type LifeDomain = 'study' | 'projects' | 'personal' | 'finance' | 'health' | 'habits';

export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'inbox' | 'todo' | 'doing' | 'done';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: LifeDomain;
  projectId?: string;
  priority: Priority;
  status: TaskStatus;
  startDate?: string;
  deadline?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  nextAction?: string;
  postponedCount: number;
  completedAt?: string;
  subtasks: SubTask[];
  isTodayPriority?: boolean; // Max 3 for today!
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: LifeDomain;
  color: string;
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
}

export type ProcrastinationBarrier =
  | 'no_start' // Không biết bắt đầu từ đâu
  | 'too_big' // Công việc quá lớn
  | 'distracted' // Đang mất tập trung
  | 'perfectionism' // Sợ làm không tốt / Cầu toàn
  | 'low_energy' // Không có năng lượng
  | 'inconsistent'; // Không duy trì được

export type RecoveryActionType =
  | 'task_breakdown' // Mở Task Breakdown, tạo hành động đầu tiên
  | 'chunk_small' // Chia nhỏ thành các nhiệm vụ 15-30 phút
  | 'focus_mode' // Bật Focus Mode và mở Distraction Parking Lot
  | 'draft_mode' // Viết tiêu chí Done tối thiểu (Bản nháp)
  | 'rest_or_light' // Chọn phiên bản nhẹ hơn hoặc lên lịch nghỉ ngơi
  | 'retry_plan' // Dùng kế hoạch quay lại với phiên bản nhỏ
  | 'two_minute_start' // Bắt đầu trong 2 phút
  | 'reschedule' // Cần làm nhưng dời lịch
  | 'blocked' // Bị cản trở bên ngoài
  | 'drop'; // Chủ động loại bỏ không tội lỗi

export interface ProcrastinationLog {
  id: string;
  taskId: string;
  taskTitle: string;
  barrier: ProcrastinationBarrier;
  barrierLabel: string;
  reasonNotes: string;
  actionChosen: RecoveryActionType;
  actionLabel: string;
  timestamp: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  durationMinutes: number;
  focusScore: number; // 1 to 5
  accomplishment: string;
  distractions: string[];
  completedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: LifeDomain;
  targetDate: string;
  progress: number; // 0-100
  whyItMatters: string;
  associatedHabitId?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: LifeDomain;
  frequency: string;
  minimumTarget: string; // e.g., "5 phút" or "1 trang"
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  history: Record<string, boolean>; // key YYYY-MM-DD
  missedRecoveryNote?: string;
  isRecoveryActiveToday?: boolean; // When user activates mini-habit recovery!
}

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  sleepHours: number;
  waterLiters: number;
  waterMl?: number; // Daily water intake in ml
  workoutMinutes: number;
  energyLevel: number; // 1-5
  moodLevel?: number; // 1-5 (Mood rating)
  moodLabel?: string;
  note?: string;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  whatWentWell: string;
  whatPostponed: string;
  rootCauses: string;
  unrealisticPlans: string;
  nextWeekChanges: string;
  stats: {
    completionRate: number;
    startRate: number;
    postponementCount: number;
    focusHours: number;
    habitRate: number;
  };
  createdAt: string;
}

export interface TransformationStats {
  week1: {
    completionRate: number;
    startRate?: number;
    postponedCount: number;
    postponementRate?: number;
    focusHours: number;
    habitConsistency: number;
    planAccuracy?: number;
  };
  week2: {
    completionRate: number;
    startRate?: number;
    postponedCount: number;
    postponementRate?: number;
    focusHours: number;
    habitConsistency: number;
    planAccuracy?: number;
  };
  week3: {
    completionRate: number;
    startRate?: number;
    postponedCount: number;
    postponementRate?: number;
    focusHours: number;
    habitConsistency: number;
    planAccuracy?: number;
  };
  week4: {
    completionRate: number;
    startRate?: number;
    postponedCount: number;
    postponementRate?: number;
    focusHours: number;
    habitConsistency: number;
    planAccuracy?: number;
  };
  reflection: {
    improvedHabits: string;
    remainingChallenges: string;
    nextMonthChanges: string;
  };
}

export interface DomainMeta {
  id: LifeDomain;
  name: string;
  vietnameseName: string;
  description: string;
  color: string;
  badgeBg: string;
  darkBadgeBg: string;
}

export const DOMAINS: Record<LifeDomain, DomainMeta> = {
  study: {
    id: 'study',
    name: 'Study',
    vietnameseName: 'Học tập',
    description: 'Môn học, nội dung cần ôn, thời gian học và kiến thức',
    color: 'text-sky-500 dark:text-sky-400',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    darkBadgeBg: 'dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    vietnameseName: 'Dự án',
    description: 'Dự án, deadline, milestones, công việc và kết quả',
    color: 'text-indigo-500 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    darkBadgeBg: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
  },
  personal: {
    id: 'personal',
    name: 'Personal',
    vietnameseName: 'Cá nhân',
    description: 'Việc nhà, lịch cá nhân, cuộc hẹn, trách nhiệm hằng ngày',
    color: 'text-emerald-500 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    darkBadgeBg: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    vietnameseName: 'Tài chính',
    description: 'Thu nhập, chi tiêu, ngân sách và mục tiêu tiết kiệm',
    color: 'text-amber-500 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    darkBadgeBg: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  },
  health: {
    id: 'health',
    name: 'Health',
    vietnameseName: 'Sức khỏe',
    description: 'Giờ ngủ, nước uống, vận động và thể lực',
    color: 'text-rose-500 dark:text-rose-400',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    darkBadgeBg: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  },
  habits: {
    id: 'habits',
    name: 'Habits',
    vietnameseName: 'Kỷ luật',
    description: 'Hành động lặp lại xuyên suốt các lĩnh vực',
    color: 'text-purple-500 dark:text-purple-400',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    darkBadgeBg: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
  },
};
