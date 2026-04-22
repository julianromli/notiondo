'use client';

import { useId, useState, type Dispatch, type SetStateAction } from 'react';
import { Calendar, CheckCircle2, CheckSquare, Circle, Frame, X } from 'lucide-react';
import type { PriorityOption, ProjectOption, StatusOption, Task } from './types';
import { newPriorityOption, newProjectOption, newStatusOption } from './types';
import { Pill } from './DisplayPills';

type TaskModalProps = {
  task: Task;
  mode?: 'create' | 'edit';
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onAdd?: () => void;
  statusOptions: StatusOption[];
  setStatusOptions: Dispatch<SetStateAction<StatusOption[]>>;
  priorityOptions: PriorityOption[];
  setPriorityOptions: Dispatch<SetStateAction<PriorityOption[]>>;
  projectOptions: ProjectOption[];
  setProjectOptions: Dispatch<SetStateAction<ProjectOption[]>>;
};

export function TaskModal({
  task,
  mode = 'edit',
  onClose,
  onUpdate,
  onAdd,
  statusOptions,
  setStatusOptions,
  priorityOptions,
  setPriorityOptions,
  projectOptions,
  setProjectOptions,
}: TaskModalProps) {
  const [newStatusName, setNewStatusName] = useState('');
  const [newPriorityName, setNewPriorityName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const sid = useId();
  const pid = useId();
  const prid = useId();

  const addStatus = () => {
    const t = newStatusName.trim();
    if (!t) return;
    const o = newStatusOption(t);
    setStatusOptions((prev) => [...prev, o]);
    onUpdate(task.id, { statusId: o.id });
    setNewStatusName('');
  };

  const addPriority = () => {
    const t = newPriorityName.trim();
    if (!t) return;
    const o = newPriorityOption(t);
    setPriorityOptions((prev) => [...prev, o]);
    onUpdate(task.id, { priorityId: o.id });
    setNewPriorityName('');
  };

  const addProject = () => {
    const t = newProjectName.trim();
    if (!t) return;
    const o = newProjectOption(t);
    setProjectOptions((prev) => [...prev, o]);
    onUpdate(task.id, { projectIds: [...task.projectIds, o.id] });
    setNewProjectName('');
  };

  const toggleProject = (id: string) => {
    if (task.projectIds.includes(id)) {
      onUpdate(task.id, { projectIds: task.projectIds.filter((x) => x !== id) });
    } else {
      onUpdate(task.id, { projectIds: [...task.projectIds, id] });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[600px] min-h-[500px] max-h-[90vh] rounded-xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#ececeb] shrink-0">
          <div className="flex items-center gap-2 text-[#787774] text-sm">
            <CheckSquare className="w-4 h-4" />
            <span>{mode === 'create' ? 'New task' : 'Task Detail'}</span>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-[#efefed] rounded text-[#787774] transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto min-h-0">
          <input
            type="text"
            value={task.name}
            onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            className="text-4xl font-bold text-[#37352f] tracking-tight mb-8 w-full border-none outline-none bg-transparent placeholder-[#cccccc]"
            placeholder="Untitled Task"
          />

          <div className="space-y-4 max-w-sm">
            <div className="flex items-start min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2 pt-1">
                <Circle className="w-4 h-4" />
                Status
              </div>
              <div className="flex-1 space-y-2">
                <select
                  className="bg-transparent text-sm text-[#37352f] outline-none hover:bg-[#efefed] px-2 py-1 -ml-2 rounded cursor-pointer appearance-none w-full"
                  value={task.statusId}
                  onChange={(e) => onUpdate(task.id, { statusId: e.target.value })}
                >
                  {statusOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <input
                    id={sid}
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStatus())}
                    placeholder="Add status option…"
                    className="flex-1 text-sm border border-dashed border-[#cccccc] rounded px-2 py-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addStatus}
                    className="text-xs text-[#2383e2] px-2 py-1 hover:underline"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                Priority
              </div>
              <div className="flex-1 space-y-2">
                <select
                  className="bg-transparent text-sm text-[#37352f] outline-none hover:bg-[#efefed] px-2 py-1 -ml-2 rounded cursor-pointer appearance-none w-full"
                  value={task.priorityId}
                  onChange={(e) => onUpdate(task.id, { priorityId: e.target.value })}
                >
                  {priorityOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <input
                    id={pid}
                    value={newPriorityName}
                    onChange={(e) => setNewPriorityName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPriority())}
                    placeholder="Add priority option…"
                    className="flex-1 text-sm border border-dashed border-[#cccccc] rounded px-2 py-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addPriority}
                    className="text-xs text-[#2383e2] px-2 py-1 hover:underline"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={task.due}
                  onChange={(e) => onUpdate(task.id, { due: e.target.value })}
                  className="bg-transparent text-sm text-[#37352f] outline-none hover:bg-[#efefed] px-2 py-1 -ml-2 rounded cursor-text w-full placeholder-[#cccccc]"
                  placeholder="Empty"
                />
              </div>
            </div>

            <div className="flex items-start min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2 pt-1">
                <Frame className="w-4 h-4" />
                Projects
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                  {projectOptions.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-sm text-[#37352f] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[#ccc]"
                        checked={task.projectIds.includes(p.id)}
                        onChange={() => toggleProject(p.id)}
                      />
                      <Pill color={p.color}>{p.label}</Pill>
                    </label>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input
                    id={prid}
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
                    placeholder="Add project…"
                    className="flex-1 text-sm border border-dashed border-[#cccccc] rounded px-2 py-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-xs text-[#2383e2] px-2 py-1 hover:underline"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#ececeb] pt-8">
            <p className="text-[#a5a4a2] text-sm italic">Click below or start typing to add notes…</p>
          </div>
        </div>

        {mode === 'create' && onAdd ? (
          <div className="px-5 py-4 border-t border-[#ececeb] flex justify-end shrink-0">
            <button
              type="button"
              onClick={onAdd}
              className="px-4 py-2 rounded-md bg-[#2383e2] text-white text-sm font-medium hover:bg-[#1f73c7] transition-colors"
            >
              Add
            </button>
          </div>
        ) : mode === 'edit' ? (
          <div className="px-5 py-4 border-t border-[#ececeb] flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#2383e2] text-white text-sm font-medium hover:bg-[#1f73c7] transition-colors"
            >
              Accept
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
