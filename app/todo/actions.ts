'use server';

import { and, eq, inArray, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  priorityOptions,
  projectOptions,
  statusOptions,
  taskProjects,
  tasks,
} from '@/lib/db/schema';
import { newPriorityOption, newProjectOption, newStatusOption, type Task } from '@/app/todo/types';

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

async function assertStatusOwned(userId: string, id: string) {
  const r = await db
    .select({ id: statusOptions.id })
    .from(statusOptions)
    .where(and(eq(statusOptions.id, id), eq(statusOptions.userId, userId)))
    .limit(1);
  if (!r[0]) throw new Error('Invalid status');
}

async function assertPriorityOwned(userId: string, id: string) {
  const r = await db
    .select({ id: priorityOptions.id })
    .from(priorityOptions)
    .where(and(eq(priorityOptions.id, id), eq(priorityOptions.userId, userId)))
    .limit(1);
  if (!r[0]) throw new Error('Invalid priority');
}

async function assertProjectsOwned(userId: string, ids: string[]) {
  for (const id of ids) {
    const r = await db
      .select({ id: projectOptions.id })
      .from(projectOptions)
      .where(and(eq(projectOptions.id, id), eq(projectOptions.userId, userId)))
      .limit(1);
    if (!r[0]) throw new Error('Invalid project');
  }
}

async function nextSortIndexForGroup(userId: string, group: Task['group']): Promise<number> {
  const r = await db
    .select({ m: max(tasks.sortIndex) })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.taskGroup, group)));
  const maxIdx = r[0]?.m;
  return (maxIdx == null ? -1 : maxIdx) + 1;
}

export async function updateTaskAction(id: string, updates: Partial<Task>): Promise<void> {
  const userId = await requireUserId();
  const row = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  if (!row[0]) throw new Error('Task not found');

  const { projectIds, ...rest } = updates;
  if (rest.statusId !== undefined) await assertStatusOwned(userId, rest.statusId);
  if (rest.priorityId !== undefined) await assertPriorityOwned(userId, rest.priorityId);
  if (projectIds !== undefined) await assertProjectsOwned(userId, projectIds);
  const patch: Partial<typeof tasks.$inferInsert> = {};
  if (rest.name !== undefined) patch.name = rest.name;
  if (rest.checked !== undefined) patch.checked = rest.checked;
  if (rest.statusId !== undefined) patch.statusId = rest.statusId;
  if (rest.priorityId !== undefined) patch.priorityId = rest.priorityId;
  if (rest.due !== undefined) patch.due = rest.due;
  if (rest.description !== undefined) patch.description = rest.description;
  if (rest.sortIndex !== undefined) patch.sortIndex = rest.sortIndex;
  if (rest.group !== undefined) {
    patch.taskGroup = rest.group;
    if (row[0].taskGroup !== rest.group) {
      patch.sortIndex = await nextSortIndexForGroup(userId, rest.group);
    }
  }

  if (Object.keys(patch).length > 0) {
    await db.update(tasks).set(patch).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }

  if (projectIds !== undefined) {
    await db.delete(taskProjects).where(eq(taskProjects.taskId, id));
    for (const pid of projectIds) {
      await db.insert(taskProjects).values({ taskId: id, projectId: pid });
    }
  }

  revalidatePath('/');
}

export async function createTaskAction(task: Task): Promise<void> {
  const userId = await requireUserId();
  await assertStatusOwned(userId, task.statusId);
  await assertPriorityOwned(userId, task.priorityId);
  await assertProjectsOwned(userId, task.projectIds);
  const sortIndex = await nextSortIndexForGroup(userId, task.group);
  await db.insert(tasks).values({
    id: task.id,
    userId,
    name: task.name || 'Untitled',
    checked: task.checked,
    statusId: task.statusId,
    priorityId: task.priorityId,
    due: task.due,
    taskGroup: task.group,
    sortIndex,
    description: task.description ?? '',
  });
  for (const pid of task.projectIds) {
    await db.insert(taskProjects).values({ taskId: task.id, projectId: pid });
  }
  revalidatePath('/');
}

export async function reorderTasksAction(
  updates: { id: string; group: Task['group']; sortIndex: number }[]
): Promise<void> {
  const userId = await requireUserId();
  if (updates.length === 0) return;
  const ids = [...new Set(updates.map((u) => u.id))];
  const owned = await db
    .select({ id: tasks.id })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), inArray(tasks.id, ids)));
  if (owned.length !== ids.length) throw new Error('Invalid task');

  await db.transaction(async (tx) => {
    for (const u of updates) {
      await tx
        .update(tasks)
        .set({ taskGroup: u.group, sortIndex: u.sortIndex })
        .where(and(eq(tasks.id, u.id), eq(tasks.userId, userId)));
    }
  });
  revalidatePath('/');
}

export async function deleteTaskAction(id: string): Promise<void> {
  const userId = await requireUserId();
  const removed = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });
  if (!removed[0]) throw new Error('Task not found');
  revalidatePath('/');
}

export async function addStatusOptionAction(label: string): Promise<string> {
  const userId = await requireUserId();
  const o = newStatusOption(label);
  await db.insert(statusOptions).values({
    id: o.id,
    userId,
    label: o.label,
    color: o.color,
    statusType: o.type,
  });
  revalidatePath('/');
  return o.id;
}

export async function addPriorityOptionAction(label: string): Promise<string> {
  const userId = await requireUserId();
  const o = newPriorityOption(label);
  await db.insert(priorityOptions).values({
    id: o.id,
    userId,
    label: o.label,
    color: o.color,
  });
  revalidatePath('/');
  return o.id;
}

export async function addProjectOptionAction(label: string): Promise<string> {
  const userId = await requireUserId();
  const o = newProjectOption(label);
  await db.insert(projectOptions).values({
    id: o.id,
    userId,
    label: o.label,
    color: o.color,
  });
  revalidatePath('/');
  return o.id;
}
