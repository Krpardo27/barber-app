
interface LoaderScreenProps {
  title: string;
  description?: string;
  badgeText?: string;
}

export default function LoaderScreen({
  title,
  description,
  badgeText,
}: LoaderScreenProps) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {badgeText && (
          <span
            className="
              inline-flex
              items-center
              px-3
              py-1
              mb-6
              text-xs
              uppercase
              tracking-[0.2em]
              border
              border-[#C8A96E]/30
              text-[#C8A96E]
            "
          >
            {badgeText}
          </span>
        )}

        <div
          className="
            mx-auto
            mb-6
            h-10
            w-10
            animate-spin
            rounded-full
            border-2
            border-[#C8A96E]/20
            border-t-[#C8A96E]
          "
        />

        <h1
          className="
            font-display
            text-3xl
            text-[#F5E6C8]
            mb-3
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              text-sm
              leading-relaxed
              text-[#F5E6C8]/60
            "
          >
            {description}
          </p>
        )}
      </div>
    </main>
  );
}