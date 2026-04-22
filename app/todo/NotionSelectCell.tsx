'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { Check } from 'lucide-react';
import { makeCellKey, type OpenCell, type ColorKey } from './types';

type OptionBase = { id: string; label: string; color: ColorKey };

type NotionSelectCellProps<T extends OptionBase> = {
  taskId: string;
  field: 'status' | 'priority';
  openCell: OpenCell;
  setOpenCell: Dispatch<SetStateAction<OpenCell>>;
  valueId: string;
  options: T[];
  onSelect: (id: string) => void;
  onCreateOption: (label: string) => string;
  renderPill: (opt: T | null) => ReactNode;
  className?: string;
};

const panelClass =
  'absolute left-0 top-full z-40 mt-1 min-w-[200px] max-h-[min(60vh,320px)] overflow-y-auto rounded-md border border-[#ececeb] bg-white py-1 shadow-lg';

export function NotionSelectCell<T extends OptionBase>({
  taskId,
  field,
  openCell,
  setOpenCell,
  valueId,
  options,
  onSelect,
  onCreateOption,
  renderPill,
  className = '',
}: NotionSelectCellProps<T>) {
  const cellKey = makeCellKey(taskId, field);
  const isOpen = openCell === cellKey;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [createInput, setCreateInput] = useState('');
  const inputId = useId();

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

  const selected = (options as T[]).find((o) => o.id === valueId) ?? null;

  const handleCreate = () => {
    const label = createInput.trim();
    if (!label) return;
    const newId = onCreateOption(label);
    setCreateInput('');
    onSelect(newId);
    onRequestClose();
  };

  return (
    <div className={`relative ${className}`} ref={wrapRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => (isOpen ? onRequestClose() : onRequestOpen())}
        className="w-full text-left cursor-pointer rounded-sm px-1 py-0.5 hover:bg-[#efefed]/80 -mx-1"
      >
        {renderPill(selected)}
      </button>
      {isOpen && (
        <div className={panelClass} role="listbox">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="option"
              data-selected={o.id === valueId}
              onClick={() => {
                onSelect(o.id);
                onRequestClose();
              }}
              className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-[#37352f] hover:bg-[#efefed]"
            >
              <span className="flex-1 min-w-0 flex items-center gap-1.5">{renderPill(o)}</span>
              {o.id === valueId && <Check className="w-3.5 h-3.5 shrink-0 text-[#2383e2]" />}
            </button>
          ))}
          <div className="border-t border-[#ececeb] px-2 py-1.5">
            <label htmlFor={inputId} className="sr-only">
              Create new option
            </label>
            <input
              id={inputId}
              value={createInput}
              onChange={(e) => setCreateInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              placeholder="Create new…"
              className="w-full border border-dashed border-[#cccccc] rounded px-2 py-1.5 text-sm text-[#37352f] outline-none focus:border-[#2383e2]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
