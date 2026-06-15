import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const phone = searchParams.get("phone");

  if (!phone || phone.length < 7) {
    return NextResponse.json({ customer: null });
  }

  const customer = await prisma.customer.findUnique({
    where: { phone },
    select: { id: true, name: true, phone: true, email: true },
  });

  return NextResponse.json({ customer: customer ?? null });
}
