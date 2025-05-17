import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    const phongCachInUse = await prisma.makeUp.findFirst({
      where: { phong_cach_id: id },
    });
    if (phongCachInUse) {
      return NextResponse.json(
        {
          message: "Không thể xóa phong cách này vì đang được sử dụng",
        },
        { status: 400 }
      );
    }
    await prisma.phongCach.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { message: "Missing request body" },
        { status: 400 }
      );
    }

    const datas = await prisma.phongCach.update({
      where: { id: id },
      data: {
        ten_phong_cach: body.ten_phong_cach,
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
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
