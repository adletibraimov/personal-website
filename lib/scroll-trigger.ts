import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  applyFrozenViewportCss,
  isInAppBrowser,
  refreezeViewportHeight,
} from '@/lib/browser';

/**
 * Lock ST against in-app chrome toggles.
 * ignoreMobileResize alone is not enough if anything calls refresh() on resize
 * or if autoRefreshEvents still includes "resize".
 */
export function configureScrollTrigger() {
  const inApp =
    typeof navigator !== 'undefined' && isInAppBrowser(navigator.userAgent);

  ScrollTrigger.config({
    ignoreMobileResize: true,
    // In-app chrome fires resize / visualViewport resize while scrolling.
    // Only boot events — orientation is handled manually below.
    ...(inApp
      ? { autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' }
      : {}),
  });

  if (typeof document !== 'undefined') {
    applyFrozenViewportCss();
  }
}

/**
 * One initial measure, then refresh only on orientation change.
 * Do not call refresh() from image load, fonts, or delayed timers —
 * those fire mid-scroll in WebViews and jump start/end.
 */
export function bindStableScrollTriggerRefresh() {
  applyFrozenViewportCss();

  const raf = requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  const onOrientation = () => {
    window.setTimeout(() => {
      refreezeViewportHeight();
      ScrollTrigger.refresh();
    }, 280);
  };
  window.addEventListener('orientationchange', onOrientation);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('orientationchange', onOrientation);
  };
}
