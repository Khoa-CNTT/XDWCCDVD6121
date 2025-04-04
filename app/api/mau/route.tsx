import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.mau.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.mau.create({
        data: {
          ten_mau: data.ten_mau,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
