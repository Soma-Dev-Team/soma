import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SomaMark } from '@/components/soma-mark';
import { Mail } from 'lucide-react';

export const metadata = { title: 'Check your email' };

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" aria-label="Soma">
            <SomaMark size={24} />
          </Link>
          <CardTitle className="mt-4 text-2xl wordmark">check your email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-3 items-start text-sm text-muted-foreground leading-relaxed">
            <Mail size={18} className="mt-0.5 shrink-0 text-foreground" />
            <span>
              We sent a magic link. Click it to sign in. The link expires in 24 hours and can only
              be used once.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            No email? Check spam, or{' '}
            <Link href="/login" className="underline hover:text-foreground">
              try again
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
