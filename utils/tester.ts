export const TESTER_EMAILS = ["vunguyen5127@gmail.com", "vunguyencapital@gmail.com"];

export function isTester(email: string | undefined | null) {
  if (!email) return false;
  return TESTER_EMAILS.includes(email);
}
