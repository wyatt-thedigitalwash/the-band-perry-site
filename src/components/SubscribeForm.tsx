"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { SMS_COUNTRIES } from "@/lib/subscribe-validation";

/**
 * The shared subscribe form. Rendered both inside SubscribeModal (home page)
 * and inline at the bottom of content pages via SubscribeSection, so the field
 * set, validation, honeypot, and /api/subscribe wiring live in exactly one
 * place. Only presentation (dialog chrome vs. section chrome) differs per host.
 *
 * `idPrefix` namespaces every element id so two instances can safely coexist on
 * the same page (e.g. an open modal over a page that already has the section).
 */

type FormStatus = "idle" | "loading" | "success" | "error";
type ErrorField = "email" | "phone" | "";

const DEFAULT_SUCCESS =
  "You're on the list. Check your phone for a text and reply to confirm SMS updates.";

// Keep only digits and auto-format a US number as NXX-NXX-XXXX as the fan types.
function formatUsPhone(value: string): string {
  let d = value.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

const inputBase =
  "w-full bg-transparent border px-3 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/50 outline-none transition-colors focus:border-[#AADCF8]";
const fieldBorder = (invalid: boolean) =>
  invalid ? "border-red-400" : "border-[#FAFAFA]/25";

export default function SubscribeForm({
  idPrefix,
  description = "Be the first to know about new music, tour dates, and more.",
  autoFocusFirst = false,
}: {
  idPrefix: string;
  description?: string;
  autoFocusFirst?: boolean;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorField, setErrorField] = useState<ErrorField>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isNorthAmerica = SMS_COUNTRIES.has(country);
  const id = (name: string) => `${idPrefix}-${name}`;

  useEffect(() => {
    if (autoFocusFirst) requestAnimationFrame(() => firstFieldRef.current?.focus());
  }, [autoFocusFirst]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return; // guard double-submit
    setStatus("loading");
    setErrorField("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, zipCode, country, website }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMessage(data?.message || DEFAULT_SUCCESS);
        setStatus("success");
        return;
      }

      const field: ErrorField =
        data?.field === "email" || data?.field === "phone" ? data.field : "";
      setErrorField(field);
      setErrorMessage(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
      requestAnimationFrame(() => {
        if (field === "email") emailRef.current?.focus();
        else if (field === "phone") phoneRef.current?.focus();
      });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" aria-live="polite" className="mt-6 text-center text-sm text-[#FAFAFA]/80">
        {successMessage || DEFAULT_SUCCESS}
      </p>
    );
  }

  return (
    <>
      <p className="mt-2 text-center text-xs text-[#FAFAFA]/50">{description}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-3">
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} type="text" name="website" tabIndex={-1}
            autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor={id("first")} className="sr-only">First Name</label>
            <input ref={firstFieldRef} id={id("first")} name="firstName" placeholder="First Name"
              autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className={`${inputBase} ${fieldBorder(false)}`} />
          </div>
          <div className="flex-1">
            <label htmlFor={id("last")} className="sr-only">Last Name</label>
            <input id={id("last")} name="lastName" placeholder="Last Name"
              autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)}
              className={`${inputBase} ${fieldBorder(false)}`} />
          </div>
        </div>

        <div>
          <label htmlFor={id("email")} className="sr-only">Email</label>
          <input ref={emailRef} id={id("email")} type="email" name="email" placeholder="Email*"
            required aria-required="true" aria-invalid={errorField === "email"}
            aria-describedby={status === "error" ? id("error") : undefined}
            autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className={`${inputBase} ${fieldBorder(errorField === "email")}`} />
        </div>

        <div>
          <label htmlFor={id("phone")} className="sr-only">Phone Number</label>
          {isNorthAmerica ? (
            <div className={`flex items-stretch border bg-transparent ${fieldBorder(errorField === "phone")} focus-within:border-[#AADCF8]`}>
              <span className="flex items-center pl-3 pr-2 text-sm text-[#FAFAFA]/50 select-none" aria-hidden="true">+1</span>
              <input ref={phoneRef} id={id("phone")} type="tel" name="phone" inputMode="numeric"
                placeholder="555-555-5555" required aria-required="true" aria-invalid={errorField === "phone"}
                aria-describedby={status === "error" ? id("error") : undefined}
                autoComplete="tel" value={phone} onChange={(e) => setPhone(formatUsPhone(e.target.value))}
                className="w-full bg-transparent py-3 pr-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/50 outline-none border-0" />
            </div>
          ) : (
            <input ref={phoneRef} id={id("phone")} type="tel" name="phone" inputMode="tel"
              placeholder="Phone Number (optional)" aria-invalid={errorField === "phone"}
              aria-describedby={status === "error" ? id("error") : undefined}
              autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className={`${inputBase} ${fieldBorder(errorField === "phone")}`} />
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor={id("zip")} className="sr-only">Zip Code</label>
            <input id={id("zip")} name="zipCode" inputMode="numeric" placeholder="Zip Code"
              autoComplete="postal-code" value={zipCode} onChange={(e) => setZipCode(e.target.value)}
              className={`${inputBase} ${fieldBorder(false)}`} />
          </div>
          <div className="flex-1">
            <label htmlFor={id("country")} className="sr-only">Country</label>
            <select id={id("country")} name="country" value={country} onChange={(e) => setCountry(e.target.value)}
              className={`${inputBase} ${fieldBorder(false)} appearance-none`}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#0A0A0A] text-[#FAFAFA]">{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={status === "loading"}
          className="mt-1 corner-inverted px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-[#292929] disabled:opacity-50">
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>

        <p className="text-[10px] leading-relaxed text-[#FAFAFA]/55">
          By subscribing you agree to receive email and recurring automated marketing text
          messages. We will text you once to confirm your number, reply to opt in. Consent is
          not a condition of purchase. Message and data rates may apply. See Laylo&apos;s{" "}
          <a href="https://laylo.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#AADCF8]">Terms</a>{" "}
          and{" "}
          <a href="https://laylo.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#AADCF8]">Privacy Policy</a>.
        </p>

        {status === "error" && (
          <p id={id("error")} role="alert" className="text-sm text-red-400">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
        )}
      </form>
    </>
  );
}
