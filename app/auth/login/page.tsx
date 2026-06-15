import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import { FiScissors } from "react-icons/fi";
import Link from "next/link";

interface LoginPageProps {
  searchParams: Promise<{
    callbackURL?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const callbackURL =
    params.callbackURL || "/admin";

  return (
    <main className="min-h-dvh bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl border border-[#C8A96E]/30 bg-black flex items-center justify-center">
            <FiScissors className="h-8 w-8 -rotate-45 text-[#C8A96E]" />
          </div>

          <div>
            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
              Barber OS
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Panel de administración
            </p>
          </div>

          <div className="h-px w-12 bg-[#C8A96E]/40" />
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-zinc-800/50 bg-linear-to-br from-zinc-900/50 to-black/50 backdrop-blur p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A96E]">
              Acceso seguro
            </p>
            <h2 className="text-xl font-semibold text-white">
              Inicia sesión con tu cuenta
            </h2>
            <p className="text-sm text-zinc-400">
              Solo administradores pueden acceder al panel.
            </p>
          </div>

          <GoogleSignInButton
            callbackURL={callbackURL}
            text="Continuar con Google"
            variant="primary"
            className="w-full"
          />

          <p className="text-xs text-center text-zinc-500 leading-relaxed">
            Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#C8A96E] hover:text-[#F5E6C8] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}