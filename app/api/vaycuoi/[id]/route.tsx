import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    try {
        await prisma.vayCuoi.delete({
            where: { id: id },
        });
        return NextResponse.json(
            { message: "deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting", error);
        return NextResponse.json(
            { message: "Failed to delete" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json(
                { message: "Missing request body" },
                { status: 400 }
            );
        }

        const datas = await prisma.vayCuoi.update({
            where: { id: id },
            data: {
              ten: body.ten,
              gia: body.gia,
              anh: body.anh,
              mau_id: body.mau_id,
              kich_thuoc_id: body.kich_thuoc_id,
              do_tuoi_id: body.do_tuoi_id,
            },
        });

        return NextResponse.json(
            {
                message: "updated successfully",
                data: datas,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating:", error);
        return NextResponse.json(
            { message: "Failed to update" },
            { status: 500 }
        );
    }
}
