export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// Spreads to {} (no header) when logged out, so routes that allow anonymous
// access (tickets, ask) keep working exactly as before - only routes that
// actually require a role (document upload) will reject the request.
export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
