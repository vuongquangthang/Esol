import React, { useState } from 'react';
import {
  Play,
  ShieldAlert,
  Split,
  FolderKanban,
  Star,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { Task, Project, LifeDomain, TaskStatus, SubTask, DOMAINS } from '../../types/momentum';

interface TaskManagementModuleProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTaskStatus: (id: string) => void;
  onSetTodayPriority: (id: string, isPriority: boolean) => void;
  onStartFocus: (task: Task) => void;
  onStartRecovery: (task: Task) => void;
}

export const TaskManagementModule: React.FC<TaskManagementModuleProps> = ({
  tasks,
  projects,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
  onSetTodayPriority,
  onStartFocus,
  onStartRecovery,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [breakdownModalTask, setBreakdownModalTask] = useState<Task | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskMinutes, setNewSubtaskMinutes] = useState(15);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedDomain !== 'all' && t.category !== selectedDomain) return false;
    if (selectedProject !== 'all' && t.projectId !== selectedProject) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    return true;
  });

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakdownModalTask || !newSubtaskTitle.trim()) return;

    const newSub: SubTask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
      estimatedMinutes: Number(newSubtaskMinutes) || 15,
    };

    const updatedSubtasks = [...breakdownModalTask.subtasks, newSub];
    onUpdateTask(breakdownModalTask.id, { subtasks: updatedSubtasks });
    setBreakdownModalTask({ ...breakdownModalTask, subtasks: updatedSubtasks });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    if (!breakdownModalTask) return;
    const updated = breakdownModalTask.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask(breakdownModalTask.id, { subtasks: updated });
    setBreakdownModalTask({ ...breakdownModalTask, subtasks: updated });
  };

  const handleDeleteSubtask = (subId: string) => {
    if (!breakdownModalTask) return;
    const updated = breakdownModalTask.subtasks.filter((s) => s.id !== subId);
    onUpdateTask(breakdownModalTask.id, { subtasks: updated });
    setBreakdownModalTask({ ...breakdownModalTask, subtasks: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#22252e]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản lý Công việc &amp; Dự án
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tổ chức toàn bộ đầu việc theo 6 lĩnh vực và hỗ trợ chia nhỏ (Task Breakdown).
          </p>
        </div>
      </div>

      {/* Projects Bar */}
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Dự án chính</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedProject('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              selectedProject === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                : 'bg-white dark:bg-[#161821] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#262934] hover:bg-slate-50'
            }`}
          >
            Tất cả dự án
          </button>
          {projects.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedProject(proj.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                selectedProject === proj.id
                  ? 'bg-brand-600 text-white border-transparent'
                  : 'bg-white dark:bg-[#161821] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#262934] hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: proj.color }} />
              <span>{proj.title}</span>
              <span className="text-[10px] opacity-70">({proj.progress}%)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Domain filters & Status tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Domain pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDomain('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedDomain === 'all'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Tất cả lĩnh vực
          </button>
          {(Object.keys(DOMAINS) as LifeDomain[]).map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedDomain === dom
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {DOMAINS[dom].vietnameseName}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181a22] p-1 rounded-xl text-xs font-medium">
          {(['all', 'todo', 'doing', 'done'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                selectedStatus === st
                  ? 'bg-white dark:bg-[#252834] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              {st === 'all' ? 'Tất cả' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-[#262934] text-xs text-slate-400">
            Không có công việc nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                task.status === 'done'
                  ? 'bg-slate-50/60 dark:bg-[#121419] border-slate-200/60 dark:border-[#1d2028] opacity-75'
                  : 'bg-white dark:bg-[#161821] border-slate-200 dark:border-[#262934] shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Complete checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTaskStatus(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    task.status === 'done'
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-white dark:bg-[#161821]'
                  }`}
                >
                  {task.status === 'done' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        task.status === 'done'
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Priority badge */}
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border ${DOMAINS[task.category].badgeBg} ${DOMAINS[task.category].darkBadgeBg}`}
                      >
                        {DOMAINS[task.category].vietnameseName}
                      </span>

                      {/* Today Priority Star */}
                      <button
                        type="button"
                        onClick={() => onSetTodayPriority(task.id, !task.isTodayPriority)}
                        title={
                          task.isTodayPriority
                            ? 'Bỏ khỏi Top 3 ưu tiên hôm nay'
                            : 'Ghim vào Top 3 ưu tiên hôm nay'
                        }
                        className={`p-1 rounded-lg transition-colors ${
                          task.isTodayPriority
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-[#20232c]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${task.isTodayPriority ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Next Action callout */}
                  <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <span className="font-semibold text-brand-600 dark:text-brand-400">Next Action:</span>
                    <span>{task.nextAction || 'Chưa xác định hành động đầu tiên'}</span>
                  </div>

                  {/* Subtasks summary */}
                  {task.subtasks.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtask hoàn thành
                      </span>
                    </div>
                  )}

                  {/* Action buttons row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-[#20232c] text-xs">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>Dự kiến: {task.estimatedMinutes || 30}m</span>
                      {task.postponedCount > 0 && (
                        <span className="text-amber-500 font-medium">
                          Đã hoãn: {task.postponedCount} lần
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBreakdownModalTask(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252834] rounded-lg transition-colors"
                      >
                        <Split className="w-3 h-3" />
                        <span>Chia nhỏ ({task.subtasks.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onStartRecovery(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>Trì hoãn</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onStartFocus(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Focus</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#252834] rounded-lg transition-colors ml-1"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Breakdown Modal */}
      {breakdownModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-[#161821] border border-slate-200 dark:border-[#2a2d39] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#22252e]">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Task Breakdown (Chia nhỏ nhiệm vụ 15-30 phút)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModalTask(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-400 font-medium">Nhiệm vụ gốc:</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {breakdownModalTask.title}
                </div>
              </div>

              {/* Form to add subtask */}
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="VD: Đọc tài liệu, Viết code test mẫu..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <input
                  type="number"
                  value={newSubtaskMinutes}
                  onChange={(e) => setNewSubtaskMinutes(Number(e.target.value))}
                  placeholder="Phút"
                  className="w-20 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#2a2d39] bg-slate-50 dark:bg-[#121318] text-slate-900 dark:text-white focus:outline-none"
                  min={5}
                  max={60}
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors disabled:opacity-50"
                >
                  Thêm
                </button>
              </form>

              {/* Subtask list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
                {breakdownModalTask.subtasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Chưa có bước nhỏ nào. Hãy chia nhỏ công việc thành các bước từ 15-30 phút để bắt đầu dễ dàng hơn!
                  </p>
                ) : (
                  breakdownModalTask.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#22252e] bg-slate-50/50 dark:bg-[#121318]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(sub.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            sub.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'
                          }`}
                        >
                          {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span
                          className={`text-xs font-medium truncate ${
                            sub.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {sub.title}
                        </span>
                        {sub.estimatedMinutes && (
                          <span className="text-[10px] text-slate-400">({sub.estimatedMinutes}m)</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(sub.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBreakdownModalTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl"
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
