import { AppNav } from '@/components/app-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { SyncBootstrap } from '@/components/sync-bootstrap';
import { SomaMark } from '@/components/soma-mark';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <AppNav />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border">
          <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between">
            <Link href="/app" aria-label="Soma">
              <SomaMark size={24} />
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-6">{children}</main>
      </div>
      <SyncBootstrap />
    </div>
  );
}
