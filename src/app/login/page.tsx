import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SomaMark } from '@/components/soma-mark';
import { Lock } from 'lucide-react';

export const metadata = { title: 'Get started' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" aria-label="Soma">
            <SomaMark size={24} />
          </Link>
          <CardTitle className="mt-4 text-2xl wordmark">no account needed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Soma runs entirely in your browser. There's no signup, no password, and nothing to verify.
            Open the app and your data stays on this device.
          </p>
          <div className="rounded-lg border border-border p-3 flex gap-3 items-start text-xs text-muted-foreground">
            <Lock size={14} className="mt-0.5 shrink-0" />
            <span>
              Use <strong>Settings → Export JSON</strong> to back up before clearing site data or
              switching devices.
            </span>
          </div>
          <Link href="/app" className="block">
            <Button className="w-full">Open app</Button>
          </Link>
          <p className="label-mono text-muted-foreground text-center">
            <Link href="/" className="hover:text-foreground">
              ← BACK
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
