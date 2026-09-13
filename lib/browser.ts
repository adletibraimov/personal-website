/** In-app WebViews with unstable chrome / viewport. */
export function isInAppBrowser(
  ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
) {
  const u = ua.toLowerCase();
  return (
    u.includes('instagram') ||
    u.includes('telegram') ||
    u.includes('linkedin') ||
    u.includes('threads') ||
    u.includes('barcelona') ||
    u.includes('fbav') ||
    u.includes('fban') ||
    u.includes('fb_iab') ||
    u.includes('iabmv')
  );
}

export function getScrollY() {
  if (typeof window === 'undefined') return 0;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function readViewportHeight() {
  return window.innerHeight || window.visualViewport?.height || 0;
}

/** First-paint viewport. Never follows address-bar / in-app chrome toggles. */
let frozenVh = 0;

export function getFrozenViewportHeight() {
  if (!frozenVh && typeof window !== 'undefined') {
    frozenVh = readViewportHeight();
  }
  return frozenVh;
}

export function applyFrozenViewportCss() {
  const h = getFrozenViewportHeight();
  if (!h) return;
  document.documentElement.style.setProperty('--app-vh', `${h * 0.01}px`);
}

/** Orientation change only — chrome show/hide must not update this. */
export function refreezeViewportHeight() {
  frozenVh = readViewportHeight();
  applyFrozenViewportCss();
  return frozenVh;
}
