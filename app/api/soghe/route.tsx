import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.soGhe.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.soGhe.create({
        data: {
          so_luong_ghe: data.so_luong_ghe,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
