import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.makeUp.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.makeUp.create({
        data: {
            ten_makeup: data.ten_makeup,
            gia_makeup: data.gia_makeup,
            phong_cach_id: data.phong_cach_id,
            anh_makeup: data.anh_makeup,
            chi_tiet: data.chi_tiet,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
