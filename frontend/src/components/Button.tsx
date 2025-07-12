'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const base = 'inline-block rounded px-6 py-2 text-sm font-medium transition';
  const styles = {
    primary: 'bg-greenalytic text-white hover:bg-greenalytic-dark',
    outline: 'border border-greenalytic text-greenalytic hover:bg-greenalytic hover:text-white',
  };

  return (
    <button type={type} className={cn(base, styles[variant], className)}>
      {children}
    </button>
  );
}
