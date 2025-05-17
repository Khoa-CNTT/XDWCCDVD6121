import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const datas = await prisma.size.findMany();
  return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
  const data = await request.json();
  const datas = await prisma.size.create({
    data: {
      size: data.size,
      min_chieu_cao: data.min_chieu_cao,
      max_chieu_cao: data.max_chieu_cao,
      min_can_nang: data.min_can_nang,
      max_can_nang: data.max_can_nang,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 201 });
}
