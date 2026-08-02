'use client';

import { useEffect, useState } from 'react';

import fluidCursor from '@/hooks/use-FluidCursor';

const FluidCursor = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    return fluidCursor();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className='pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-80'>
      <canvas id='fluid' className='h-full w-full' />
    </div>
  );
};

export default FluidCursor;
