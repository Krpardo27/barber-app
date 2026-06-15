"use client";

import { signInWithGoogle } from "@/lib/auth-client";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

interface GoogleSignInButtonProps {
  variant?: "primary" | "secondary";
  className?: string;
  text?: string;
  callbackURL?: string;
}

export default function GoogleSignInButton({
  variant = "primary",
  className = "",
  text = "Iniciar sesión con Google",
  callbackURL = "/admin",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError(null);

      await signInWithGoogle(callbackURL);
    } catch (err) {
      setLoading(false);

      setError(
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión",
      );
    }
  }

  const baseStyles =
    "flex items-center gap-2 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white",
    secondary:
      "border border-zinc-700 bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800",
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        <FaGoogle />

        <span>
          {loading
            ? "Redirigiendo..."
            : text}
        </span>
      </button>

      {error && (
        <div className="mt-2 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </>
  );
}