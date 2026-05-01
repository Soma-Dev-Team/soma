import Link from 'next/link';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 space-y-4">
      <p className="label-mono text-muted-foreground">
        <Link href="/">← BACK</Link>
      </p>
      <h1 className="text-4xl wordmark mt-4">about</h1>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Soma is a free, open-source nutrition tracker built around three convictions:
      </p>
      <ol className="mt-4 space-y-3 text-foreground/90 leading-relaxed list-decimal list-inside">
        <li>Your photos shouldn't live in someone else's data lake.</li>
        <li>You shouldn't pay a subscription to look up a calorie count.</li>
        <li>Privacy claims are worthless if you can't audit them.</li>
      </ol>
      <p className="mt-6 leading-relaxed">
        That's why Soma uses Bring-Your-Own-Key for AI scans (the photo goes to Gemini once and is then
        discarded), works fully offline at the gym via local-first storage, and ships under AGPL-3.0 so
        anyone can audit and contribute.
      </p>
      <h2 className="text-xl font-semibold mt-10">License</h2>
      <p className="leading-relaxed">
        AGPL-3.0. Source on GitHub. Translations and bug reports welcome.
      </p>
    </div>
  );
}
