'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { CheckSquare } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const res = await authClient.signIn.email({ email, password });
    if (res.error) {
      setErr(res.error.message ?? 'Sign in failed');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] text-[#37352f] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#ececeb] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold">Sign in</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div>
            <label className="block text-sm text-[#787774] mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ececeb] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2383e2]/50"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-[#787774] mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#ececeb] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2383e2]/50"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-[#2383e2] text-white text-sm font-medium hover:bg-[#1f73c7] transition-colors"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-[#787774]">
          No account?{' '}
          <Link href="/sign-up" className="text-[#2383e2] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
