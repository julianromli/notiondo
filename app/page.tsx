'use client';

import React, { useState } from 'react';
import { 
  Search, Clock, Settings, ChevronRight, ChevronDown, 
  Plus, MoreHorizontal, LayoutGrid, Calendar, Filter, 
  ArrowDownUp, Zap, MessageSquare, Star, Share, Frame, 
  CheckSquare, FileText, Brain, PenTool, LayoutTemplate, 
  DownloadCloud, Trash2, Home, Notebook, ArrowRight,
  Circle, CheckCircle2, MoreVertical, PlusSquare, Image as ImageIcon,
  Target, Map, BookOpen, Archive, X
} from 'lucide-react';

const colorMap = {
  green: { bg: 'bg-[#e3f2e8]', text: 'text-[#1e8e3e]', dot: 'bg-green-500' },
  blue: { bg: 'bg-[#e2f1fb]', text: 'text-[#187abf]', dot: 'bg-blue-500' },
  red: { bg: 'bg-[#fbebeae6]', text: 'text-[#c63426]', dot: 'bg-red-500' },
  yellow: { bg: 'bg-[#fcede3]', text: 'text-[#d67b2d]', dot: 'bg-yellow-500' },
  gray: { bg: 'bg-[#f1f1ef]', text: 'text-[#787774]', dot: 'bg-gray-400' },
  purple: { bg: 'bg-[#f3eef9]', text: 'text-[#8b4ca8]', dot: 'bg-purple-500' },
  orange: { bg: 'bg-[#faebe0]', text: 'text-[#c66e2c]', dot: 'bg-orange-500' },
};

type Task = {
  id: string;
  name: string;
  checked: boolean;
  status: { label: string, color: keyof typeof colorMap, type: 'done' | 'in-progress' | 'not-started' };
  priority: { label: string, color: keyof typeof colorMap };
  due: string;
  projects: { label: string, color: keyof typeof colorMap }[];
  group: 'Today' | 'This Week' | 'Later';
};

