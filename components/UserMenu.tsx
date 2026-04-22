'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogIn } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import type { TodoAppUser } from '@/app/todo/types';

type Props = { user?: TodoAppUser | null };

function initials(u: { name?: string | null; email: string }) {
  if (u.name?.trim()) {
    return u.name
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return u.email.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center gap-1.5 px-2 py-1 text-sm text-[#2383e2] font-medium rounded hover:bg-[#efefed]"
      >
        <LogIn className="w-4 h-4" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 pl-0.5 pr-2 py-1 rounded-md hover:bg-[#efefed] text-[#37352f] text-sm"
        title="Account"
      >
        <span className="w-7 h-7 rounded-full bg-[#2383e2] text-white text-xs font-medium flex items-center justify-center">
          {initials(user)}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#787774]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-[#ececeb] bg-white py-1 shadow-lg z-50 text-left">
          <div className="px-3 py-2 text-xs text-[#787774] border-b border-[#ececeb] truncate">{user.email}</div>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm text-[#37352f] hover:bg-[#efefed]"
            onClick={async () => {
              await authClient.signOut();
              setOpen(false);
              router.push('/sign-in');
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
