import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.kichThuoc.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.kichThuoc.create({
        data: {
            kich_thuoc: data.kich_thuoc,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
