import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const datas = await prisma.rapCuoi.findMany({
    include: {
      mau_release: true,
      so_luong_ghe: true,
      so_luong_day_ghe: true,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const datas = await prisma.rapCuoi.create({
    data: {
      ten_rap: data.ten_rap,
      mau_id: data.mau_id,
      so_ghe_id: data.so_ghe_id,
      so_day_ghe_id: data.so_day_ghe_id,
      gia_thue: data.gia_thue,
      anh_rap: data.anh_rap,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 201 });
}
