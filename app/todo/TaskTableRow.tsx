'use client';

import { CheckSquare, MoreHorizontal } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
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
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onOpenDetail: () => void;
  onAddStatusOption: (label: string) => string;
  onAddPriorityOption: (label: string) => string;
  onAddProjectOption: (label: string) => string;
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
  onAddStatusOption,
  onAddPriorityOption,
  onAddProjectOption,
}: TaskTableRowProps) {
  const toggleChecked = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(task.id, { checked: !task.checked });
  };

  return (
    <div
      onClick={onOpenDetail}
      className="flex items-center text-sm py-2 border-b border-[#ececeb] hover:bg-[#fbfbfa] transition-colors group/row cursor-pointer"
    >
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
        <input
          value={task.name}
          onChange={(e) => onUpdate(task.id, { name: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="font-medium text-[#37352f] bg-transparent border-none outline-none flex-1 min-w-0 py-0.5 rounded-sm focus:ring-1 focus:ring-[#2383e2]/40"
          placeholder="Untitled"
        />
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

      <div className="flex-1 flex justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-1 hover:bg-[#efefed] rounded text-[#787774]"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
