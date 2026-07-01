import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const chilePhoneRegex = /^\+569\d{8}$/;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const phone = searchParams.get("phone");

  if (!phone || !chilePhoneRegex.test(phone)) {
    return NextResponse.json({ customer: null });
  }

  const customer = await prisma.customer.findUnique({
    where: { phone },
    select: { id: true, name: true, phone: true },
  });

  return NextResponse.json(
    { customer: customer ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
