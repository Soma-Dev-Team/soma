'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SomaMark, GraphiteRing } from '@/components/soma-mark';
import { UserBadge } from '@/components/user-badge';

export default function Home() {
  return <Marketing />;
}

function Marketing() {
  const t = useTranslations('marketing');
  const reduce = useReducedMotion();

  // Parallax: scroll the page, the hero ring drifts upward at half speed and
  // softly rotates. Disabled under reduced-motion.
  const { scrollY } = useScroll();
  const ringY = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, -80]);
  const ringRotate = useTransform(scrollY, [0, 1200], reduce ? [0, 0] : [0, 18]);
  const ringScale = useTransform(scrollY, [0, 600], reduce ? [1, 1] : [1, 0.92]);

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
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated chromatic backdrop — slow drifting blobs in macro colors */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--macro-protein) 0%, transparent 65%)',
              filter: 'blur(70px)',
              opacity: 0.25,
            }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-15%] right-[-15%] h-[680px] w-[680px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--macro-fiber) 0%, transparent 65%)',
              filter: 'blur(80px)',
              opacity: 0.22,
            }}
            animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          />
          <motion.div
            className="absolute top-[40%] right-[10%] h-[520px] w-[520px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--macro-fat) 0%, transparent 65%)',
              filter: 'blur(80px)',
              opacity: 0.18,
            }}
            animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
          />
        </div>
      )}

      <div className="relative z-10">
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
            <UserBadge />
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
              style={{ y: ringY, rotate: ringRotate, scale: ringScale }}
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
    </div>
  );
}

function Feature({ title, body, variants }: { title: string; body: string; variants: Variants }) {
  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-lg border border-border p-6 bg-surface/85 backdrop-blur transition-shadow duration-200 hover:shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.18)]"
    >
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
    </motion.article>
  );
}