const initialTasks: Task[] = [
  { id: '1', name: 'Reply to emails', checked: false, status: { label: 'Done', color: 'green', type: 'done' }, priority: { label: 'Medium', color: 'yellow' }, due: 'May 24, 2024', projects: [{ label: 'Work', color: 'blue' }], group: 'Today' },
  { id: '2', name: 'Review PR #42', checked: true, status: { label: 'Done', color: 'green', type: 'done' }, priority: { label: 'High', color: 'red' }, due: 'May 24, 2024', projects: [{ label: 'Work', color: 'blue' }], group: 'Today' },
  { id: '3', name: 'Update dashboard', checked: false, status: { label: 'In progress', color: 'blue', type: 'in-progress' }, priority: { label: 'High', color: 'red' }, due: 'May 24, 2024', projects: [{ label: 'Work', color: 'blue' }], group: 'Today' },
  
  { id: '4', name: 'Write blog post', checked: false, status: { label: 'Not started', color: 'gray', type: 'not-started' }, priority: { label: 'Medium', color: 'yellow' }, due: 'May 26, 2024', projects: [{ label: 'Content', color: 'purple' }], group: 'This Week' },
  { id: '5', name: 'Prepare for client call', checked: false, status: { label: 'Not started', color: 'gray', type: 'not-started' }, priority: { label: 'High', color: 'red' }, due: 'May 28, 2024', projects: [{ label: 'Work', color: 'blue' }], group: 'This Week' },
  { id: '6', name: 'Redesign landing page', checked: false, status: { label: 'In progress', color: 'blue', type: 'in-progress' }, priority: { label: 'Medium', color: 'yellow' }, due: 'May 30, 2024', projects: [{ label: 'Design', color: 'purple' }], group: 'This Week' },
  
  { id: '7', name: 'Book flight tickets', checked: false, status: { label: 'Not started', color: 'gray', type: 'not-started' }, priority: { label: 'Low', color: 'green' }, due: 'June 5, 2024', projects: [{ label: 'Personal', color: 'orange' }], group: 'Later' },
  { id: '8', name: 'Learn Next.js', checked: false, status: { label: 'Not started', color: 'gray', type: 'not-started' }, priority: { label: 'Low', color: 'green' }, due: 'June 10, 2024', projects: [{ label: 'Personal', color: 'orange' }], group: 'Later' },
  { id: '9', name: 'Plan summer trip', checked: false, status: { label: 'Not started', color: 'gray', type: 'not-started' }, priority: { label: 'Medium', color: 'yellow' }, due: 'June 15, 2024', projects: [{ label: 'Personal', color: 'orange' }], group: 'Later' },
];

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    if (editingTask && editingTask.id === id) {
      setEditingTask({ ...editingTask, ...updates });
    }
  };

  const todayTasks = tasks.filter(t => t.group === 'Today');
  const thisWeekTasks = tasks.filter(t => t.group === 'This Week');
  const laterTasks = tasks.filter(t => t.group === 'Later');

  return (
    <div className="flex h-screen bg-white text-[#37352f] overflow-hidden selection:bg-[rgba(35,131,226,0.14)]">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-[#fbfbfa] border-r border-[#ececeb] flex flex-col group/sidebar transition-all duration-300">
        <div className="flex-1 overflow-y-auto py-2">
          {/* Workspace Header */}
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

          {/* Favorites Section */}
          <div className="mt-6">
            <SidebarGroup title="Favorites" defaultExpanded>
              <SidebarItem icon={<Notebook className="w-4 h-4 text-[#a5a4a2]" />} label="Meeting Notes" />
              <SidebarItem icon={<Map className="w-4 h-4 text-[#a5a4a2]" />} label="Project Roadmap" />
              <SidebarItem icon={<Target className="w-4 h-4 text-[#a5a4a2]" />} label="OKRs" />
              <SidebarItem icon={<CheckSquare className="w-4 h-4 text-green-500" />} label="Todo List" active />
            </SidebarGroup>
          </div>

          {/* Private Section */}
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

        {/* Bottom Actions */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Top Navbar */}
        <header className="h-12 px-3 flex items-center justify-between sticky top-0 bg-white z-10 w-full shrink-0">
          <div className="flex items-center gap-1 text-sm text-[#787774] overflow-hidden">
            <button className="p-1 hover:bg-[#efefed] rounded transition-colors"><ArrowRight className="w-4 h-4 rotate-180" /></button>
            <button className="p-1 hover:bg-[#efefed] rounded transition-colors"><ArrowRight className="w-4 h-4" /></button>
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
            <button className="px-2 py-1 hover:bg-[#efefed] rounded transition-colors text-[#37352f]">Share</button>
            <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><MessageSquare className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><Clock className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><Star className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-[1240px] mx-auto px-12 md:px-24 py-12 pb-32">
            
            {/* Title Section */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-xl flex items-center justify-center text-white mb-6 relative group">
                <CheckSquare className="w-12 h-12 stroke-[3px] text-white absolute" />
              </div>
              <h1 className="text-5xl font-bold text-[#37352f] tracking-tight mb-8">Todo List</h1>
            </div>

            {/* View Tabs & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#ececeb] pb-2 mb-4 gap-4">
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 font-semibold text-[#37352f] border-b-2 border-[#37352f] pb-2 -mb-[10px]">
                  <CheckSquare className="w-4 h-4" />
                  All Tasks
                </button>
                <button className="flex items-center gap-2 text-[#787774] hover:text-[#37352f] transition-colors pb-2 -mb-[10px]">
                  <LayoutGrid className="w-4 h-4" />
                  Board
                </button>
                <button className="flex items-center gap-2 text-[#787774] hover:text-[#37352f] transition-colors pb-2 -mb-[10px]">
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
                <button className="text-[#787774] hover:text-[#37352f] transition-colors p-1">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#787774]">
                <button className="hover:bg-[#efefed] px-2 py-1 rounded transition-colors">Filter</button>
                <button className="hover:bg-[#efefed] px-2 py-1 rounded transition-colors">Sort</button>
                <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><Zap className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><Search className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-[#efefed] rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                <div className="flex items-center bg-[#2383e2] text-white rounded font-medium shadow-sm ml-2">
                  <button className="px-3 py-1.5 hover:bg-[#1f73c7] rounded-l transition-colors">New</button>
                  <div className="w-[1px] h-4 bg-white/30" />
                  <button className="px-1.5 py-1.5 hover:bg-[#1f73c7] rounded-r transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="w-full">
              {/* Group: Today */}
              <TaskGroup title="Today">
                <TableHeader />
                {todayTasks.map(task => (
                  <TaskRow key={task.id} task={task} onUpdate={updateTask} onClick={() => setEditingTask(task)} />
                ))}
                <div className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors rounded-sm group/new border-b border-[#ececeb]">
                  <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                </div>
              </TaskGroup>

              {/* Group: This Week */}
              <div className="mt-8">
                <TaskGroup title="This Week">
                  <TableHeader />
                  {thisWeekTasks.map(task => (
                    <TaskRow key={task.id} task={task} onUpdate={updateTask} onClick={() => setEditingTask(task)} />
                  ))}
                  <div className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors rounded-sm border-b border-[#ececeb]">
                    <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                  </div>
                </TaskGroup>
              </div>

               {/* Group: Later */}
               <div className="mt-8">
                <TaskGroup title="Later">
                  <TableHeader />
                  {laterTasks.map(task => (
                    <TaskRow key={task.id} task={task} onUpdate={updateTask} onClick={() => setEditingTask(task)} />
                  ))}
                  <div className="text-[#a5a4a2] text-sm py-2 px-2 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 transition-colors border-b border-transparent">
                    <Plus className="w-4 h-4 text-[#a5a4a2]" /> New task
                  </div>
                </TaskGroup>
              </div>

              {/* Table Footer */}
              <div className="mt-4 pt-4 text-xs font-mono text-[#a5a4a2] flex items-center gap-2 pl-2 pb-12">
                <span>COUNT</span>
                <span className="font-sans font-medium text-[#37352f] text-sm">{tasks.length}</span>
              </div>

            </div>
          </div>
        </div>
      </main>
      
      {/* Edit Task Modal / Right Sidebar Panel */}
      {editingTask && (
        <TaskModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          onUpdate={updateTask} 
        />
      )}
    </div>
  );
}

// --- Subcomponents ---

function TableHeader() {
  return (
    <div className="flex items-center text-sm text-[#787774] font-medium py-2 border-b border-[#ececeb]">
      <div className="w-[300px] flex items-center gap-2 pl-2"><span className="font-mono text-xs text-[#9b9a97]">Aa</span> Task</div>
      <div className="w-[140px] flex items-center gap-2"><div className="border border-[#787774] border-dashed rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold">+</div> Status</div>
      <div className="w-[120px] flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Priority</div>
      <div className="w-[140px] flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Due</div>
      <div className="w-[160px] flex items-center gap-2"><Frame className="w-3.5 h-3.5" /> Projects</div>
      <div className="flex-1 flex justify-end pr-2 text-xs opacity-0">...</div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`px-3 md:px-4 py-[6px] cursor-pointer flex items-center gap-2 text-sm transition-colors rounded-sm mx-1 ${active ? 'bg-[#efefed] text-[#37352f] font-medium' : 'text-[#787774] hover:bg-[#efefed] hover:text-[#37352f]'}`}>
      <div className={`flex items-center justify-center w-5 h-5 ${active ? 'text-[#37352f]' : 'text-[#a5a4a2]'}`}>
        {icon}
      </div>
      <span className="flex-1 truncate">{label}</span>
    </div>
  );
}

function SidebarGroup({ title, children, defaultExpanded = true }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  
  return (
    <div>
      <div 
        className="px-3 md:px-4 py-1 hover:bg-[#efefed] cursor-pointer flex items-center gap-2 text-xs font-bold text-[#a5a4a2] transition-colors group/header"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronRight className={`w-3.5 h-3.5 transition-transform opacity-0 group-hover/header:opacity-100 ${expanded ? 'rotate-90' : ''}`} />
        <span className="-ml-1">{title}</span>
      </div>
      {expanded && (
        <div className="mt-[2px] space-y-[2px]">
          {children}
        </div>
      )}
    </div>
  );
}

function TaskGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2 font-semibold text-lg text-[#37352f] group/group-header cursor-pointer">
        <div className="p-0.5 hover:bg-[#efefed] rounded">
          <ChevronDown className="w-5 h-5 text-[#37352f]" />
        </div>
        {title}
      </div>
      <div className="pl-0">
        <div className="min-w-[900px] border-t border-[#ececeb]">
          {children}
        </div>
      </div>
    </div>
  );
}

type TaskRowProps = {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onClick: () => void;
}

function TaskRow({ task, onUpdate, onClick }: TaskRowProps) {
  const toggleChecked = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(task.id, { checked: !task.checked });
  };

  return (
    <div onClick={onClick} className="flex items-center text-sm py-2 border-b border-[#ececeb] hover:bg-[#fbfbfa] transition-colors group/row cursor-pointer">
      <div className="w-[300px] flex items-center pl-2">
        <button 
          onClick={toggleChecked}
          className={`w-4 h-4 rounded-sm flex items-center justify-center mr-3 shrink-0 ${task.checked ? 'bg-[#2383e2] text-white border-transparent' : 'border border-[#cccccc] hover:border-[#37352f]'}`}
        >
          {task.checked && <CheckSquare className="w-3.5 h-3.5 max-w-full" strokeWidth={3} />}
        </button>
        <span className={`font-medium ${task.checked ? 'text-[#37352f]' : 'text-[#37352f]'}`}>{task.name}</span>
      </div>
      
      <div className="w-[140px] flex items-center">
        <Pill color={task.status.color}>
          <StatusIcon type={task.status.type} color={task.status.color} />
          {task.status.label}
        </Pill>
      </div>
      
      <div className="w-[120px] flex items-center">
        <Pill color={task.priority.color}>{task.priority.label}</Pill>
      </div>
      
      <div className="w-[140px] flex items-center text-[#37352f]">
        {task.due}
      </div>
      
      <div className="w-[160px] flex items-center flex-wrap gap-1">
        {task.projects.map((p, i) => (
          <Pill key={i} color={p.color}>{p.label}</Pill>
        ))}
      </div>
      
      <div className="flex-1 flex justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-[#efefed] rounded text-[#787774]"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function Pill({ children, color, className }: { children: React.ReactNode, color: keyof typeof colorMap, className?: string }) {
  const styles = colorMap[color] || colorMap.gray;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[13px] whitespace-nowrap ${styles.bg} ${styles.text} ${className || ''}`}>
      {children}
    </span>
  );
}

function StatusIcon({ type, color }: { type: 'done' | 'in-progress' | 'not-started', color: keyof typeof colorMap }) {
  const c = colorMap[color].dot;
  
  if (type === 'done') {
    return <div className={`w-2.5 h-2.5 rounded-full ${c}`} />;
  }
  if (type === 'in-progress') {
    return (
      <div className="relative w-2.5 h-2.5 rounded-full border border-current overflow-hidden flex items-center justify-center">
        <div className={`absolute top-0 left-0 w-1/2 h-full bg-current opacity-30`} />
        <div className={`absolute w-1 h-1 rounded-full bg-current`} />
      </div>
    );
  }
  return <div className="w-2.5 h-2.5 rounded-full border border-current border-dashed opacity-50" />;
}

// --- Editing Modal ---

function TaskModal({ task, onClose, onUpdate }: { task: Task, onClose: () => void, onUpdate: (id: string, updates: Partial<Task>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-[600px] min-h-[500px] max-h-[90vh] rounded-xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#ececeb]">
          <div className="flex items-center gap-2 text-[#787774] text-sm">
            <CheckSquare className="w-4 h-4" />
            <span>Task Detail</span>
          </div>
          <button className="p-1 hover:bg-[#efefed] rounded text-[#787774] transition-colors" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* Header Name Input */}
          <input 
            type="text" 
            value={task.name} 
            onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            className="text-4xl font-bold text-[#37352f] tracking-tight mb-8 w-full border-none outline-none bg-transparent placeholder-[#cccccc]"
            placeholder="Untitled Task"
          />

          <div className="space-y-4 max-w-sm">
            {/* Action Item: Status */}
            <div className="flex items-center min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Status
              </div>
              <div className="flex-1">
                <select 
                  className="bg-transparent text-sm text-[#37352f] outline-none hover:bg-[#efefed] px-2 py-1 -ml-2 rounded cursor-pointer appearance-none w-full"
                  value={task.status.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    let type: 'done' | 'in-progress' | 'not-started' = 'not-started';
                    let color: keyof typeof colorMap = 'gray';
                    if (label === 'Done') { type = 'done'; color = 'green'; }
                    if (label === 'In progress') { type = 'in-progress'; color = 'blue'; }
                    if (label === 'Not started') { type = 'not-started'; color = 'gray'; }
                    
                    onUpdate(task.id, { status: { label, type, color } });
                  }}
                >
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            {/* Action Item: Priority */}
            <div className="flex items-center min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Priority
              </div>
              <div className="flex-1">
                <select 
                  className="bg-transparent text-sm text-[#37352f] outline-none hover:bg-[#efefed] px-2 py-1 -ml-2 rounded cursor-pointer appearance-none w-full"
                  value={task.priority.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    let color: keyof typeof colorMap = 'gray';
                    if (label === 'Low') color = 'green';
                    if (label === 'Medium') color = 'yellow';
                    if (label === 'High') color = 'red';
                    
                    onUpdate(task.id, { priority: { label, color } });
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Action Item: Due Date */}
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
            
            {/* Action Item: Projects */}
            <div className="flex items-center min-h-[34px]">
              <div className="w-[120px] text-sm text-[#787774] flex items-center gap-2">
                <Frame className="w-4 h-4" />
                Projects
              </div>
              <div className="flex-1 flex flex-wrap gap-1 items-center">
                {task.projects.map((p, idx) => (
                   <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[13px] whitespace-nowrap bg-[#efefed] text-[#37352f]">
                     {p.label}
                   </span>
                ))}
                <input 
                  type="text" 
                  defaultValue=""
                  placeholder="Add new..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const newLabel = e.currentTarget.value;
                      onUpdate(task.id, {
                        projects: [...task.projects, { label: newLabel, color: 'gray' }]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                  className="text-sm bg-transparent outline-none flex-1 min-w-[80px] p-1 placeholder-[#cccccc]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-[#ececeb] pt-8">
            <p className="text-[#a5a4a2] text-sm italic">Click below or start typing to add notes...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
