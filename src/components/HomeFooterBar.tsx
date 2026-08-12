import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import CookieChoicesLink from "@/components/legal/CookieChoicesLink";

const LEGAL_LINKS = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Copyright (DMCA)", href: "/legal/dmca" },
  { label: "Cybersecurity", href: "/legal/cybersecurity" },
  { label: "TCPA", href: "/legal/tcpa" },
  { label: "Do Not Sell My Personal Information", href: "/legal/privacy#s10-2" },
];

export function HomeFooterBar() {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:grid sm:grid-cols-3 sm:items-center sm:gap-2 sm:text-left">
      {/* Both copyright lines share one grid cell. A second top-level <p> would
          land as a fourth item in the sm+ three-column grid and push the social
          row and legal links out of place. */}
      <div className="text-[10px] uppercase tracking-wide text-[#FAFAFA]/70 sm:justify-self-start">
        <p>© 2026, The Band Perry. All Rights Reserved.</p>
        <p className="mt-1">
          © Borchetta Entertainment Group, LLC d/b/a Big Machine Records
        </p>
      </div>

      <div className="sm:justify-self-center">
        <SocialLinks />
      </div>

      {/* Mobile: the six legal links collapse to a single "Legal" link into the
          /legal hub so the footer stays one clean line. */}
      {/* The mobile line holds only two targets and never wraps, so padding can
          grow both to ~44px tall; the negative margin keeps the footer's own
          height unchanged. The sm+ row below wraps, where the same trick would
          make wrapped lines overlap. */}
      <p className="flex items-center justify-center gap-x-2.5 text-[10px] uppercase tracking-wide text-[#FAFAFA]/70 sm:hidden">
        <Link href="/legal" className="-my-4 py-4 transition-opacity hover:opacity-70">
          Legal
        </Link>
        <span aria-hidden className="text-[#FAFAFA]/30">/</span>
        <CookieChoicesLink className="-my-4 py-4 uppercase tracking-wide transition-opacity hover:opacity-70" />
      </p>

      <p className="hidden flex-wrap items-center justify-center gap-x-2.5 text-[10px] uppercase tracking-wide text-[#FAFAFA]/70 sm:flex sm:justify-self-end sm:justify-end">
        {LEGAL_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="text-[#FAFAFA]/30">/</span>}
            <Link href={link.href} className="transition-opacity hover:opacity-70">
              {link.label}
            </Link>
          </span>
        ))}
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="text-[#FAFAFA]/30">/</span>
          <CookieChoicesLink className="uppercase tracking-wide transition-opacity hover:opacity-70" />
        </span>
      </p>
    </div>
  );
}
