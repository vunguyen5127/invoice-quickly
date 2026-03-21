const envEmails = process.env.TESTER_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean) ?? [];

export const TESTER_EMAILS: string[] = envEmails;

export function isTester(email: string | undefined | null) {
  if (!email) return false;
  return TESTER_EMAILS.includes(email);
}
