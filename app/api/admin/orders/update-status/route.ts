import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { OrderStatus } from "@prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { orderId, newStatus } = data;

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Order ID and new status are required" },
        { status: 400 }
      );
    }

    // Kiểm tra status có hợp lệ không
    if (!Object.values(OrderStatus).includes(newStatus as OrderStatus)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await prisma.donHang.update({
      where: { id: orderId },
      data: { order_status: newStatus as OrderStatus },
      include: {
        transaction_id_relation: true,
      },
    });

    // Cập nhật thành công
    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        ma_don_hang: updatedOrder.ma_don_hang,
        order_status: updatedOrder.order_status,
        payment_status:
          updatedOrder.transaction_id_relation?.payment_status || "PENDING",
        ten_khach_hang: updatedOrder.ten_khach_hang,
        so_dien_thoai: updatedOrder.so_dien_thoai,
        tong_tien: updatedOrder.tong_tien,
        created_at: updatedOrder.created_at.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
