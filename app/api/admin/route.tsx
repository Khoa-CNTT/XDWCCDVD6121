import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const datas = await prisma.administrator.findMany();
    return NextResponse.json({ datas: datas }, { status: 200 });
}
export async function POST(request: NextRequest) {
    const data = await request.json();
    const datas = await prisma.administrator.create({
        data: {
            username: data.username,
            password: data.password,
            email: data.email,
        },
    });
    return NextResponse.json({ datas: datas }, { status: 201 });
}
