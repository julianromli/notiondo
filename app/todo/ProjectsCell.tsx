'use client';

import { useCallback, useEffect, useId, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Check, Plus } from 'lucide-react';
import { makeCellKey, type OpenCell, type ProjectOption } from './types';
import { Pill } from './DisplayPills';

type ProjectsCellProps = {
  taskId: string;
  openCell: OpenCell;
  setOpenCell: Dispatch<SetStateAction<OpenCell>>;
  projectIds: string[];
  projectOptions: ProjectOption[];
  onChange: (ids: string[]) => void;
  onCreateOption: (label: string) => string;
  className?: string;
};

const panelClass =
  'absolute left-0 top-full z-40 mt-1 w-[min(100vw,240px)] max-h-[min(60vh,320px)] overflow-y-auto rounded-md border border-[#ececeb] bg-white py-1 shadow-lg';

export function ProjectsCell({
  taskId,
  openCell,
  setOpenCell,
  projectIds,
  projectOptions,
  onChange,
  onCreateOption,
  className = '',
}: ProjectsCellProps) {
  const cellKey = makeCellKey(taskId, 'projects');
  const isOpen = openCell === cellKey;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [createInput, setCreateInput] = useState('');
  const createId = useId();

  const onRequestOpen = useCallback(() => {
    setOpenCell(cellKey);
  }, [setOpenCell, cellKey]);

  const onRequestClose = useCallback(() => {
    setOpenCell((prev) => (prev === cellKey ? null : prev));
  }, [setOpenCell, cellKey]);

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onRequestClose();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onRequestClose]);

  const byId = (id: string) => projectOptions.find((o) => o.id === id);

  const toggle = (id: string) => {
    if (projectIds.includes(id)) {
      onChange(projectIds.filter((x) => x !== id));
    } else {
      onChange([...projectIds, id]);
    }
  };

  const handleCreate = () => {
    const label = createInput.trim();
    if (!label) return;
    const newId = onCreateOption(label);
    setCreateInput('');
    if (!projectIds.includes(newId)) {
      onChange([...projectIds, newId]);
    }
  };

  return (
    <div className={`relative min-h-[32px] ${className}`} ref={wrapRef} onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-center gap-1 pr-1">
        {projectIds.map((id) => {
          const p = byId(id);
          if (!p) return null;
          return (
            <Pill key={id} color={p.color}>
              {p.label}
            </Pill>
          );
        })}
        <button
          type="button"
          onClick={() => (isOpen ? onRequestClose() : onRequestOpen())}
          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#a5a4a2] hover:bg-[#efefed] hover:text-[#37352f] shrink-0"
          title="Add project"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {isOpen && (
        <div className={panelClass}>
          {projectOptions.map((o) => {
            const active = projectIds.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-[#37352f] hover:bg-[#efefed]"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active ? 'border-[#2383e2] bg-[#2383e2] text-white' : 'border-[#ccc]'
                  }`}
                >
                  {active && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                <Pill color={o.color}>{o.label}</Pill>
              </button>
            );
          })}
          <div className="border-t border-[#ececeb] px-2 py-1.5">
            <label htmlFor={createId} className="sr-only">
              Create new project
            </label>
            <input
              id={createId}
              value={createInput}
              onChange={(e) => setCreateInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              placeholder="Create new project…"
              className="w-full border border-dashed border-[#cccccc] rounded px-2 py-1.5 text-sm text-[#37352f] outline-none focus:border-[#2383e2]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
