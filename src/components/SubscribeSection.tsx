import SubscribeForm from "@/components/SubscribeForm";
import { kurilian } from "@/lib/fonts";

/**
 * Native email/SMS signup section for the bottom of content pages. Wraps the
 * shared SubscribeForm (same fields + /api/subscribe wiring as the home-page
 * modal) in a full-width section. The `id="subscribe"` is an in-page anchor
 * target so nav "Subscribe" links can scroll here.
 */
export function SubscribeSection() {
  return (
    <section
      id="subscribe"
      aria-label="Email signup"
      data-bg="primary"
      className="px-5 py-20 md:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-md text-center">
        <h2 className={`${kurilian.className} text-[32px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[40px]`}>
          Join the List
        </h2>
        <SubscribeForm idPrefix="section" />
      </div>
    </section>
  );
}
