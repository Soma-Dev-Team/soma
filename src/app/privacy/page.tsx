import Link from 'next/link';

export const metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 space-y-4 text-foreground/90 leading-relaxed">
      <p className="label-mono text-muted-foreground">
        <Link href="/">← BACK</Link>
      </p>
      <h1 className="text-4xl wordmark">privacy</h1>
      <p>This is a placeholder privacy policy. Replace before launch.</p>
      <h2 className="text-lg font-semibold mt-6">What we store</h2>
      <p>Your nutrition logs, weight, and profile are stored locally in your browser (IndexedDB).</p>
      <p>If you sign in, the same data syncs to Supabase (EU region) under your account.</p>
      <h2 className="text-lg font-semibold mt-6">Photos</h2>
      <p>
        Photos used for AI scanning are sent to Google Gemini using your own API key. They are not
        written to disk or to Soma's storage. The user is the data controller for any data sent via the
        Gemini API.
      </p>
      <h2 className="text-lg font-semibold mt-6">Your rights</h2>
      <p>You can export everything as JSON or delete your account from Settings → Your data.</p>
    </div>
  );
}
