import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:3000",
});

// Centralizamos la seguridad de redirecciones aquí
export function getSafeCallbackPath(
  callbackURL?: string | null,
  fallback = "/",
) {
  if (!callbackURL) return fallback;

  const normalized = callbackURL.trim();
  // Previene ataques de Open Redirect (ej: //google.com)
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return fallback;
  }

  return normalized;
}

// Google Sign In
export const signInWithGoogle = async (callbackURL = "/admin") => {
  return authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
};

export const { signIn, signUp, signOut } = authClient;
