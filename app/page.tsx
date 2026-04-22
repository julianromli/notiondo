'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  Clock,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  Calendar,
  ArrowDownUp,
  Zap,
  MessageSquare,
  Star,
  Frame,
  CheckSquare,
  Brain,
  PenTool,
  LayoutTemplate,
  DownloadCloud,
  Trash2,
  Home,
  Notebook,
  ArrowRight,
  Target,
  Map,
  BookOpen,
  Archive,
  CheckCircle2,
} from 'lucide-react';
import {
  createDraftTask,
  initialProjectOptions,
  initialPriorityOptions,
  initialStatusOptions,
  initialTasks,
  newProjectOption,
  newPriorityOption,
  newStatusOption,
  type OpenCell,
  type Task,
} from './todo/types';
import { TaskTableRow } from './todo/TaskTableRow';
import { TaskModal } from './todo/TaskModal';

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusOptions, setStatusOptions] = useState(initialStatusOptions);
  const [priorityOptions, setPriorityOptions] = useState(initialPriorityOptions);
  const [projectOptions, setProjectOptions] = useState(initialProjectOptions);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingTask, setCreatingTask] = useState<Task | null>(null);
  const [openCell, setOpenCell] = useState<OpenCell>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<'none' | 'name' | 'due'>('none');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [activeView, setActiveView] = useState<'all' | 'board' | 'calendar'>('all');

  const defaultStatusId = statusOptions.find((s) => s.id === 's-not-started')?.id ?? statusOptions[0]?.id ?? 's-not-started';
  const defaultPriorityId = priorityOptions.find((p) => p.id === 'p-medium')?.id ?? priorityOptions[0]?.id ?? 'p-medium';

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditingTask((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  };

  const handleModalUpdate = (id: string, updates: Partial<Task>) => {
    if (creatingTask && creatingTask.id === id) {
      setCreatingTask((c) => (c ? { ...c, ...updates } : c));
      return;
    }
    updateTask(id, updates);
  };

  const closeModal = () => {
    setEditingTask(null);
    setCreatingTask(null);
  };

  const addCreatingTask = () => {
    if (!creatingTask) return;
    setTasks((prev) => [...prev, creatingTask]);
    setCreatingTask(null);
  };

  const addStatusOption = (label: string) => {
    const o = newStatusOption(label);
    setStatusOptions((prev) => [...prev, o]);
    return o.id;
  };

  const addPriorityOption = (label: string) => {
    const o = newPriorityOption(label);
    setPriorityOptions((prev) => [...prev, o]);
    return o.id;
  };

  const addProjectOption = (label: string) => {
    const o = newProjectOption(label);
    setProjectOptions((prev) => [...prev, o]);
    return o.id;
  };

  const startNewTask = (group: Task['group']) => {
    setOpenCell(null);
    setEditingTask(null);
    setCreatingTask(createDraftTask(group, defaultStatusId, defaultPriorityId));
  };

  const applyList = (list: Task[]) => {
    const q = filterQuery.trim().toLowerCase();
    let t = list.filter((x) => !q || x.name.toLowerCase().includes(q));
    if (sortKey === 'name') {
      t = [...t].sort((a, b) =>
        sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    } else if (sortKey === 'due') {
      t = [...t].sort((a, b) =>
        sortDir === 'asc' ? a.due.localeCompare(b.due) : b.due.localeCompare(a.due)
      );
    }
    return t;
  };

  const todayTasks = useMemo(
    () => applyList(tasks.filter((t) => t.group === 'Today')),
    [tasks, filterQuery, sortKey, sortDir]
  );
  const thisWeekTasks = useMemo(
    () => applyList(tasks.filter((t) => t.group === 'This Week')),
    [tasks, filterQuery, sortKey, sortDir]
  );
  const laterTasks = useMemo(
    () => applyList(tasks.filter((t) => t.group === 'Later')),
    [tasks, filterQuery, sortKey, sortDir]
  );

  return (
    <div className="flex h-screen bg-white text-[#37352f] overflow-hidden selection:bg-[rgba(35,131,226,0.14)]">
      <aside className="w-[240px] flex-shrink-0 bg-[#fbfbfa] border-r border-[#ececeb] flex flex-col group/sidebar transition-all duration-300">
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 md:px-4 py-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 text-sm font-medium transition-colors">
            <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center text-xs font-bold font-mono">
              N
            </div>
            <span className="flex-1 truncate">Acme Workspace</span>
            <ArrowDownUp className="w-3 h-3 text-[#505050]" />
          </div>

          <div className="mt-2 space-y-[2px]">
            <SidebarItem icon={<Search className="w-4 h-4" />} label="Search" />
            <SidebarItem icon={<Clock className="w-4 h-4" />} label="Updates" />
            <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings & members" />
          </div>

          <div className="mt-6">
            <SidebarGroup title="Favorites" defaultExpanded>
              <SidebarItem icon={<Notebook className="w-4 h-4 text-[#a5a4a2]" />} label="Meeting Notes" />
              <SidebarItem icon={<Map className="w-4 h-4 text-[#a5a4a2]" />} label="Project Roadmap" />
              <SidebarItem icon={<Target className="w-4 h-4 text-[#a5a4a2]" />} label="OKRs" />
              <SidebarItem icon={<CheckSquare className="w-4 h-4 text-green-500" />} label="Todo List" active />
            </SidebarGroup>
          </div>

          <div className="mt-6">
            <SidebarGroup title="Private" defaultExpanded>
              <SidebarItem icon={<Home className="w-4 h-4 text-[#a5a4a2]" />} label="Home" />
              <SidebarItem icon={<BookOpen className="w-4 h-4 text-[#a5a4a2]" />} label="Projects" />
              <SidebarItem icon={<Archive className="w-4 h-4 text-[#a5a4a2]" />} label="Resources" />
              <SidebarItem icon={<Brain className="w-4 h-4 text-[#a5a4a2]" />} label="Ideas" />
              <SidebarItem icon={<PenTool className="w-4 h-4 text-[#a5a4a2]" />} label="Journal" />

              <div className="px-3 md:px-4 py-[6px] hover:bg-[#efefed] cursor-pointer flex items-center gap-2 text-sm text-[#787774] mt-1 transition-colors group/add">
                <Plus className="w-4 h-4" />
                <span>Add a page</span>
              </div>
            </SidebarGroup>
          </div>
        </div>

        <div className="p-2 border-t border-[#ececeb] text-sm text-[#787774] space-y-[2px]">
          <SidebarItem icon={<LayoutTemplate className="w-4 h-4" />} label="Templates" />
          <SidebarItem icon={<DownloadCloud className="w-4 h-4" />} label="Import" />
          <SidebarItem icon={<Trash2 className="w-4 h-4" />} label="Trash" />
        </div>

        <div className="px-3 md:px-4 py-3 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 text-sm font-medium border-t border-[#ececeb] transition-colors text-[#37352f]">
          <Plus className="w-4 h-4" />
          <span>New page</span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="h-12 px-3 flex items-center justify-between sticky top-0 bg-white z-10 w-full shrink-0">
          <div className="flex items-center gap-1 text-sm text-[#787774] overflow-hidden">
            <button type="button" className="p-1 hover:bg-[#efefed] rounded transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button type="button" className="p-1 hover:bg-[#efefed] rounded transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center ml-2 px-1 hover:bg-[#efefed] rounded cursor-pointer transition-colors shrink-0">
              <Home className="w-4 h-4 mr-1.5 text-[#37352f]" />
              <span className="text-[#37352f]">Home</span>
            </div>
            <span className="mx-1">/</span>
            <div className="flex items-center px-1 hover:bg-[#efefed] rounded cursor-pointer transition-colors max-w-[200px] truncate">
              <CheckSquare className="w-4 h-4 mr-1.5 text-green-500" />
              <span className="text-[#37352f] truncate font-medium">Todo List</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-[#787774] shrink-0">
            <span className="mr-3 hidden md:inline-block">Edited just now</span>
            <button type="button" className="px-2 py-1 hover:bg-[#efefed] rounded transition-colors text-[#37352f]">
              Share
            </button>
            <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors">
              <Clock className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors">
              <Star className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-[1240px] mx-auto px-12 md:px-24 py-12 pb-32">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-xl flex items-center justify-center text-white mb-6 relative group">
                <CheckSquare className="w-12 h-12 stroke-[3px] text-white absolute" />
              </div>
              <h1 className="text-5xl font-bold text-[#37352f] tracking-tight mb-8">Todo List</h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#ececeb] pb-2 mb-4 gap-4">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveView('all')}
                  className={`flex items-center gap-2 pb-2 -mb-[10px] ${
                    activeView === 'all'
                      ? 'font-semibold text-[#37352f] border-b-2 border-[#37352f]'
                      : 'text-[#787774] hover:text-[#37352f] transition-colors'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  All Tasks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('board')}
                  className={`flex items-center gap-2 pb-2 -mb-[10px] ${
                    activeView === 'board'
                      ? 'font-semibold text-[#37352f] border-b-2 border-[#37352f]'
                      : 'text-[#787774] hover:text-[#37352f] transition-colors'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Board
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('calendar')}
                  className={`flex items-center gap-2 pb-2 -mb-[10px] ${
                    activeView === 'calendar'
                      ? 'font-semibold text-[#37352f] border-b-2 border-[#37352f]'
                      : 'text-[#787774] hover:text-[#37352f] transition-colors'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
                <button
                  type="button"
                  onClick={() => startNewTask('Today')}
                  className="text-[#787774] hover:text-[#37352f] transition-colors p-1"
                  title="New task (Today)"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#787774] flex-wrap">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterOpen((f) => !f);
                      setSortOpen(false);
                    }}
                    className="hover:bg-[#efefed] px-2 py-1 rounded transition-colors"
                  >
                    Filter
                  </button>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSortOpen((s) => !s);
                      setFilterOpen(false);
                    }}
                    className="hover:bg-[#efefed] px-2 py-1 rounded transition-colors"
                  >
                    Sort{sortKey !== 'none' ? ` · ${sortKey} (${sortDir})` : ''}
                  </button>
                  {sortOpen && (
                    <div
                      className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-[#ececeb] bg-white py-1 shadow-lg text-[#37352f] text-left"
                      onMouseLeave={() => setSortOpen(false)}
                    >
                      {(['none', 'name', 'due'] as const).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setSortKey(k);
                            setSortOpen(false);
                          }}
                          className="block w-full px-3 py-1.5 text-left text-sm hover:bg-[#efefed]"
                        >
                          {k === 'none' ? 'Default (group order)' : k === 'name' ? 'Name' : 'Due date'}
                        </button>
                      ))}
                      {sortKey !== 'none' && (
                        <button
                          type="button"
                          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                          className="block w-full px-3 py-1.5 text-left text-sm hover:bg-[#efefed] border-t border-[#ececeb]"
                        >
                          Direction: {sortDir === 'asc' ? 'Ascending' : 'Descending'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {filterOpen && (
                  <div className="flex items-center gap-1 w-full md:w-auto order-last md:order-none">
                    <input
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      placeholder="Filter by name…"
                      className="min-w-[160px] flex-1 md:flex-none text-sm border border-[#ececeb] rounded px-2 py-1 text-[#37352f] outline-none focus:ring-1 focus:ring-[#2383e2]/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFilterQuery('');
                        setFilterOpen(false);
                      }}
                      className="text-xs text-[#787774] hover:text-[#37352f] px-1"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors" title="Automations (placeholder)">
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-[#efefed] rounded transition-colors"
                  onClick={() => {
                    setFilterOpen(true);
                    (document.querySelector('input[placeholder^="Filter"]') as HTMLInputElement)?.focus();
                  }}
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-[#efefed] rounded transition-colors" title="More (placeholder)">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <div className="flex items-center bg-[#2383e2] text-white rounded font-medium shadow-sm ml-2">
                  <button
                    type="button"
                    onClick={() => startNewTask('Today')}
                    className="px-3 py-1.5 hover:bg-[#1f73c7] rounded-l transition-colors"
                  >
                    New
                  </button>
                  <div className="w-[1px] h-4 bg-white/30" />
                  <button
                    type="button"
                    onClick={() => startNewTask('Today')}
                    className="px-1.5 py-1.5 hover:bg-[#1f73c7] rounded-r transition-colors"
                    title="New task in Today"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {activeView === 'board' && (
              <div className="mb-4 rounded-lg border border-dashed border-[#ececeb] px-4 py-3 text-sm text-[#787774]">
                Board: kanban by status / group is a placeholder — the table below stays editable.
              </div>
            )}
            {activeView === 'calendar' && (
              <div className="mb-4 rounded-lg border border-dashed border-[#ececeb] px-4 py-3 text-sm text-[#787774]">
                Calendar: month grid from <code className="text-[#37352f]">due</code> is a placeholder — the table below stays editable.
              </div>
            )}

            <div className="w-full">
                <TaskGroup title="Today">
                  <TableHeader />
                  {todayTasks.map((task) => (
                    <TaskTableRow
                      key={task.id}
                      task={task}
                      statusOptions={statusOptions}
                      priorityOptions={priorityOptions}
                      projectOptions={projectOptions}
                      openCell={openCell}
                      setOpenCell={setOpenCell}
                      onUpdate={updateTask}
                      onAddStatusOption={addStatusOption}
                      onAddPriorityOption={addPriorityOption}
                      onAddProjectOption={addProjectOption}
                      onOpenDetail={() => {
                        setOpenCell(null);
                        setCreatingTask(null);
                        setEditingTask(task);
                      }}
                    />
                  ))}
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        startNewTask('Today');
                      }
                    }}
                    onClick={() => startNewTask('Today')}
                    className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors rounded-sm group/new border-b border-[#ececeb]"
                  >
                    <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                  </div>
                </TaskGroup>

                <div className="mt-8">
                  <TaskGroup title="This Week">
                    <TableHeader />
                    {thisWeekTasks.map((task) => (
                      <TaskTableRow
                        key={task.id}
                        task={task}
                        statusOptions={statusOptions}
                        priorityOptions={priorityOptions}
                        projectOptions={projectOptions}
                        openCell={openCell}
                        setOpenCell={setOpenCell}
                        onUpdate={updateTask}
                        onAddStatusOption={addStatusOption}
                        onAddPriorityOption={addPriorityOption}
                        onAddProjectOption={addProjectOption}
                        onOpenDetail={() => {
                          setOpenCell(null);
                          setCreatingTask(null);
                          setEditingTask(task);
                        }}
                      />
                    ))}
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          startNewTask('This Week');
                        }
                      }}
                      onClick={() => startNewTask('This Week')}
                      className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors rounded-sm border-b border-[#ececeb]"
                    >
                      <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                    </div>
                  </TaskGroup>
                </div>

                <div className="mt-8">
                  <TaskGroup title="Later">
                    <TableHeader />
                    {laterTasks.map((task) => (
                      <TaskTableRow
                        key={task.id}
                        task={task}
                        statusOptions={statusOptions}
                        priorityOptions={priorityOptions}
                        projectOptions={projectOptions}
                        openCell={openCell}
                        setOpenCell={setOpenCell}
                        onUpdate={updateTask}
                        onAddStatusOption={addStatusOption}
                        onAddPriorityOption={addPriorityOption}
                        onAddProjectOption={addProjectOption}
                        onOpenDetail={() => {
                          setOpenCell(null);
                          setCreatingTask(null);
                          setEditingTask(task);
                        }}
                      />
                    ))}
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          startNewTask('Later');
                        }
                      }}
                      onClick={() => startNewTask('Later')}
                      className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors border-b border-transparent"
                    >
                      <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                    </div>
                  </TaskGroup>
                </div>

                <div className="mt-4 pt-4 text-xs font-mono text-[#a5a4a2] flex items-center gap-2 pl-2 pb-12">
                  <span>COUNT</span>
                  <span className="font-sans font-medium text-[#37352f] text-sm">{tasks.length}</span>
                </div>
            </div>
          </div>
        </div>
      </main>

      {(editingTask || creatingTask) && (
        <TaskModal
          task={editingTask ?? creatingTask!}
          mode={creatingTask ? 'create' : 'edit'}
          onClose={closeModal}
          onUpdate={handleModalUpdate}
          onAdd={creatingTask ? addCreatingTask : undefined}
          statusOptions={statusOptions}
          setStatusOptions={setStatusOptions}
          priorityOptions={priorityOptions}
          setPriorityOptions={setPriorityOptions}
          projectOptions={projectOptions}
          setProjectOptions={setProjectOptions}
        />
      )}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex items-center text-sm text-[#787774] font-medium py-2 border-b border-[#ececeb]">
      <div className="w-[300px] flex items-center gap-2 pl-2">
        <span className="font-mono text-xs text-[#9b9a97]">Aa</span> Task
      </div>
      <div className="w-[140px] flex items-center gap-2">
        <div className="border border-[#787774] border-dashed rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold">
          +
        </div>
        Status
      </div>
      <div className="w-[120px] flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5" /> Priority
      </div>
      <div className="w-[140px] flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5" /> Due
      </div>
      <div className="w-[160px] flex items-center gap-2">
        <Frame className="w-3.5 h-3.5" /> Projects
      </div>
      <div className="flex-1 flex justify-end pr-2 text-xs opacity-0">...</div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`px-3 md:px-4 py-[6px] cursor-pointer flex items-center gap-2 text-sm transition-colors rounded-sm mx-1 ${
        active ? 'bg-[#efefed] text-[#37352f] font-medium' : 'text-[#787774] hover:bg-[#efefed] hover:text-[#37352f]'
      }`}
    >
      <div
        className={`flex items-center justify-center w-5 h-5 ${active ? 'text-[#37352f]' : 'text-[#a5a4a2]'}`}
      >
        {icon}
      </div>
      <span className="flex-1 truncate">{label}</span>
    </div>
  );
}

function SidebarGroup({
  title,
  children,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <div>
      <div
        className="px-3 md:px-4 py-1 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 text-xs font-bold text-[#a5a4a2] transition-colors group/header"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform opacity-0 group-hover/header:opacity-100 ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        <span className="-ml-1">{title}</span>
      </div>
      {expanded && <div className="mt-[2px] space-y-[2px]">{children}</div>}
    </div>
  );
}

function TaskGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2 font-semibold text-lg text-[#37352f] group/group-header cursor-pointer">
        <div className="p-0.5 hover:bg-[#efefed] rounded">
          <ChevronDown className="w-5 h-5 text-[#37352f]" />
        </div>
        {title}
      </div>
      <div className="pl-0">
        <div className="min-w-[900px] border-t border-[#ececeb]">{children}</div>
      </div>
    </div>
  );
}
