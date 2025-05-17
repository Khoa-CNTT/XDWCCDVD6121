import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    const instance = await prisma.vayInstance.findUnique({
      where: { id },
    });

    if (!instance) {
      return NextResponse.json(
        { message: "Không tìm thấy instance" },
        { status: 404 }
      );
    }

    return NextResponse.json(instance, { status: 200 });
  } catch (error) {
    console.error("Error fetching instance:", error);
    return NextResponse.json(
      { message: "Failed to fetch instance" },
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
    const updated = await prisma.vayInstance.update({
      where: { id },
      data: {
        status: body.status,
        rental_start: body.status === "RENTED" ? new Date() : null,
        rental_end: body.status === "AVAILABLE" ? new Date() : null,
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating instance:", error);
    return NextResponse.json(
      { message: "Failed to update instance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  try {
    // Check if instance exists and is not rented
    const instance = await prisma.vayInstance.findUnique({
      where: { id },
    });

    if (!instance) {
      return NextResponse.json(
        { message: "Không tìm thấy instance" },
        { status: 404 }
      );
    }

    if (instance.status === "RENTED") {
      return NextResponse.json(
        { message: "Không thể xóa váy đang cho thuê" },
        { status: 400 }
      );
    }

    // Delete the instance
    const deleted = await prisma.vayInstance.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Xóa instance thành công", data: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting instance:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi xóa instance" },
      { status: 500 }
    );
  }
}
