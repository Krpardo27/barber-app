import { z } from "zod";

const chilePhoneRegex = /^\+569\d{8}$/;

export const ReservationSchema = z
  .object({
    serviceId: z.string().min(1, {
      message: "Selecciona un servicio",
    }),

    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z
      .string()
      .length(12, {
        message: "Debe contener 12 caracteres",
      })
      .regex(chilePhoneRegex, {
        message: "Debe tener formato +569XXXXXXXX",
      })
      .optional(),

    customerEmail: z
      .email({
        message: "Email inválido",
      })
      .optional()
      .or(z.literal("")),

    startAt: z.string().min(1, {
      message: "Selecciona una fecha y hora",
    }),

    notes: z
      .string()
      .max(300, {
        message: "Máximo 300 caracteres",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.customerId) {
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
