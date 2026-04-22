import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  priorityOptions,
  projectOptions,
  statusOptions,
  taskProjects,
  tasks,
} from '@/lib/db/schema';
import {
  initialPriorityOptions,
  initialProjectOptions,
  initialStatusOptions,
  type PriorityOption,
  type ProjectOption,
  type StatusOption,
  type Task,
} from '@/app/todo/types';

export type TodoDataPayload = {
  tasks: Task[];
  statusOptions: StatusOption[];
  priorityOptions: PriorityOption[];
  projectOptions: ProjectOption[];
  defaultStatusId: string;
  defaultPriorityId: string;
};

export async function ensureDefaultTodoCatalog(userId: string): Promise<void> {
  const existing = await db
    .select({ id: statusOptions.id })
    .from(statusOptions)
    .where(eq(statusOptions.userId, userId))
    .limit(1);
  if (existing.length > 0) return;

  for (const s of initialStatusOptions) {
    await db.insert(statusOptions).values({
      id: crypto.randomUUID(),
      userId,
      label: s.label,
      color: s.color,
      statusType: s.type,
    });
  }
  for (const p of initialPriorityOptions) {
    await db.insert(priorityOptions).values({
      id: crypto.randomUUID(),
      userId,
      label: p.label,
      color: p.color,
    });
  }
  for (const pr of initialProjectOptions) {
    await db.insert(projectOptions).values({
      id: crypto.randomUUID(),
      userId,
      label: pr.label,
      color: pr.color,
    });
  }

  const st = await db
    .select()
    .from(statusOptions)
    .where(eq(statusOptions.userId, userId));
  const pr = await db
    .select()
    .from(priorityOptions)
    .where(eq(priorityOptions.userId, userId));
  const pj = await db
    .select()
    .from(projectOptions)
    .where(eq(projectOptions.userId, userId));

  const doneId = st.find((x) => x.label === 'Done')?.id;
  const notStartedId = st.find((x) => x.label === 'Not started')?.id;
  const inProgressId = st.find((x) => x.label === 'In progress')?.id;
  const medId = pr.find((x) => x.label === 'Medium')?.id;
  const highId = pr.find((x) => x.label === 'High')?.id;
  const workId = pj.find((x) => x.label === 'Work')?.id;
  const contentId = pj.find((x) => x.label === 'Content')?.id;

  if (!notStartedId || !medId || !highId || !doneId || !inProgressId || !workId || !contentId) return;

  const rows: { task: typeof tasks.$inferInsert; projectIds: string[] }[] = [
    {
      task: {
        id: crypto.randomUUID(),
        userId,
        name: 'Reply to emails',
        checked: false,
        statusId: doneId,
        priorityId: medId,
        due: 'May 24, 2024',
        taskGroup: 'Today',
        sortIndex: 0,
        description: '',
      },
      projectIds: [workId],
    },
    {
      task: {
        id: crypto.randomUUID(),
        userId,
        name: 'Review PR #42',
        checked: true,
        statusId: doneId,
        priorityId: highId,
        due: 'May 24, 2024',
        taskGroup: 'Today',
        sortIndex: 1,
        description: '',
      },
      projectIds: [workId],
    },
    {
      task: {
        id: crypto.randomUUID(),
        userId,
        name: 'Write blog post',
        checked: false,
        statusId: notStartedId,
        priorityId: medId,
        due: 'May 26, 2024',
        taskGroup: 'This Week',
        sortIndex: 0,
        description: '',
      },
      projectIds: [contentId],
    },
  ];

  for (const { task, projectIds } of rows) {
    await db.insert(tasks).values(task);
    for (const pid of projectIds) {
      await db.insert(taskProjects).values({ taskId: task.id, projectId: pid });
    }
  }
}

export async function loadTodoDataForUser(userId: string): Promise<TodoDataPayload> {
  await ensureDefaultTodoCatalog(userId);

  const st = await db.select().from(statusOptions).where(eq(statusOptions.userId, userId));
  const pr = await db.select().from(priorityOptions).where(eq(priorityOptions.userId, userId));
  const pj = await db.select().from(projectOptions).where(eq(projectOptions.userId, userId));
  const tk = await db.select().from(tasks).where(eq(tasks.userId, userId));

  const taskIds = tk.map((t) => t.id);
  let links: { taskId: string; projectId: string }[] = [];
  if (taskIds.length > 0) {
    links = await db
      .select()
      .from(taskProjects)
      .where(inArray(taskProjects.taskId, taskIds));
  }

  const projByTask = new Map<string, string[]>();
  for (const l of links) {
    const arr = projByTask.get(l.taskId) ?? [];
    arr.push(l.projectId);
    projByTask.set(l.taskId, arr);
  }

  const statusOptionsOut: StatusOption[] = st.map((r) => ({
    id: r.id,
    label: r.label,
    color: r.color as StatusOption['color'],
    type: r.statusType as StatusOption['type'],
  }));
  const priorityOptionsOut: PriorityOption[] = pr.map((r) => ({
    id: r.id,
    label: r.label,
    color: r.color as PriorityOption['color'],
  }));
  const projectOptionsOut: ProjectOption[] = pj.map((r) => ({
    id: r.id,
    label: r.label,
    color: r.color as ProjectOption['color'],
  }));

  const groupRank: Record<Task['group'], number> = { Today: 0, 'This Week': 1, Later: 2 };
  const tasksOut: Task[] = tk
    .map((row) => ({
      id: row.id,
      name: row.name,
      checked: row.checked,
      statusId: row.statusId,
      priorityId: row.priorityId,
      due: row.due,
      group: row.taskGroup as Task['group'],
      projectIds: projByTask.get(row.id) ?? [],
      sortIndex: row.sortIndex,
      description: row.description,
    }))
    .sort(
      (a, b) =>
        groupRank[a.group] - groupRank[b.group] ||
        a.sortIndex - b.sortIndex ||
        a.id.localeCompare(b.id)
    );

  const defaultStatusId =
    st.find((x) => x.label === 'Not started')?.id ?? st[0]?.id ?? '';
  const defaultPriorityId =
    pr.find((x) => x.label === 'Medium')?.id ?? pr[0]?.id ?? '';

  return {
    tasks: tasksOut,
    statusOptions: statusOptionsOut,
    priorityOptions: priorityOptionsOut,
    projectOptions: projectOptionsOut,
    defaultStatusId,
    defaultPriorityId,
  };
}
