import { z } from "zod";

const chilePhoneRegex = /^\+569\d{8}$/;
const chilePhoneMessage = "Debe tener formato chileno +569XXXXXXXX";

export const ReservationSchema = z
  .object({
    serviceId: z.string().min(1, {
      message: "Selecciona un servicio",
    }),

    barberId: z.string().optional(),

    customerMode: z.enum(["search", "new"]),
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z
      .string()
      .trim()
      .refine((phone) => phone === "" || chilePhoneRegex.test(phone), {
        message: chilePhoneMessage,
      })
      .optional(),

    customerEmail: z
      .email({
        message: "Email inválido",
      })
      .optional()
      .or(z.literal("")),

    startAt: z.string().optional(),

    notes: z
      .string()
      .max(300, {
        message: "Máximo 300 caracteres",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceId.trim() && !data.startAt?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Selecciona una fecha y hora",
      });
    }

    if (data.customerMode === "search" && !data.customerId) {
      ctx.addIssue({
        code: "custom",
        path: ["customerId"],
        message: "Busca un cliente registrado o crea uno nuevo",
      });
    }

    if (data.customerMode === "new" && !data.customerId) {
      if (!data.customerName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["customerName"],
          message: "El nombre es obligatorio",
        });
      }

      if (!data.customerPhone?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["customerPhone"],
          message: "El teléfono es obligatorio",
        });
      }
    }
  });

export type ReservationFormData = z.infer<typeof ReservationSchema>;
