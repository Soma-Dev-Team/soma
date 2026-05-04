import { AppNav } from '@/components/app-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { SomaMark } from '@/components/soma-mark';
import { UserBadge } from '@/components/user-badge';
import { AmbientParticles } from '@/components/ambient-particles';
import { ProfileSync } from '@/components/profile-sync';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex relative">
      <AmbientParticles />
      <ProfileSync />
      {/* Bottom vignette — soft fade so the bottom nav reads cleanly on busy
          backgrounds. Pointer events off so it never blocks input. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-24 md:hidden"
        style={{
          background:
            'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
      <AppNav />
      <div
        className="flex-1 min-w-0 md:pb-0 relative z-10"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border">
          <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between">
            <Link href="/app" aria-label="Soma">
              <SomaMark size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserBadge />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
