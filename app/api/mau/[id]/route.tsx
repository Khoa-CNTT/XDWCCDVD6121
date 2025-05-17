import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    // Check if the mau is being used by any wedding dresses
    const mauInUse =
      (await prisma.vayCuoi.findFirst({
        where: { mau_id: id },
      })) ||
      (await prisma.rapCuoi.findFirst({
        where: { mau_id: id },
      }));
    if (mauInUse) {
      return NextResponse.json(
        {
          message: "Không thể xóa màu này vì đang được sử dụng",
        },
        { status: 400 }
      );
    }
    // If mau is not in use, proceed with deletion

    await prisma.mau.delete({
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

    const datas = await prisma.mau.update({
      where: { id: id },
      data: {
        ten_mau: body.ten_mau,
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
