import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Project,
  Goal,
  Habit,
  ProcrastinationLog,
  FocusSession,
  FinanceTransaction,
  HealthLog,
  WeeklyReview,
  TransformationStats,
  SubTask,
  TaskStatus,
  ProcrastinationBarrier,
  RecoveryActionType,
} from '../types/momentum';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_PROCRASTINATION_LOGS,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_FINANCE,
  INITIAL_HEALTH,
  INITIAL_WEEKLY_REVIEWS,
  INITIAL_TRANSFORMATION,
  getTodayDateString,
} from '../constants/momentumMockData';
import { notify, requestConfirmation } from '../utils/feedback';

const STORE_KEY = 'momentum_personal_os_v1';
const SHOW_DEMO_DATA_KEY = `${STORE_KEY}_show_demo_data`;

const EMPTY_TRANSFORMATION_STATS: TransformationStats = {
  week1: { completionRate: 0, startRate: 0, postponedCount: 0, postponementRate: 0, focusHours: 0, habitConsistency: 0, planAccuracy: 0 },
  week2: { completionRate: 0, startRate: 0, postponedCount: 0, postponementRate: 0, focusHours: 0, habitConsistency: 0, planAccuracy: 0 },
  week3: { completionRate: 0, startRate: 0, postponedCount: 0, postponementRate: 0, focusHours: 0, habitConsistency: 0, planAccuracy: 0 },
  week4: { completionRate: 0, startRate: 0, postponedCount: 0, postponementRate: 0, focusHours: 0, habitConsistency: 0, planAccuracy: 0 },
  reflection: {
    improvedHabits: '',
    remainingChallenges: '',
    nextMonthChanges: '',
  },
};

const getVisibleData = <T extends { id: string }>(
  data: T[],
  demoData: T[],
  showDemoData: boolean,
) => {
  if (showDemoData) return data;
  const demoIds = new Set(demoData.map((item) => item.id));
  return data.filter((item) => !demoIds.has(item.id));
};

export type ActiveTab =
  | 'dashboard'
  | 'tasks'
  | 'anti_procrastination'
  | 'focus'
  | 'habits'
  | 'life'
  | 'weekly_review'
  | 'transformation'
  | 'settings';

