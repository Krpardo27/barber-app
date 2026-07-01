"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { getRoleFromEmail } from "@/lib/roles";
import { BarberSchema, type BarberFieldErrors } from "../schemas/barber.schema";

export type BarberActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: BarberFieldErrors;
};

async function requireAdminAction() {
  const session = await getServerSession();
  const isAdmin = getRoleFromEmail(session?.user.email) === "admin";

  if (!isAdmin) {
    return { error: "No tienes permisos para modificar barberos" };
  }

  return { error: null };
}

function barberFormDataFrom(formData: FormData) {
  return {
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    bio: formData.get("bio") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    isActive: formData.get("isActive") === "on",
  };
}

type BarberServiceConfig = {
  serviceId: string;
  durationMin: number | null;
  isActive: boolean;
};

function parseBarberServiceConfigs(
  formData: FormData,
  services: Array<{ id: string }>,
): { configs: BarberServiceConfig[]; error: string | null } {
  const configs: BarberServiceConfig[] = [];

  for (const service of services) {
    const rawDuration = formData.get(`serviceDuration:${service.id}`)?.toString().trim() ?? "";
    const isActive = formData.get(`serviceEnabled:${service.id}`) === "on";
    let durationMin: number | null = null;

    if (rawDuration) {
      const parsedDuration = Number(rawDuration);

      if (!Number.isInteger(parsedDuration) || parsedDuration < 5 || parsedDuration > 480) {
        return {
          configs: [],
          error: "Las duraciones por servicio deben ser numeros entre 5 y 480 minutos",
        };
      }

      durationMin = parsedDuration;
    }

    configs.push({ serviceId: service.id, durationMin, isActive });
  }

  return { configs, error: null };
}

async function getServiceConfigsFromForm(formData: FormData) {
  const services = await prisma.service.findMany({
    select: { id: true },
    orderBy: { name: "asc" },
  });

  return parseBarberServiceConfigs(formData, services);
}

function revalidateBarbers() {
  revalidatePath("/admin/barberos");
  revalidatePath("/admin");
  revalidatePath("/reservar");
}

export async function createBarberAction(
  _previousState: BarberActionState,
  formData: FormData,
): Promise<BarberActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = BarberSchema.safeParse(barberFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del barbero",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const serviceConfigs = await getServiceConfigsFromForm(formData);

  if (serviceConfigs.error) {
    return { status: "error", message: serviceConfigs.error };
  }

  try {
    await prisma.barber.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        bio: parsed.data.bio || null,
        imageUrl: parsed.data.imageUrl || null,
        isActive: parsed.data.isActive,
        services: {
          create: serviceConfigs.configs,
        },
      },
    });

    revalidateBarbers();

    return { status: "success", message: "Barbero creado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear el barbero" };
  }
}

export async function updateBarberAction(
  barberId: string,
  _previousState: BarberActionState,
  formData: FormData,
): Promise<BarberActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = BarberSchema.safeParse(barberFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del barbero",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const serviceConfigs = await getServiceConfigsFromForm(formData);

  if (serviceConfigs.error) {
    return { status: "error", message: serviceConfigs.error };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.barber.update({
        where: { id: barberId },
        data: {
          name: parsed.data.name,
          phone: parsed.data.phone || null,
          email: parsed.data.email || null,
          bio: parsed.data.bio || null,
          imageUrl: parsed.data.imageUrl || null,
          isActive: parsed.data.isActive,
        },
      });

      await tx.barberService.deleteMany({ where: { barberId } });

      if (serviceConfigs.configs.length > 0) {
        await tx.barberService.createMany({
          data: serviceConfigs.configs.map((config) => ({
            ...config,
            barberId,
          })),
        });
      }
    });

    revalidateBarbers();

    return { status: "success", message: "Barbero actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible actualizar el barbero" };
  }
}

export async function deleteBarberAction(barberId: string): Promise<BarberActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  try {
    await prisma.barber.delete({ where: { id: barberId } });

    revalidateBarbers();

    return { status: "success", message: "Barbero eliminado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar el barbero" };
  }
}