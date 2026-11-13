import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Task, FilterType } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  onToggle: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onAddTaskClick?: () => void;
  onClearSearch?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  searchQuery,
  onToggle,
  onUpdateTitle,
  onDelete,
  onAddTaskClick,
  onClearSearch,
}) => {
  const [showCompleted, setShowCompleted] = useState(true);

  if (tasks.length === 0) {
    return (
      <EmptyState
        filter={filter}
        isSearching={Boolean(searchQuery.trim())}
        onAddTaskClick={onAddTaskClick}
        onClearSearch={onClearSearch}
      />
    );
  }

  // Split into active and completed if not explicitly viewing 'completed' filter
  const activeTasks = filter === 'completed' ? [] : tasks.filter((t) => !t.completed);
  const completedTasks = filter === 'completed' ? tasks : tasks.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onUpdateTitle={onUpdateTitle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks section (Collapsible) */}
      {completedTasks.length > 0 && filter !== 'completed' && (
        <div className="pt-3 border-t border-slate-100 dark:border-border-dark/60">
          <button
            type="button"
            onClick={() => setShowCompleted((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-1 px-1 rounded-lg transition-colors"
            aria-expanded={showCompleted}
          >
            {showCompleted ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>Đã hoàn thành ({completedTasks.length})</span>
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-2 animate-fade-in">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onUpdateTitle={onUpdateTitle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* When filtering by completed directly */}
      {filter === 'completed' && (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onUpdateTitle={onUpdateTitle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
