'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserBadge() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.user?.email) setUser(data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const initial = (user?.name ?? user?.email ?? '?').trim().charAt(0).toUpperCase();
  const tooltip = user?.name ?? user?.email ?? '';

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/app/settings"
            title={tooltip}
            aria-label={`Signed in as ${tooltip}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-surface text-foreground text-xs font-semibold tracking-tight hover:ring-2 hover:ring-ring overflow-hidden"
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initial}</span>
            )}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
