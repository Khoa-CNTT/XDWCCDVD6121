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
          gia: data.gia,
          anh: data.anh,
          mau_id: data.mau_id,
          kich_thuoc_id: data.kich_thuoc_id,
          do_tuoi_id: data.do_tuoi_id,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
