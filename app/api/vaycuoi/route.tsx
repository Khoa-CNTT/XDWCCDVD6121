import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.vayCuoi.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.vayCuoi.create({
        data: {
          ten: data.ten,
          so_luong: data.so_luong,
          gia: data.gia,
          anh: data.anh,
          id_mau_vay: data.id_mau_vay,
          id_kich_thuoc: data.id_kich_thuoc,
          id_do_tuoi: data.id_do_tuoi,
          id_gia_vay: data.id_gia_vay,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
