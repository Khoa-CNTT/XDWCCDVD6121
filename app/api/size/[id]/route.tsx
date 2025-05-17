import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    // First check if the size is being used by any wedding dresses
    const sizeInUse = await prisma.vayCuoi.findFirst({
      where: { size_id: id },
    });

    if (sizeInUse) {
      return NextResponse.json(
        {
          message: "Không thể xóa size này vì đang được sử dụng",
        },
        { status: 400 }
      );
    }

    // If size is not in use, proceed with deletion
    await prisma.size.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Xóa size thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting size:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi xóa size",
      },
      { status: 500 }
    );
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

    const datas = await prisma.size.update({
      where: { id: id },
      data: {
        size: body.size,
        min_chieu_cao: body.min_chieu_cao,
        max_chieu_cao: body.max_chieu_cao,
        min_can_nang: body.min_can_nang,
        max_can_nang: body.max_can_nang,
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
