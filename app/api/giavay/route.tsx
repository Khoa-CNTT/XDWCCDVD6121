import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.giaVay.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.giaVay.create({
        data: {
            gia_ban: data.gia_ban,
            gia_thue: data.gia_thue,
            loai_vay: data.loai_vay,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
