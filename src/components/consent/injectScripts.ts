// Injects analytics / advertising tags ONLY after the user consents to the
// matching category. Injection is idempotent: a category is only ever added
// once per page load, and nothing non-essential fires before consent.
//
// Tags carried over from the previous bandperry.com (Squarespace) site, all of
// which are advertising / conversion pixels:
//   - Google Ads tag (gtag.js)  AW-17574370157
//   - Meta Pixel                1858545644702596
//   - TikTok Pixel              D26CTKBC77U110BN94C0
// The old site had no separate analytics tag (no GA4 / GTM -- Squarespace's
// built-in analytics does not transfer), so loadAnalytics() stays empty until
// an analytics property is added.

import type { Consent } from "./consent";

const GOOGLE_ADS_ID = "AW-17574370157";
const META_PIXEL_ID = "1858545644702596";
const TIKTOK_PIXEL_ID = "D26CTKBC77U110BN94C0";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { page: (...args: unknown[]) => void };
  }
}

const injected = new Set<string>();

// Every script injects exactly once per page load. The element carries the
// same id so a re-render can never double-inject.
function once(id: string, run: () => void) {
  if (injected.has(id) || document.getElementById(id)) return;
  injected.add(id);
  run();
}

function addExternalScript(id: string, src: string) {
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

function addInlineScript(id: string, code: string) {
  const s = document.createElement("script");
  s.id = id;
  s.textContent = code;
  document.head.appendChild(s);
}

function loadAnalytics() {
  // No analytics-only scripts on this site yet (see header note).
  once("tbp-analytics", () => {});
}

function loadAdvertising() {
  // Google Ads tag (gtag.js). Loader script plus the standard bootstrap.
  once("tbp-google-ads", () => {
    addExternalScript(
      "tbp-google-ads",
      `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`
    );
    addInlineScript(
      "tbp-google-ads-init",
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`
    );
  });

  // Meta Pixel. Official base code, verbatim, so the queue shim behaves
  // exactly as Meta expects before fbevents.js finishes loading.
  once("tbp-meta-pixel", () => {
    addInlineScript(
      "tbp-meta-pixel",
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`
    );
  });

  // TikTok Pixel. Official base code, verbatim.
  once("tbp-tiktok-pixel", () => {
    addInlineScript(
      "tbp-tiktok-pixel",
      `!function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page();}(window, document, 'ttq');`
    );
  });
}

/** Inject scripts for every category the user has consented to. Additive only. */
export function applyConsent(consent: Consent) {
  if (consent.analytics) loadAnalytics();
  if (consent.advertising) loadAdvertising();
  // Functional and Social categories have no active third-party scripts on this
  // site yet; they are reserved so the choice is recorded for future use.
}

/**
 * Fire a pageview on client-side route changes. The base snippets above only
 * cover the initial load; App Router navigations swap pages without one, so
 * RouteTracker calls this on every pathname change. Each guard is a no-op
 * until the matching pixel has been consented to and injected.
 */
export function trackSpaPageView() {
  if (window.gtag) {
    window.gtag("event", "page_view", { send_to: GOOGLE_ADS_ID });
  }
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
  if (window.ttq) {
    window.ttq.page();
  }
}
