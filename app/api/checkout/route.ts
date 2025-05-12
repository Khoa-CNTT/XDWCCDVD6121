import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ten_khach_hang,
      so_dien_thoai,
      dia_chi,
      email,
      payment_method,
      so_tien,
    } = body;

    if (
      !ten_khach_hang ||
      !so_dien_thoai ||
      !dia_chi ||
      !email ||
      !payment_method ||
      !so_tien
    ) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        so_tien: parseInt(so_tien),
        payment_status: "PENDING",
      },
    });

    const donHang = await prisma.donHang.create({
      data: {
        order_status: "PENDING",
        payment_method: payment_method.toUpperCase(), // "COD"
        ten_khach_hang,
        so_dien_thoai,
        dia_chi,
        email,
        transaction_id: transaction.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công!",
      donhang_id: donHang.id,
    });
  } catch (error) {
    console.error("Lỗi API /checkout:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
