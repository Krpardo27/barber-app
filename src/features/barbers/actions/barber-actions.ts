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

function revalidateBarbers() {
  revalidatePath("/admin/barberos");
  revalidatePath("/admin");
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

  try {
    await prisma.barber.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        bio: parsed.data.bio || null,
        imageUrl: parsed.data.imageUrl || null,
        isActive: parsed.data.isActive,
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

  try {
    await prisma.barber.update({
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