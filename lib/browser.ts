/** In-app WebViews (Instagram, Telegram, Facebook) with unstable chrome/viewport. */
export function isInAppBrowser(
  ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
) {
  const u = ua.toLowerCase();
  return (
    u.includes('instagram') ||
    u.includes('telegram') ||
    u.includes('fbav') ||
    u.includes('fban') ||
    u.includes('fb_iab')
  );
}
