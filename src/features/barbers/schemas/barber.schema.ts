import { z } from "zod";

const chilePhoneRegex = /^\+569\d{8}$/;
const chilePhoneMessage = "Debe tener formato chileno +569XXXXXXXX";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : ""));

export const BarberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  phone: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : ""))
    .refine((value) => value === "" || chilePhoneRegex.test(value), {
      message: chilePhoneMessage,
    }),
  email: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : ""))
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Ingresa un email valido",
    }),
  bio: z
    .string()
    .trim()
    .max(240, "La biografia no puede superar los 240 caracteres")
    .transform((value) => (value.length > 0 ? value : "")),
  imageUrl: optionalText,
  isActive: z.boolean(),
});

export type BarberInput = z.infer<typeof BarberSchema>;
export type BarberFieldErrors = z.inferFlattenedErrors<typeof BarberSchema>["fieldErrors"];