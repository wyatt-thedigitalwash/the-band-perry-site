import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // YouTube thumbnails for the Videos page.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  /**
   * Redirects from the legacy Squarespace site (see
   * reference/legacy-site/url-inventory.csv, re-verified against the live site
   * and its sitemap.xml).
   *
   * The old site had exactly five reachable internal URLs: /, /home, /about,
   * /music and /tour. Every other path probed -- /shop, /subscribe, /videos,
   * /contact, /news, /shows, /store, /merch, /epk, /press, /gallery, /photos,
   * /blog, /media, /links -- already returns 404 there, so those carry no
   * ranking or inbound-link equity and get no rule. /music and /tour keep
   * their paths in the rebuild and need no rule either.
   *
   * `permanent: true` emits a 308, which is the modern permanent redirect:
   * same "pass the ranking on" signal to search engines as a 301, and unlike
   * 301 it forbids clients from rewriting the method.
   *
   * Trailing-slash variants are NOT listed. This project runs with the default
   * `trailingSlash: false`, so Next strips a trailing slash and redirects
   * before these rules are matched -- /about/ becomes /about, which then hits
   * the rule below. A separate '/about/' source would be dead config.
   */
  async redirects() {
    return [
      // Squarespace served the homepage at /home and named it canonical in its
      // sitemap, so that path is what search engines have indexed. The rebuild
      // serves the homepage at the root only.
      { source: '/home', destination: '/', permanent: true },

      // The About page was renamed to Band.
      { source: '/about', destination: '/band', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
