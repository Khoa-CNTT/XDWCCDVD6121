import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.rapCuoi.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.rapCuoi.create({
        data: {
            ten_rap: data.ten_rap,
            mau_rap: data.mau_rap,
            so_ghe_id: data.so_ghe_id,
            so_day_ghe_id: data.so_day_ghe_id,
            gia_thue: data.gia_thue,
            anh_rap: data.anh_rap,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
