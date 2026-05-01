import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SomaMark, GraphiteRing } from '@/components/soma-mark';

export default function Home() {
  return <Marketing />;
}

function Marketing() {
  const t = useTranslations('marketing');
  return (
    <div className="min-h-screen bg-paper dark:bg-graphite">
      <header className="mx-auto max-w-5xl flex items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Soma">
          <SomaMark size={28} />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" variant="secondary">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="py-24 md:py-32 grid md:grid-cols-[1fr_auto] items-center gap-12">
          <div>
            <p className="label-mono text-muted-foreground mb-5">
              σῶμα · open source · agpl-3.0
            </p>
            <h1 className="text-4xl md:text-6xl wordmark tracking-tight max-w-2xl">
              {t('headline')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t('sub')}
            </p>
            <div className="mt-10 flex items-center gap-3">
              <Link href="/app">
                <Button size="lg">{t('cta_primary')}</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="secondary">
                  {t('cta_secondary')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <GraphiteRing size={280} pct={0.75} weight="regular" />
          </div>
        </section>

        <div className="border-y border-border py-5 flex flex-wrap items-center justify-between gap-4 label-mono text-muted-foreground">
          <span>RD9 · GRAPHITE DUOTONE</span>
          <span>σῶμα · BODY</span>
          <span>RING 75% · REGULAR</span>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-20">
          <Feature title={t('features.privacy_title')} body={t('features.privacy_body')} />
          <Feature title={t('features.open_title')} body={t('features.open_body')} />
          <Feature title={t('features.local_title')} body={t('features.local_body')} />
          <Feature title={t('features.barcode_title')} body={t('features.barcode_body')} />
          <Feature title={t('features.byok_title')} body={t('features.byok_body')} />
          <Feature title={t('features.sync_title')} body={t('features.sync_body')} />
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 label-mono text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <div>© SOMA · FREE FOREVER</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <a href="https://github.com" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border p-6 bg-surface">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
