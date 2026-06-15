import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import { FiScissors } from "react-icons/fi";

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
    <main className="min-h-dvh bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <div
            className="
              mb-5
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-zinc-800
              bg-zinc-950
            "
          >
            <FiScissors
              className="
                h-6 w-6
                -rotate-45
                text-[#C8A96E]
              "
            />
          </div>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Barber OS
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-zinc-500
            "
          >
            Accede al panel de administración.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border border-zinc-800
            bg-zinc-950
          "
        >
          <GoogleSignInButton
            callbackURL={callbackURL}
            className="w-full"
          />
        </div>
      </div>
    </main>
  );
}