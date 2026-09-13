import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SETTLE_MS = 1200;

/**
 * Recalculate start/end after layout, images, and fonts settle.
 * Needed when Lenis is off (native webview scroll) and when 100vh spacers
 * above the section resolve after first paint.
 *
 * Late image `load` events must not refresh forever — a refresh while the
 * user is mid-scroll can skip onEnter and leave timelines stuck at 0.
 */
export function scheduleScrollTriggerRefresh(root?: ParentNode | null) {
  let cancelled = false;
  let windowOpen = true;
  const timeouts: number[] = [];
  let rafOuter = 0;
  let rafInner = 0;

  const refresh = () => {
    if (!cancelled) ScrollTrigger.refresh();
  };

  const refreshIfOpen = () => {
    if (windowOpen) refresh();
  };

  rafOuter = requestAnimationFrame(() => {
    rafInner = requestAnimationFrame(refreshIfOpen);
  });

  [200, 700].forEach((ms) => {
    timeouts.push(window.setTimeout(refreshIfOpen, ms));
  });

  timeouts.push(
    window.setTimeout(() => {
      windowOpen = false;
    }, SETTLE_MS)
  );

  const images = root ? Array.from(root.querySelectorAll('img')) : [];
  images.forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', refreshIfOpen);
    img.addEventListener('error', refreshIfOpen);
  });

  void document.fonts?.ready.then(refreshIfOpen);

  if (document.readyState !== 'complete') {
    window.addEventListener('load', refreshIfOpen, { once: true });
  }

  const onOrientation = () => {
    window.setTimeout(refresh, 280);
  };
  window.addEventListener('orientationchange', onOrientation);

  return () => {
    cancelled = true;
    windowOpen = false;
    cancelAnimationFrame(rafOuter);
    cancelAnimationFrame(rafInner);
    timeouts.forEach((id) => clearTimeout(id));
    images.forEach((img) => {
      img.removeEventListener('load', refreshIfOpen);
      img.removeEventListener('error', refreshIfOpen);
    });
    window.removeEventListener('load', refreshIfOpen);
    window.removeEventListener('orientationchange', onOrientation);
  };
}
