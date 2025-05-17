import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { OrderStatus } from "@prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { orderId, status } = data;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await prisma.donHang.update({
      where: { id: orderId },
      data: { order_status: status as OrderStatus },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
