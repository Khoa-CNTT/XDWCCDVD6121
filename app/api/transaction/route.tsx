import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.transaction.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.transaction.create({
        data: {
            so_tien: data.so_tien,
            payment_status: data.payment_status,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