export function useMomentumStore() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showDemoData, setShowDemoData] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SHOW_DEMO_DATA_KEY) !== 'false';
    } catch (e) {
      console.error('Failed to load demo data preference:', e);
      return true;
    }
  });

  // Load state from localStorage or initialize with rich mock data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_tasks`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_projects`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_goals`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GOALS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_habits`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_HABITS;
  });

  const [procrastinationLogs, setProcrastinationLogs] = useState<ProcrastinationLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_proc_logs`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROCRASTINATION_LOGS;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_focus_sessions`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FOCUS_SESSIONS;
  });

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_finance`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FINANCE;
  });

  const [healthLogs, setHealthLogs] = useState<HealthLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_health`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_HEALTH;
  });

  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_weekly_reviews`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WEEKLY_REVIEWS;
  });

  const [transformationStats, setTransformationStats] = useState<TransformationStats>(() => {
    try {
      const stored = localStorage.getItem(`${STORE_KEY}_transformation`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSFORMATION;
  });

  const visibleTasks = useMemo(() => getVisibleData(tasks, INITIAL_TASKS, showDemoData), [tasks, showDemoData]);
  const visibleProjects = useMemo(() => getVisibleData(projects, INITIAL_PROJECTS, showDemoData), [projects, showDemoData]);
  const visibleGoals = useMemo(() => getVisibleData(goals, INITIAL_GOALS, showDemoData), [goals, showDemoData]);
  const visibleHabits = useMemo(() => getVisibleData(habits, INITIAL_HABITS, showDemoData), [habits, showDemoData]);
  const visibleProcrastinationLogs = useMemo(
    () => getVisibleData(procrastinationLogs, INITIAL_PROCRASTINATION_LOGS, showDemoData),
    [procrastinationLogs, showDemoData],
  );
  const visibleFocusSessions = useMemo(
    () => getVisibleData(focusSessions, INITIAL_FOCUS_SESSIONS, showDemoData),
    [focusSessions, showDemoData],
  );
  const visibleFinanceTransactions = useMemo(
    () => getVisibleData(financeTransactions, INITIAL_FINANCE, showDemoData),
    [financeTransactions, showDemoData],
  );
  const visibleHealthLogs = useMemo(() => getVisibleData(healthLogs, INITIAL_HEALTH, showDemoData), [healthLogs, showDemoData]);
  const visibleWeeklyReviews = useMemo(
    () => getVisibleData(weeklyReviews, INITIAL_WEEKLY_REVIEWS, showDemoData),
    [weeklyReviews, showDemoData],
  );

  // Selected Task for quick actions (Focus / Anti-procrastination / Breakdown)
  const [focusTargetTask, setFocusTargetTask] = useState<Task | null>(() => {
    return tasks.find((t) => t.isTodayPriority && t.status !== 'done') || tasks[0] || null;
  });
  const [procrastinationTargetTask, setProcrastinationTargetTask] = useState<Task | null>(null);
  const [breakdownTargetTask, setBreakdownTargetTask] = useState<Task | null>(null);

  const toggleDemoData = useCallback(() => {
    setShowDemoData((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SHOW_DEMO_DATA_KEY, String(next));
      } catch (e) {
        console.error('Failed to save demo data preference:', e);
      }
      return next;
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORE_KEY}_projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORE_KEY}_goals`, JSON.stringify(goals));
      localStorage.setItem(`${STORE_KEY}_habits`, JSON.stringify(habits));
      localStorage.setItem(`${STORE_KEY}_proc_logs`, JSON.stringify(procrastinationLogs));
      localStorage.setItem(`${STORE_KEY}_focus_sessions`, JSON.stringify(focusSessions));
      localStorage.setItem(`${STORE_KEY}_finance`, JSON.stringify(financeTransactions));
      localStorage.setItem(`${STORE_KEY}_health`, JSON.stringify(healthLogs));
      localStorage.setItem(`${STORE_KEY}_weekly_reviews`, JSON.stringify(weeklyReviews));
      localStorage.setItem(`${STORE_KEY}_transformation`, JSON.stringify(transformationStats));
    } catch (e) {
      console.error('Failed to sync state to localStorage:', e);
    }
  }, [
    tasks,
    projects,
    goals,
    habits,
    procrastinationLogs,
    focusSessions,
    financeTransactions,
    healthLogs,
    weeklyReviews,
    transformationStats,
  ]);

  const todayStr = useMemo(() => getTodayDateString(), []);

  // --- Task Operations ---
  const addTask = useCallback((taskData: Partial<Task> & { title: string }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: taskData.title.trim(),
      description: taskData.description || '',
      category: taskData.category || 'personal',
      projectId: taskData.projectId,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      startDate: taskData.startDate || getTodayDateString(),
      deadline: taskData.deadline || getTodayDateString(),
      estimatedMinutes: taskData.estimatedMinutes || 30,
      actualMinutes: 0,
      nextAction: taskData.nextAction || 'Xác định bước đầu tiên 2-5 phút',
      postponedCount: 0,
      subtasks: taskData.subtasks || [],
      isTodayPriority: taskData.isTodayPriority || false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'done' && t.status !== 'done') {
            updated.completedAt = new Date().toISOString();
          } else if (updates.status && updates.status !== 'done') {
            updated.completedAt = undefined;
          }
          return updated;
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      const nextStatus: TaskStatus = target.status === 'done' ? 'todo' : 'done';
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
            }
          : t
      );

      // Check if all today's tasks completed
      if (nextStatus === 'done') {
        const todayTasks = updated.filter((t) => t.deadline === getTodayDateString() || t.isTodayPriority);
        if (todayTasks.length > 0 && todayTasks.every((t) => t.status === 'done')) {
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
            });
          } catch {
            // Ignore
          }
        }
      }

      return updated;
    });
  }, []);

  // Set today's priority - enforces Max 3 priorities rule!
  const setTodayPriority = useCallback((id: string, makePriority: boolean) => {
    setTasks((prev) => {
      const currentPriorities = prev.filter((t) => t.isTodayPriority && t.id !== id);
      if (makePriority && currentPriorities.length >= 3) {
        notify('Quy tắc ESOL: Chỉ chọn tối đa 3 ưu tiên chính mỗi ngày để đảm bảo sự tập trung cao nhất!', 'error');
        return prev;
      }
      return prev.map((t) => (t.id === id ? { ...t, isTodayPriority: makePriority } : t));
    });
  }, []);

  const updateSubtasks = useCallback((taskId: string, subtasks: SubTask[]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t))
    );
  }, []);

  // Postpone a task with Recovery Action
  const postponeTask = useCallback(
    (
      taskId: string,
      barrier: ProcrastinationBarrier,
      barrierLabel: string,
      reasonNotes: string,
      actionChosen: RecoveryActionType,
      actionLabel: string
    ) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            let nextDeadline = t.deadline;
            let nextStatus = t.status;

            if (actionChosen === 'reschedule') {
              const tmr = new Date(Date.now() + 86400000);
              nextDeadline = tmr.toISOString().split('T')[0];
            } else if (actionChosen === 'drop') {
              // mark dropped or delete or keep as dropped status
            }

            return {
              ...t,
              postponedCount: t.postponedCount + 1,
              deadline: nextDeadline,
              status: nextStatus,
            };
          }
          return t;
        })
      );

      const target = tasks.find((t) => t.id === taskId);
      const newLog: ProcrastinationLog = {
        id: `proc-${Date.now()}`,
        taskId,
        taskTitle: target?.title || 'Công việc',
        barrier,
        barrierLabel,
        reasonNotes,
        actionChosen,
        actionLabel,
        timestamp: new Date().toISOString(),
      };

      setProcrastinationLogs((prev) => [newLog, ...prev]);
    },
    [tasks]
  );

  // --- Focus Operations ---
  const recordFocusSession = useCallback(
    (session: Omit<FocusSession, 'id' | 'completedAt'>) => {
      const newSession: FocusSession = {
        ...session,
        id: `focus-${Date.now()}`,
        completedAt: new Date().toISOString(),
      };

      setFocusSessions((prev) => [newSession, ...prev]);

      if (session.taskId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === session.taskId
              ? {
                  ...t,
                  actualMinutes: (t.actualMinutes || 0) + session.durationMinutes,
                  status: t.status === 'todo' ? 'doing' : t.status,
                }
              : t
          )
        );
      }
    },
    []
  );

  // --- Habit Operations ---
  const toggleHabitDay = useCallback((habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const current = Boolean(h.history[dateStr]);
          return {
            ...h,
            history: {
              ...h.history,
              [dateStr]: !current,
            },
          };
        }
        return h;
      })
    );
  }, []);

  const addHabit = useCallback((newHabit: Omit<Habit, 'id' | 'history'>) => {
    const habit: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      history: {},
    };
    setHabits((prev) => [...prev, habit]);
  }, []);

  // Action: Activate Missed Habit Recovery mode for today
  const activateHabitRecovery = useCallback((habitId: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, isRecoveryActiveToday: !h.isRecoveryActiveToday } : h
      )
    );
  }, []);

  // --- Goal Operations ---
  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g))
    );
  }, []);

  // --- Finance Operations ---
  const addTransaction = useCallback((tx: Omit<FinanceTransaction, 'id'>) => {
    const newTx: FinanceTransaction = {
      ...tx,
      id: `fin-${Date.now()}`,
    };
    setFinanceTransactions((prev) => [newTx, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setFinanceTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Health Operations ---
  const updateHealthLog = useCallback((log: HealthLog) => {
    setHealthLogs((prev) => {
      const exists = prev.find((h) => h.date === log.date);
      if (exists) {
        return prev.map((h) => (h.date === log.date ? log : h));
      }
      return [log, ...prev];
    });
  }, []);

  // --- Weekly Review Operations ---
  const saveWeeklyReview = useCallback((review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const newRev: WeeklyReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWeeklyReviews((prev) => [newRev, ...prev]);
  }, []);

  // --- Transformation Stats Operations ---
  const updateTransformationStats = useCallback((updates: Partial<TransformationStats>) => {
    setTransformationStats((prev) => ({
      ...prev,
      ...updates,
      reflection: {
        ...prev.reflection,
        ...(updates.reflection || {}),
      },
    }));
  }, []);

  // --- Utility Actions ---
  const clearAllData = useCallback(async () => {
    const confirmed = await requestConfirmation(
      'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu ESOL trên trình duyệt này? Công việc, dự án, mục tiêu, thói quen, lịch sử tập trung, tài chính, sức khỏe và các báo cáo sẽ bị xóa. Thao tác này không thể hoàn tác. Hãy xuất bản sao lưu JSON nếu cần giữ lại dữ liệu.',
    );
    if (!confirmed) return;

    setTasks([]);
    setProjects([]);
    setGoals([]);
    setHabits([]);
    setProcrastinationLogs([]);
    setFocusSessions([]);
    setFinanceTransactions([]);
    setHealthLogs([]);
    setWeeklyReviews([]);
    setTransformationStats(EMPTY_TRANSFORMATION_STATS);
    setFocusTargetTask(null);
    setProcrastinationTargetTask(null);
    setBreakdownTargetTask(null);
    notify('Đã xóa toàn bộ dữ liệu ESOL.', 'success');
  }, []);

  const resetToMockData = useCallback(async () => {
    if (await requestConfirmation('Bạn có chắc chắn muốn nạp lại dữ liệu mẫu của ESOL OS không?')) {
      setTasks(INITIAL_TASKS);
      setProjects(INITIAL_PROJECTS);
      setGoals(INITIAL_GOALS);
      setHabits(INITIAL_HABITS);
      setProcrastinationLogs(INITIAL_PROCRASTINATION_LOGS);
      setFocusSessions(INITIAL_FOCUS_SESSIONS);
      setFinanceTransactions(INITIAL_FINANCE);
      setHealthLogs(INITIAL_HEALTH);
      setWeeklyReviews(INITIAL_WEEKLY_REVIEWS);
      setTransformationStats(INITIAL_TRANSFORMATION);
    }
  }, []);

  const exportDataJSON = useCallback(() => {
    const bundle = {
      tasks,
      projects,
      goals,
      habits,
      procrastinationLogs,
      focusSessions,
      financeTransactions,
      healthLogs,
      weeklyReviews,
      transformationStats,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esol_backup_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    tasks,
    projects,
    goals,
    habits,
    procrastinationLogs,
    focusSessions,
    financeTransactions,
    healthLogs,
    weeklyReviews,
    transformationStats,
  ]);

  const importDataJSON = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks) setTasks(data.tasks);
      if (data.projects) setProjects(data.projects);
      if (data.goals) setGoals(data.goals);
      if (data.habits) setHabits(data.habits);
      if (data.procrastinationLogs) setProcrastinationLogs(data.procrastinationLogs);
      if (data.focusSessions) setFocusSessions(data.focusSessions);
      if (data.financeTransactions) setFinanceTransactions(data.financeTransactions);
      if (data.healthLogs) setHealthLogs(data.healthLogs);
      if (data.weeklyReviews) setWeeklyReviews(data.weeklyReviews);
      if (data.transformationStats) setTransformationStats(data.transformationStats);
      notify('Nhập dữ liệu thành công!', 'success');
    } catch {
      notify('Tệp dữ liệu không hợp lệ!', 'error');
    }
  }, []);

  // --- Computed Stats ---
  // Today's priorities (Max 3)
  const todayPriorities = useMemo(() => {
    return visibleTasks.filter((t) => t.isTodayPriority).slice(0, 3);
  }, [visibleTasks]);

  // Next Action Task: The most critical pending task for today
  const nextActionTask = useMemo(() => {
    const pendingPriority = todayPriorities.find((t) => t.status !== 'done');
    if (pendingPriority) return pendingPriority;
    return visibleTasks.find((t) => (t.deadline === todayStr || t.status === 'doing') && t.status !== 'done') || null;
  }, [todayPriorities, visibleTasks, todayStr]);

  // Daily overview stats
  const dailyOverview = useMemo(() => {
    const todayTasks = visibleTasks.filter((t) => t.deadline === todayStr || t.isTodayPriority);
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.status === 'done').length;
    const remaining = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      remaining,
      percentage,
    };
  }, [visibleTasks, todayStr]);

  // Today's focus minutes
  const todayFocusMinutes = useMemo(() => {
    const todayStart = new Date(todayStr).getTime();
    return visibleFocusSessions
      .filter((s) => new Date(s.completedAt).getTime() >= todayStart)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [visibleFocusSessions, todayStr]);

  // Today's habits summary
  const todayHabitSummary = useMemo(() => {
    const total = visibleHabits.length;
    const completed = visibleHabits.filter((h) => Boolean(h.history[todayStr])).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      total,
      completed,
      percentage,
    };
  }, [visibleHabits, todayStr]);

  // --- Procrastination Analytics (Release 2.0) ---
  const procrastinationStats = useMemo(() => {
    const total = visibleProcrastinationLogs.length;
    const barrierCounts: Record<ProcrastinationBarrier, number> = {
      no_start: 0,
      too_big: 0,
      distracted: 0,
      perfectionism: 0,
      low_energy: 0,
      inconsistent: 0,
    };

    visibleProcrastinationLogs.forEach((log) => {
      if (barrierCounts[log.barrier] !== undefined) {
        barrierCounts[log.barrier] += 1;
      }
    });

    const barrierList = (Object.keys(barrierCounts) as ProcrastinationBarrier[]).map((key) => ({
      barrier: key,
      count: barrierCounts[key],
      percentage: total > 0 ? Math.round((barrierCounts[key] / total) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    const topBarrier = barrierList[0]?.count > 0 ? barrierList[0] : null;

    const topPostponedTasks = [...visibleTasks]
      .filter((t) => t.postponedCount > 0)
      .sort((a, b) => b.postponedCount - a.postponedCount)
      .slice(0, 5);

    return {
      total,
      barrierCounts,
      barrierList,
      topBarrier,
      topPostponedTasks,
    };
  }, [visibleProcrastinationLogs, visibleTasks]);

  // --- Finance Analytics (Release 2.0) ---
  const financeStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCat: Record<string, number> = {};

    visibleFinanceTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        expenseByCat[tx.category] = (expenseByCat[tx.category] || 0) + tx.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    const categoryBreakdown = Object.entries(expenseByCat)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      categoryBreakdown,
    };
  }, [visibleFinanceTransactions]);

  // --- Health Analytics (Release 2.0) ---
  const healthStats = useMemo(() => {
    const todayLog = visibleHealthLogs.find((h) => h.date === todayStr) || {
      id: `health-${todayStr}`,
      date: todayStr,
      sleepHours: 7.0,
      waterLiters: 2.0,
      workoutMinutes: 30,
      energyLevel: 4,
    };

    const recentLogs = visibleHealthLogs.slice(0, 7);
    const avgSleep = recentLogs.length > 0
      ? Math.round((recentLogs.reduce((acc, h) => acc + h.sleepHours, 0) / recentLogs.length) * 10) / 10
      : 7.0;
    const avgWater = recentLogs.length > 0
      ? Math.round((recentLogs.reduce((acc, h) => acc + h.waterLiters, 0) / recentLogs.length) * 10) / 10
      : 2.0;
    const totalWorkout = recentLogs.reduce((acc, h) => acc + h.workoutMinutes, 0);

    return {
      todayLog,
      recentLogs,
      avgSleep,
      avgWater,
      totalWorkout,
    };
  }, [visibleHealthLogs, todayStr]);

  // Automated Weekly Review Prompt Calculation (Release 3.0)
  const currentWeekNumber = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }, []);

  const isWeeklyReviewDue = useMemo(() => {
    const isSunday = new Date().getDay() === 0;
    const reviewedThisWeek = visibleWeeklyReviews.some((r) => r.weekNumber === currentWeekNumber);
    return isSunday || !reviewedThisWeek;
  }, [visibleWeeklyReviews, currentWeekNumber]);

  // Launch Focus Mode with specific task
  const startFocusWithTask = useCallback((task: Task) => {
    setFocusTargetTask(task);
    setActiveTab('focus');
  }, []);

  // Launch Procrastination Recovery with specific task
  const startRecoveryWithTask = useCallback((task: Task) => {
    setProcrastinationTargetTask(task);
    setActiveTab('anti_procrastination');
  }, []);

  // Launch Task Breakdown with specific task
  const startBreakdownWithTask = useCallback((task: Task) => {
    setBreakdownTargetTask(task);
    setActiveTab('tasks');
  }, []);

  return {
    activeTab,
    setActiveTab,
    showDemoData,
    toggleDemoData,
    tasks: visibleTasks,
    projects: visibleProjects,
    goals: visibleGoals,
    habits: visibleHabits,
    procrastinationLogs: visibleProcrastinationLogs,
    focusSessions: visibleFocusSessions,
    financeTransactions: visibleFinanceTransactions,
    healthLogs: visibleHealthLogs,
    weeklyReviews: visibleWeeklyReviews,
    transformationStats: showDemoData ? transformationStats : EMPTY_TRANSFORMATION_STATS,
    // Task operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTodayPriority,
    updateSubtasks,
    postponeTask,
    // Focus operations
    focusTargetTask,
    setFocusTargetTask,
    recordFocusSession,
    startFocusWithTask,
    // Anti-procrastination
    procrastinationTargetTask,
    setProcrastinationTargetTask,
    startRecoveryWithTask,
    // Breakdown
    breakdownTargetTask,
    setBreakdownTargetTask,
    startBreakdownWithTask,
    // Habit operations
    toggleHabitDay,
    addHabit,
    activateHabitRecovery,
    updateGoalProgress,
    // Finance operations
    addTransaction,
    deleteTransaction,
    // Health operations
    updateHealthLog,
    // Weekly review
    saveWeeklyReview,
    isWeeklyReviewDue,
    currentWeekNumber,
    // Transformation stats
    updateTransformationStats,
    // Backup & Reset
    clearAllData,
    resetToMockData,
    exportDataJSON,
    importDataJSON,
    // Computed
    todayPriorities,
    nextActionTask,
    dailyOverview,
    todayFocusMinutes,
    todayHabitSummary,
    procrastinationStats,
    financeStats,
    healthStats,
  };
}
