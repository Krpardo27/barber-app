import { FiMessageCircle } from "react-icons/fi";

type WhatsAppButtonProps = {
  phone: string | null | undefined;
  message: string;
  label?: string;
};

function normalizeWhatsAppPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("569")) return digits;
  if (digits.startsWith("56")) return digits;
  if (digits.startsWith("9") && digits.length === 9) return `56${digits}`;

  return digits;
}

export default function WhatsAppButton({
  phone,
  message,
  label = "WhatsApp",
}: WhatsAppButtonProps) {
  if (!phone) return null;

  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (!normalizedPhone) return null;

  const href = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-emerald-500/25 px-3 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
    >
      <FiMessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}