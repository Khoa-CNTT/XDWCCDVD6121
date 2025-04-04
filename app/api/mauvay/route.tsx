import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const datas = await prisma.mauVay.findMany();
  return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
  const data = await request.json();
  const datas = await prisma.mauVay.create({
    data: {
      mau_id: data.mau_id,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 201 });
}
