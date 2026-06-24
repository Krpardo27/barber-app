"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { getRoleFromEmail } from "@/lib/roles";
import {
  normalizeServiceSlug,
  ServiceSchema,
  type ServiceFieldErrors,
  validateServiceSlug,
} from "../schemas/service.schema";

export type ServiceActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: ServiceFieldErrors;
};

async function requireAdminAction() {
  const session = await getServerSession();
  const isAdmin = getRoleFromEmail(session?.user.email) === "admin";

  if (!isAdmin) {
    return { error: "No tienes permisos para modificar servicios" };
  }

  return { error: null };
}

function serviceFormDataFrom(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug") ?? "",
    description: formData.get("description"),
    price: formData.get("price"),
    durationMin: formData.get("durationMin"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    isActive: formData.get("isActive") === "on",
  };
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      category: { select: { slug: true } },
      _count: { select: { reservations: true } },
    },
  });

  if (!service) {
    return { status: "error", message: "Servicio no encontrado" };
  }

  if (service._count.reservations > 0) {
    return {
      status: "error",
      message:
        "No se puede eliminar un servicio con reservas asociadas. Puedes dejarlo inactivo.",
    };
  }

  try {
    await prisma.service.delete({ where: { id: serviceId } });

    revalidateServices();
    revalidatePath(`/servicios/${service.category.slug}`);

    return { status: "success", message: "Servicio eliminado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible eliminar el servicio" };
  }
}

function revalidateServices() {
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  revalidatePath("/reservar");
}

async function validateCategory(
  categoryId: string,
): Promise<
  | { category: { id: string; slug: string }; error: null }
  | { category: null; error: ServiceActionState }
> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, slug: true },
  });

  if (!category) {
    return {
      category: null,
      error: {
        status: "error",
        message: "La categoria seleccionada no existe",
        fieldErrors: { categoryId: ["Selecciona una categoria valida"] },
      },
    };
  }

  return { category, error: null };
}

export async function createServiceAction(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = ServiceSchema.safeParse(serviceFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del servicio",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const slug = normalizeServiceSlug(parsed.data.slug || parsed.data.name);

  if (!validateServiceSlug(slug)) {
    return {
      status: "error",
      message: "No fue posible generar una URL valida para el servicio",
      fieldErrors: { name: ["Usa un nombre con letras o numeros"] },
    };
  }

  const categoryResult = await validateCategory(parsed.data.categoryId);
  if (categoryResult.error) return categoryResult.error;

  const existingSlug = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingSlug) {
    return {
      status: "error",
      message: "Ya existe un servicio con ese nombre",
      fieldErrors: { name: ["Elige otro nombre para generar una URL unica"] },
    };
  }

  try {
    await prisma.service.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        durationMin: parsed.data.durationMin,
        imageUrl: null,
        featured: parsed.data.featured,
        isActive: parsed.data.isActive,
        categoryId: parsed.data.categoryId,
      },
    });

    revalidateServices();
    revalidatePath(`/servicios/${categoryResult.category.slug}`);

    return { status: "success", message: "Servicio creado correctamente" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "No fue posible crear el servicio" };
  }
}

export async function updateServiceAction(
  serviceId: string,
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const auth = await requireAdminAction();

  if (auth.error) {
    return { status: "error", message: auth.error };
  }

  const parsed = ServiceSchema.safeParse(serviceFormDataFrom(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos del servicio",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const currentService = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, slug: true, category: { select: { slug: true } } },
  });

  if (!currentService) {
    return { status: "error", message: "Servicio no encontrado" };
  }

  const slug = normalizeServiceSlug(parsed.data.slug || parsed.data.name);

  if (!validateServiceSlug(slug)) {
    return {
      status: "error",
      message: "No fue posible generar una URL valida para el servicio",
      fieldErrors: { name: ["Usa un nombre con letras o numeros"] },
    };
  }

  const categoryResult = await validateCategory(parsed.data.categoryId);
  if (categoryResult.error) return categoryResult.error;

  const existingSlug = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingSlug && existingSlug.id !== serviceId) {
    return {
      status: "error",
      message: "Ya existe un servicio con ese nombre",
      fieldErrors: { name: ["Elige otro nombre para generar una URL unica"] },
    };
  }

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        durationMin: parsed.data.durationMin,
        featured: parsed.data.featured,
        isActive: parsed.data.isActive,
        categoryId: parsed.data.categoryId,
      },
    });

    revalidateServices();
    revalidatePath(`/servicios/${currentService.category.slug}`);
    revalidatePath(`/servicios/${categoryResult.category.slug}`);

    return { status: "success", message: "Servicio actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "No fue posible actualizar el servicio",
    };
  }
}
