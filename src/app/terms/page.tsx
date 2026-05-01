import Link from 'next/link';

export const metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 space-y-4 text-foreground/90 leading-relaxed">
      <p className="label-mono text-muted-foreground">
        <Link href="/">← BACK</Link>
      </p>
      <h1 className="text-4xl wordmark">terms</h1>
      <p>This is a placeholder terms of service. Replace before launch.</p>
      <p>
        Soma is provided as-is, without warranty. Soma is not medical advice. Consult a qualified
        professional before making changes to your diet or exercise routine. Use at your own risk.
      </p>
    </div>
  );
}
