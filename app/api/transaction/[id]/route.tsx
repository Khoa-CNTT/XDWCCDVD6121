import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    await prisma.transaction.delete({
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

    const datas = await prisma.transaction.update({
      where: { id: id },
      data: {
        so_tien: body.so_tien,
        payment_status: body.payment_status,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    const body = await request.json();

    if (!body.payment_status) {
      return NextResponse.json(
        { message: "Trạng thái thanh toán không được để trống" },
        { status: 400 }
      );
    }

    const datas = await prisma.transaction.update({
      where: { id: id },
      data: {
        payment_status: body.payment_status,
        completed_at: body.payment_status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json(
      {
        message: "Cập nhật thành công",
        data: datas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật trạng thái thanh toán" },
      { status: 500 }
    );
  }
}
