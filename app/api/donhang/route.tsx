import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.donHang.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.donHang.create({
        data: {
            order_status: data.order_status,
            payment_method: data.payment_method,
            ten_khach_hang: data.ten_khach_hang,
            so_dien_thoai: data.so_dien_thoai,
            dia_chi: data.dia_chi,
            email: data.email,
            transaction_id: data.transaction_id,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
