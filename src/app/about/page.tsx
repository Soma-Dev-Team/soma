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
        Soma is a modern calorie and macro tracker. The point is to spend less time inside the app:
        snap a meal, scan a barcode, log a weight, and get on with your day.
      </p>
      <p className="leading-relaxed">
        Track calories and the four macros that matter — protein, carbs, fat, fiber. Each gets its
        own ring, so the day is legible at a glance. Six themes, lots of polish, and an AI photo
        scan when you don't feel like typing.
      </p>
      <h2 className="text-xl font-semibold mt-10">What's in</h2>
      <ul className="space-y-2 list-disc list-inside marker:text-muted-foreground">
        <li>AI photo scan with editable results</li>
        <li>Barcode scanner backed by Open Food Facts and USDA</li>
        <li>Weight tracking + macro charts</li>
        <li>Strava, Withings, and Garmin connections</li>
        <li>Six themes (light · sand · dark · midnight · deep · slate)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-10">License</h2>
      <p className="leading-relaxed">
        AGPL-3.0. Source on GitHub. Translations and bug reports welcome.
      </p>
    </div>
  );
}
