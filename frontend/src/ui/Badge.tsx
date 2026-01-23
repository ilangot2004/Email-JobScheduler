import React from 'react';
import { cn } from './cn';

type BadgeVariant = 'scheduled' | 'sent' | 'failed' | 'retrying' | 'neutral';

export default function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<BadgeVariant, string> = {
    scheduled: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    sent: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    failed: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    retrying: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

