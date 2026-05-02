'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SomaMark, GraphiteRing } from '@/components/soma-mark';

export default function Home() {
  return <Marketing />;
}

function Marketing() {
  const t = useTranslations('marketing');
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl flex items-center justify-between px-6 py-6"
      >
        <Link href="/" aria-label="Soma">
          <SomaMark size={28} />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" variant="secondary">
              Sign in
            </Button>
          </Link>
        </div>
      </motion.header>

      <main className="mx-auto max-w-5xl px-6">
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="py-24 md:py-32 grid md:grid-cols-[1fr_auto] items-center gap-12"
        >
          <div>
            <motion.p variants={fadeUp} className="label-mono text-muted-foreground mb-5">
              σῶμα · open source · agpl-3.0
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl wordmark max-w-xl text-balance"
              style={{ lineHeight: 1.05 }}
            >
              {t('headline')}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
              {t('sub')}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-3">
              <Link href="/app">
                <Button size="lg">{t('cta_primary')}</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="secondary">
                  {t('cta_secondary')}
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            variants={fadeUp}
            className="hidden md:block animate-breathe"
            aria-hidden="true"
          >
            <GraphiteRing size={300} pct={0.75} weight="regular" />
          </motion.div>
        </motion.section>

        <div className="border-y border-border py-5 flex flex-wrap items-center justify-between gap-4 label-mono text-muted-foreground">
          <span>RD9 · GRAPHITE DUOTONE</span>
          <span>σῶμα · BODY</span>
          <span>RING 75% · REGULAR</span>
        </div>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-20"
        >
          <Feature variants={fadeUp} title={t('features.privacy_title')} body={t('features.privacy_body')} />
          <Feature variants={fadeUp} title={t('features.open_title')} body={t('features.open_body')} />
          <Feature variants={fadeUp} title={t('features.local_title')} body={t('features.local_body')} />
          <Feature variants={fadeUp} title={t('features.barcode_title')} body={t('features.barcode_body')} />
          <Feature variants={fadeUp} title={t('features.byok_title')} body={t('features.byok_body')} />
          <Feature variants={fadeUp} title={t('features.sync_title')} body={t('features.sync_body')} />
        </motion.section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 label-mono text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <div>© SOMA · FREE FOREVER</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            {process.env.NEXT_PUBLIC_GITHUB_URL && (
              <a href={process.env.NEXT_PUBLIC_GITHUB_URL} className="hover:text-foreground">
                GitHub
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body, variants }: { title: string; body: string; variants: Variants }) {
  return (
    <motion.article
      variants={variants}
      className="rounded-lg border border-border p-6 bg-surface transition-colors duration-200 hover:bg-muted/10"
    >
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
    </motion.article>
  );
}
