import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Task, FilterType, Category, Priority } from '../types/task';
import { INITIAL_TASKS, getTodayDateString } from '../constants/initialTasks';

const STORAGE_KEY = 'daily_task_checklist_v1';

export function useTasks() {
  // rerender-lazy-state-init: Lazy initialization to avoid reading localStorage on every render
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return INITIAL_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>('today');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Action: Add new task
  const addTask = useCallback((title: string, category: Category = 'personal', priority: Priority = 'medium') => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: trimmed,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      dueDate: getTodayDateString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  // Action: Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      const nextCompleted = !target.completed;
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : undefined,
            }
          : t
      );

      // Check if all today's tasks are now completed
      if (nextCompleted) {
        const todayTasks = updated.filter((t) => t.dueDate === getTodayDateString());
        const allTodayDone = todayTasks.length > 0 && todayTasks.every((t) => t.completed);
        if (allTodayDone) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
            });
          } catch {
            // Ignore if canvas-confetti fails
          }
        }
      }

      return updated;
    });
  }, []);

  // Action: Update title (inline edit)
  const updateTaskTitle = useCallback((id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
  }, []);

  // Action: Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Action: Clear all completed tasks in active scope or globally
  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  // Action: Reset to initial sample tasks
  const resetToSample = useCallback(() => {
    setTasks(INITIAL_TASKS);
  }, []);

  // Derived: Filter counts (unread/uncompleted)
  const uncompletedCounts = useMemo(() => {
    const counts = {
      all: 0,
      today: 0,
      important: 0,
      completed: 0,
      study: 0,
      project: 0,
      personal: 0,
    };

    for (const t of tasks) {
      if (t.completed) {
        counts.completed += 1;
      } else {
        counts.all += 1;
        if (t.dueDate === todayStr) counts.today += 1;
        if (t.priority === 'high') counts.important += 1;
        if (t.category === 'study') counts.study += 1;
        if (t.category === 'project') counts.project += 1;
        if (t.category === 'personal') counts.personal += 1;
      }
    }

    return counts;
  }, [tasks, todayStr]);

  // Derived: Today's progress
  const todayStats = useMemo(() => {
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      remaining: total - completed,
    };
  }, [tasks, todayStr]);

  // Derived: Filtered & Sorted task list
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          if (!task.title.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Category/QuickFilter
        switch (activeFilter) {
          case 'all':
            return true;
          case 'today':
            return task.dueDate === todayStr;
          case 'important':
            return task.priority === 'high';
          case 'completed':
            return task.completed;
          case 'study':
          case 'project':
          case 'personal':
            return task.category === activeFilter;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        // Incomplete first, then completed
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Priority order (high > medium > low)
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        // Newest created first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, activeFilter, searchQuery, todayStr]);

  return {
    tasks,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    updateTaskTitle,
    deleteTask,
    clearCompleted,
    resetToSample,
    uncompletedCounts,
    todayStats,
    filteredTasks,
  };
}
