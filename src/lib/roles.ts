export type AppRole = "guest" | "user" | "admin";

function parseEmails(raw: string | undefined): Set<string> {
  if (!raw) return new Set();

  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | null | undefined, adminEmailsRaw?: string): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const clientSource = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS;
  const serverSource = process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  const source = adminEmailsRaw ?? (typeof window !== "undefined" ? clientSource : serverSource);
  const adminEmails = parseEmails(source);

  return adminEmails.has(normalizedEmail);
}

export function getRoleFromEmail(email: string | null | undefined, adminEmailsRaw?: string): AppRole {
  if (!email) return "guest";
  return isAdminEmail(email, adminEmailsRaw) ? "admin" : "user";
}
