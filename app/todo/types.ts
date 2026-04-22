export const colorMap = {
  green: { bg: 'bg-[#e3f2e8]', text: 'text-[#1e8e3e]', dot: 'bg-green-500' },
  blue: { bg: 'bg-[#e2f1fb]', text: 'text-[#187abf]', dot: 'bg-blue-500' },
  red: { bg: 'bg-[#fbebeae6]', text: 'text-[#c63426]', dot: 'bg-red-500' },
  yellow: { bg: 'bg-[#fcede3]', text: 'text-[#d67b2d]', dot: 'bg-yellow-500' },
  gray: { bg: 'bg-[#f1f1ef]', text: 'text-[#787774]', dot: 'bg-gray-400' },
  purple: { bg: 'bg-[#f3eef9]', text: 'text-[#8b4ca8]', dot: 'bg-purple-500' },
  orange: { bg: 'bg-[#faebe0]', text: 'text-[#c66e2c]', dot: 'bg-orange-500' },
} as const;

export type ColorKey = keyof typeof colorMap;

export type StatusOption = {
  id: string;
  label: string;
  color: ColorKey;
  type: 'done' | 'in-progress' | 'not-started';
};

export type PriorityOption = {
  id: string;
  label: string;
  color: ColorKey;
};

export type ProjectOption = {
  id: string;
  label: string;
  color: ColorKey;
};

export type TodoAppUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

export type Task = {
  id: string;
  name: string;
  checked: boolean;
  statusId: string;
  priorityId: string;
  projectIds: string[];
  due: string;
  group: 'Today' | 'This Week' | 'Later';
  sortIndex: number;
  description: string;
};

export const initialStatusOptions: StatusOption[] = [
  { id: 's-not-started', label: 'Not started', color: 'gray', type: 'not-started' },
  { id: 's-in-progress', label: 'In progress', color: 'blue', type: 'in-progress' },
  { id: 's-done', label: 'Done', color: 'green', type: 'done' },
];

export const initialPriorityOptions: PriorityOption[] = [
  { id: 'p-low', label: 'Low', color: 'green' },
  { id: 'p-medium', label: 'Medium', color: 'yellow' },
  { id: 'p-high', label: 'High', color: 'red' },
];

export const initialProjectOptions: ProjectOption[] = [
  { id: 'pr-work', label: 'Work', color: 'blue' },
  { id: 'pr-content', label: 'Content', color: 'purple' },
  { id: 'pr-personal', label: 'Personal', color: 'orange' },
  { id: 'pr-design', label: 'Design', color: 'purple' },
];

export const initialTasks: Task[] = [
  { id: '1', name: 'Reply to emails', checked: false, statusId: 's-done', priorityId: 'p-medium', due: 'May 24, 2024', projectIds: ['pr-work'], group: 'Today', sortIndex: 0, description: '' },
  { id: '2', name: 'Review PR #42', checked: true, statusId: 's-done', priorityId: 'p-high', due: 'May 24, 2024', projectIds: ['pr-work'], group: 'Today', sortIndex: 1, description: '' },
  { id: '3', name: 'Update dashboard', checked: false, statusId: 's-in-progress', priorityId: 'p-high', due: 'May 24, 2024', projectIds: ['pr-work'], group: 'Today', sortIndex: 2, description: '' },
  { id: '4', name: 'Write blog post', checked: false, statusId: 's-not-started', priorityId: 'p-medium', due: 'May 26, 2024', projectIds: ['pr-content'], group: 'This Week', sortIndex: 0, description: '' },
  { id: '5', name: 'Prepare for client call', checked: false, statusId: 's-not-started', priorityId: 'p-high', due: 'May 28, 2024', projectIds: ['pr-work'], group: 'This Week', sortIndex: 1, description: '' },
  { id: '6', name: 'Redesign landing page', checked: false, statusId: 's-in-progress', priorityId: 'p-medium', due: 'May 30, 2024', projectIds: ['pr-design'], group: 'This Week', sortIndex: 2, description: '' },
  { id: '7', name: 'Book flight tickets', checked: false, statusId: 's-not-started', priorityId: 'p-low', due: 'June 5, 2024', projectIds: ['pr-personal'], group: 'Later', sortIndex: 0, description: '' },
  { id: '8', name: 'Learn Next.js', checked: false, statusId: 's-not-started', priorityId: 'p-low', due: 'June 10, 2024', projectIds: ['pr-personal'], group: 'Later', sortIndex: 1, description: '' },
  { id: '9', name: 'Plan summer trip', checked: false, statusId: 's-not-started', priorityId: 'p-medium', due: 'June 15, 2024', projectIds: ['pr-personal'], group: 'Later', sortIndex: 2, description: '' },
];

const newId = (prefix: string) =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}`;

export function createDraftTask(
  group: Task['group'],
  defaultStatusId: string,
  defaultPriorityId: string
): Task {
  return {
    id: newId('task'),
    name: '',
    checked: false,
    statusId: defaultStatusId,
    priorityId: defaultPriorityId,
    due: '',
    projectIds: [],
    group,
    sortIndex: 0,
    description: '',
  };
}

export function newStatusOption(label: string): StatusOption {
  return {
    id: newId('s'),
    label,
    color: 'gray',
    type: 'not-started',
  };
}

export function newPriorityOption(label: string): PriorityOption {
  return {
    id: newId('p'),
    label,
    color: 'gray',
  };
}

export function newProjectOption(label: string): ProjectOption {
  return {
    id: newId('pr'),
    label,
    color: 'gray',
  };
}

export function getStatusById(options: StatusOption[], id: string): StatusOption | null {
  return options.find((o) => o.id === id) ?? null;
}

export function getPriorityById(options: PriorityOption[], id: string): PriorityOption | null {
  return options.find((o) => o.id === id) ?? null;
}

export function getProjectsByIds(options: ProjectOption[], ids: string[]): ProjectOption[] {
  return ids
    .map((id) => options.find((o) => o.id === id))
    .filter((x): x is ProjectOption => x != null);
}

export type OpenCell = string | null;

export function makeCellKey(taskId: string, field: 'status' | 'priority' | 'projects'): string {
  return `${taskId}:${field}`;
}

export function parseCellKey(key: string): { taskId: string; field: 'status' | 'priority' | 'projects' } | null {
  const [taskId, field] = key.split(':') as [string, 'status' | 'priority' | 'projects'];
  if (!taskId || (field !== 'status' && field !== 'priority' && field !== 'projects')) return null;
  return { taskId, field };
}
