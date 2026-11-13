import { Task } from '../types/task';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'seed-task-1',
    title: 'Nghiên cứu kiến trúc React Server Components & Vercel Best Practices',
    completed: false,
    priority: 'high',
    category: 'study',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    dueDate: getTodayDateString(),
  },
  {
    id: 'seed-task-2',
    title: 'Review và hoàn thiện pull request giao diện người dùng Linear style',
    completed: false,
    priority: 'high',
    category: 'project',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    dueDate: getTodayDateString(),
  },
  {
    id: 'seed-task-3',
    title: 'Họp đồng bộ tiến độ Sprint tuần cùng đội ngũ phát triển',
    completed: true,
    priority: 'medium',
    category: 'project',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    dueDate: getTodayDateString(),
    completedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'seed-task-4',
    title: 'Đọc 20 trang sách "Designing Data-Intensive Applications"',
    completed: false,
    priority: 'low',
    category: 'study',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    dueDate: getTodayDateString(),
  },
  {
    id: 'seed-task-5',
    title: 'Tập thể dục 30 phút và uống đủ 2 lít nước',
    completed: true,
    priority: 'medium',
    category: 'personal',
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    dueDate: getTodayDateString(),
    completedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
];
