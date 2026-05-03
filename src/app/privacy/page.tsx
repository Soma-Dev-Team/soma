import Link from 'next/link';

export const metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 space-y-4 text-foreground/90 leading-relaxed">
      <p className="label-mono text-muted-foreground">
        <Link href="/">← BACK</Link>
      </p>
      <h1 className="text-4xl wordmark">privacy</h1>

      <p>
        Soma is built local-first. The short version: there's no Soma account, no Soma server that
        stores your data, and no analytics that follow you between visits. The longer version is
        below.
      </p>

      <h2 className="text-lg font-semibold mt-8">What stays on your device</h2>
      <p>
        Your profile, weight log, food log, custom foods, barcode cache, and theme choice all live
        in your browser via IndexedDB. They never leave the device unless you explicitly sign in
        (to back them up to your account) or use Settings → Export JSON.
      </p>

      <h2 className="text-lg font-semibold mt-8">What gets sent over the network</h2>
      <ul className="space-y-2 list-disc list-inside marker:text-muted-foreground">
        <li>
          <strong>Open Food Facts &amp; USDA FoodData Central:</strong> when you search for a food
          or scan a barcode, we send the search term or the barcode number to those public APIs to
          look it up. Nothing else is attached.
        </li>
        <li>
          <strong>AI photo scan (OpenRouter):</strong> the image you choose is forwarded once
          through Soma's server to OpenRouter for analysis, then released. We do not write the
          image to disk and do not retain it after the response. OpenRouter's terms apply to the
          analysis itself.
        </li>
        <li>
          <strong>Sign-in (optional):</strong> if you sign in with Google or via magic link, your
          email and (for Google) name and avatar are stored in our database so we can recognize you
          on return visits. You can delete the account anytime.
        </li>
        <li>
          <strong>Strava / Garmin / Withings:</strong> only if you connect them in Settings. The
          OAuth tokens are stored in your browser via IndexedDB.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mt-8">What we don't do</h2>
      <ul className="space-y-2 list-disc list-inside marker:text-muted-foreground">
        <li>No Soma account, so nothing tied to an email or identity.</li>
        <li>No food photos persisted anywhere by Soma.</li>
        <li>No selling, sharing, or aggregating user data — it's not in our database because we don't have one.</li>
        <li>No third-party trackers or fingerprinting.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-8">Your rights</h2>
      <p>
        Export everything as JSON or wipe it from Settings. Because the data lives on your device,
        the controls for "delete my data" are yours directly — no support ticket required.
      </p>

      <p className="text-sm text-muted-foreground pt-4">
        If you self-host Soma or fork it, this policy describes the upstream behavior; your fork
        can change it. The source is auditable on GitHub.
      </p>
    </div>
  );
}
