'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { OpenCell, PriorityOption, ProjectOption, StatusOption, Task } from './types';
import { Pill, StatusIcon } from './DisplayPills';
import { NotionSelectCell } from './NotionSelectCell';
import { ProjectsCell } from './ProjectsCell';

export type TaskTableRowProps = {
  task: Task;
  statusOptions: StatusOption[];
  priorityOptions: PriorityOption[];
  projectOptions: ProjectOption[];
  openCell: OpenCell;
  setOpenCell: Dispatch<SetStateAction<OpenCell>>;
  onUpdate: (id: string, updates: Partial<Task>) => void | Promise<void>;
  onOpenDetail: () => void;
  onDelete: (id: string) => void | Promise<void>;
  onAddStatusOption: (label: string) => string | Promise<string>;
  onAddPriorityOption: (label: string) => string | Promise<string>;
  onAddProjectOption: (label: string) => string | Promise<string>;
  dragDisabled: boolean;
};

export function TaskTableRow({
  task,
  statusOptions,
  priorityOptions,
  projectOptions,
  openCell,
  setOpenCell,
  onUpdate,
  onOpenDetail,
  onDelete,
  onAddStatusOption,
  onAddPriorityOption,
  onAddProjectOption,
  dragDisabled,
}: TaskTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Source row hidden while DragOverlay shows the preview (better in scroll containers).
    opacity: isDragging ? 0 : undefined,
  };

  const toggleChecked = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(task.id, { checked: !task.checked });
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, closeMenu]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeMenu();
    void onDelete(task.id);
  };

  const dragTitle = dragDisabled
    ? 'Reordering is available when sort is “Default” and the name filter is empty.'
    : 'Drag to reorder';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onOpenDetail}
      className="flex items-center text-sm py-2 border-b border-[#ececeb] hover:bg-[#fbfbfa] transition-colors group/row cursor-pointer"
    >
      <div className="w-7 shrink-0 flex justify-center pl-1">
        <button
          type="button"
          className={`p-0.5 rounded text-[#a5a4a2] hover:bg-[#efefed] hover:text-[#37352f] ${
            dragDisabled ? 'cursor-not-allowed opacity-35' : 'cursor-grab active:cursor-grabbing'
          }`}
          title={dragTitle}
          aria-label={dragTitle}
          {...(dragDisabled ? {} : listeners)}
          {...(dragDisabled ? {} : attributes)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="w-[300px] flex items-center pl-2 min-w-0">
        <button
          type="button"
          onClick={toggleChecked}
          className={`w-4 h-4 rounded-sm flex items-center justify-center mr-3 shrink-0 ${
            task.checked
              ? 'bg-[#2383e2] text-white border-transparent'
              : 'border border-[#cccccc] hover:border-[#37352f]'
          }`}
        >
          {task.checked && <CheckSquare className="w-3.5 h-3.5 max-w-full" strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <input
            value={task.name}
            onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="font-medium text-[#37352f] bg-transparent border-none outline-none w-full min-w-0 py-0.5 rounded-sm focus:ring-1 focus:ring-[#2383e2]/40"
            placeholder="Untitled"
          />
          {task.description.trim() ? (
            <span className="text-xs text-[#a5a4a2] truncate">{task.description.trim()}</span>
          ) : null}
        </div>
      </div>

      <div className="w-[140px] flex items-center px-1 shrink-0">
        <NotionSelectCell<StatusOption>
          taskId={task.id}
          field="status"
          openCell={openCell}
          setOpenCell={setOpenCell}
          valueId={task.statusId}
          options={statusOptions}
          onSelect={(id) => onUpdate(task.id, { statusId: id })}
          onCreateOption={onAddStatusOption}
          renderPill={(o) =>
            o ? (
              <Pill color={o.color}>
                <StatusIcon type={o.type} color={o.color} />
                {o.label}
              </Pill>
            ) : (
              <span className="text-[#a5a4a2] text-xs">—</span>
            )
          }
        />
      </div>

      <div className="w-[120px] flex items-center px-1 shrink-0">
        <NotionSelectCell<PriorityOption>
          taskId={task.id}
          field="priority"
          openCell={openCell}
          setOpenCell={setOpenCell}
          valueId={task.priorityId}
          options={priorityOptions}
          onSelect={(id) => onUpdate(task.id, { priorityId: id })}
          onCreateOption={onAddPriorityOption}
          renderPill={(o) =>
            o ? (
              <Pill color={o.color}>{o.label}</Pill>
            ) : (
              <span className="text-[#a5a4a2] text-xs">—</span>
            )
          }
        />
      </div>

      <div className="w-[140px] flex items-center text-[#37352f] px-1 shrink-0">
        <input
          value={task.due}
          onChange={(e) => onUpdate(task.id, { due: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full bg-transparent text-sm border-none outline-none py-0.5 rounded-sm focus:ring-1 focus:ring-[#2383e2]/40"
          placeholder="Empty"
        />
      </div>

      <div className="w-[160px] flex items-start px-1 min-w-0 shrink-0">
        <ProjectsCell
          taskId={task.id}
          openCell={openCell}
          setOpenCell={setOpenCell}
          projectIds={task.projectIds}
          projectOptions={projectOptions}
          onChange={(ids) => onUpdate(task.id, { projectIds: ids })}
          onCreateOption={onAddProjectOption}
        />
      </div>

      <div className="flex-1 flex justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity relative">
        <div className="relative" ref={menuWrapRef}>
          <button
            type="button"
            className="p-1 hover:bg-[#efefed] rounded text-[#787774]"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-[#ececeb] bg-white py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#c63426] hover:bg-[#fbfbfa]"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
