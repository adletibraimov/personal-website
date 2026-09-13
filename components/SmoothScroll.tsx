'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isInAppBrowser } from '@/lib/browser';
import {
  bindStableScrollTriggerRefresh,
  configureScrollTrigger,
} from '@/lib/scroll-trigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
configureScrollTrigger();

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    configureScrollTrigger();
    const unbindRefresh = bindStableScrollTriggerRefresh();

    // Lenis + in-app WebViews fight over scroll — use native
    if (isInAppBrowser()) {
      return unbindRefresh;
    }

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
    });

    instance.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      unbindRefresh();
      instance.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
