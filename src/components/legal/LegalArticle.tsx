"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Renderer for the legal / policy pages. Content is passed in as structured
 * data (see the `Block` type) so the exact copy lives as plain strings -- no
 * JSX-escaping of the source text -- and hyperlinks are inserted at precise
 * points. Every link is styled blue via the `.legal-prose` rule in globals.css.
 */

export type Run =
  | string
  | { t: string; b?: boolean; i?: boolean; u?: boolean } // styled text (bold/italic/underline)
  | { t: string; href: string; ext?: boolean; b?: boolean } // link: ext => new tab; "/..." or "#..." => internal
  | { t: string; action: "cookie" }; // opens the cookie-preferences tool

export type Block =
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string; u?: boolean }
  | { type: "p"; runs: Run[]; id?: string; className?: string }
  | { type: "ul"; items: Run[][] }
  | { type: "ol"; items: Run[][]; start?: number };

function RunView({ run }: { run: Run }) {
  if (typeof run === "string") return <>{run}</>;

  if ("action" in run) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
        }}
      >
        {run.t}
      </a>
    );
  }

  if ("href" in run) {
    const { t, href, ext, b } = run;
    const label = b ? <strong className="font-semibold">{t}</strong> : t;
    if (ext) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      );
    }
    // Only real internal routes go through next/link. Same-page anchors (#...)
    // and mailto:/tel: must be plain anchors -- routing a mailto through <Link>
    // makes the router navigate to it and blanks the page.
    if (href.startsWith("/")) {
      return <Link href={href}>{label}</Link>;
    }
    return <a href={href}>{label}</a>;
  }

  // Styled text run
  let node: React.ReactNode = run.t;
  if (run.b) node = <strong className="font-semibold text-text-header">{node}</strong>;
  if (run.i) node = <em>{node}</em>;
  if (run.u) node = <span className="underline">{node}</span>;
  return <>{node}</>;
}

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((r, i) => (
        <RunView key={i} run={r} />
      ))}
    </>
  );
}

function BlockView({ block, promoteH3 }: { block: Block; promoteH3: boolean }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="mt-12 font-display text-[24px] md:text-[28px]"
          style={{ color: "var(--text-accent)", scrollMarginTop: "7rem" }}
        >
          {block.text}
        </h2>
      );
    case "h3": {
      // On policies whose sections are all one tier (Terms, DMCA,
      // Cybersecurity), those sections sit directly under the page h1, so they
      // render as h2 to avoid an h1 -> h3 jump. Only the tag changes; the
      // smaller h3 type scale is kept so the page looks exactly as before.
      const Tag = promoteH3 ? "h2" : "h3";
      return (
        <Tag
          id={block.id}
          className={`mt-8 font-display text-[19px] md:text-[22px] ${block.u ? "underline" : ""}`}
          style={{ color: "var(--text-accent)", scrollMarginTop: "7rem" }}
        >
          {block.text}
        </Tag>
      );
    }
    case "p":
      return (
        <p
          id={block.id}
          className={`mt-4 ${block.className ?? ""}`}
          style={block.id ? { scrollMarginTop: "7rem" } : undefined}
        >
          <Runs runs={block.runs} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {block.items.map((item, i) => (
            <li key={i}>
              <Runs runs={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 list-decimal space-y-2 pl-6" start={block.start}>
          {block.items.map((item, i) => (
            <li key={i}>
              <Runs runs={item} />
            </li>
          ))}
        </ol>
      );
  }
}

export default function LegalArticle({
  title,
  intro,
  blocks,
}: {
  title: string;
  intro?: string;
  blocks: Block[];
}) {
  // Scroll to the anchor on mount so cross-page #section links land correctly.
  // Content stays visible throughout -- no hide/reveal, which previously caused
  // the page to flash blank on hash loads and Fast-Refresh remounts.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  // Policies that never use an h2 have no second tier to nest under, so their
  // h3 blocks are the top-level sections. See BlockView.
  const promoteH3 = !blocks.some((b) => b.type === "h2");

  return (
    <main id="main-content">
      <section
        aria-label="Policy title"
        data-bg="primary"
        className="bg-background-primary px-5 pt-36 pb-4 lg:px-12"
      >
        <div className="mx-auto max-w-[820px]">
          <Link href="/legal" className="font-body text-sm text-text-accent/70 hover:text-text-header">
            &larr; All Policies
          </Link>
          <h1 className="mt-6 text-[30px] md:text-[44px]" style={{ color: "var(--text-accent)" }}>
            {title}
          </h1>
          {intro ? <p className="mt-3 font-body text-sm text-text-accent/70">{intro}</p> : null}
        </div>
      </section>

      <section
        aria-label="Policy text"
        data-bg="primary"
        className="bg-background-primary px-5 pb-20 md:pb-28 lg:px-12"
      >
        <article className="legal-prose mx-auto max-w-[820px] font-body text-[15px] leading-[1.75] text-text-accent md:text-base">
          {blocks.map((b, i) => (
            <BlockView key={i} block={b} promoteH3={promoteH3} />
          ))}
        </article>
      </section>
    </main>
  );
}
