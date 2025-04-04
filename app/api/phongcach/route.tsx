import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.phongCach.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.phongCach.create({
        data: {
          ten_phong_cach: data.ten_phong_cach,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
