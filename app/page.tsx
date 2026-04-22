import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loadTodoDataForUser } from './todo/data';
import { TodoApp } from './todo/TodoApp';

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/sign-in');
  }
  const data = await loadTodoDataForUser(session.user.id);
  return (
    <TodoApp
      initialData={data}
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    />
  );
}
