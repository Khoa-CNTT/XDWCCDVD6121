import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    const DoTuoiInUse = await prisma.vayCuoi.findFirst({
      where: { do_tuoi_id: id },
    });

    if (DoTuoiInUse) {
      return NextResponse.json(
        {
          message: "Không thể xóa độ tuổi này vì đang được sử dụng",
        },
        { status: 400 }
      );
    }
    await prisma.doTuoi.delete({
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

    const datas = await prisma.doTuoi.update({
      where: { id: id },
      data: {
        dotuoi: body.dotuoi,
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
