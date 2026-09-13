/** In-app WebViews with unstable chrome / viewport (Instagram, Telegram, LinkedIn, Facebook). */
export function isInAppBrowser(
  ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
) {
  const u = ua.toLowerCase();
  return (
    u.includes('instagram') ||
    u.includes('telegram') ||
    u.includes('linkedin') ||
    u.includes('fbav') ||
    u.includes('fban') ||
    u.includes('fb_iab') ||
    u.includes('iabmv')
  );
}

/** Visible viewport — visualViewport is accurate in in-app chrome; innerHeight is not. */
export function getViewportHeight() {
  if (typeof window === 'undefined') return 0;
  return window.visualViewport?.height || window.innerHeight;
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
