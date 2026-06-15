"use client";

import { signInWithGoogle } from "@/lib/auth-client";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

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

      const message =
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Intenta de nuevo.";
      
      setError(message);
      console.error("Google Sign In Error:", err);
    }
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95",
    secondary:
      "border border-zinc-700 bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800 hover:border-zinc-600 active:scale-95",
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full ${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {loading ? (
          <>
            <FiLoader className="h-5 w-5 animate-spin" />
            <span>Redirigiendo...</span>
          </>
        ) : (
          <>
            <FaGoogle className="h-5 w-5" />
            <span>{text}</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <FiAlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Error de inicio de sesión</p>
            <p className="text-xs text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}