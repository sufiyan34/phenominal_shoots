export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Lightweight, no-dependency spam guard for public forms (contact, ask,
// booking, payment proof). Two signals:
// 1. A hidden "honeypot" field real users never see or fill; bots that
//    auto-fill every input trip it.
// 2. A minimum time-on-page before submit; scripted submissions tend to
//    fire almost instantly after the form mounts.
// This is a basic deterrent, not a guarantee — it stops unsophisticated
// bots/scrapers without adding a CAPTCHA or a paid service. For stronger
// protection later, add Firebase App Check.
export const HONEYPOT_FIELD = "companyWebsite";
export const MIN_SUBMIT_MS = 1200;

export function isLikelySpamSubmission(form: FormData, mountedAt: number) {
  const honeypotFilled = String(form.get(HONEYPOT_FIELD) || "").trim().length > 0;
  const tooFast = Date.now() - mountedAt < MIN_SUBMIT_MS;
  return honeypotFilled || tooFast;
}
