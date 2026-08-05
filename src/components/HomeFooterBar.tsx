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
      <p className="text-[10px] uppercase tracking-wide text-[#FAFAFA]/70 sm:justify-self-start">
        © 2026, The Band Perry. All Rights Reserved.
      </p>

      <div className="sm:justify-self-center">
        <SocialLinks />
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-2.5 text-[10px] uppercase tracking-wide text-[#FAFAFA]/70 sm:justify-self-end sm:justify-end">
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
