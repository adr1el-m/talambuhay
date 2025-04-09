'use client';

import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('antialiased');
  }, []);

  return <>{children}</>;
} 