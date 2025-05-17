import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentMethod } from "@prisma/client";

interface OrderItem {
  // Thông tin váy cưới
  vay_id?: number;
  vay_ten?: string;
  vay_gia?: number;
  vay_size?: string;
  vay_mau?: string;
  ngay_muon?: string | null;
  ngay_tra?: string | null;

  // Thông tin rạp cưới
  rap_id?: number;
  rap_ten?: string;
  rap_gia?: number;
  ngay_to_chuc?: string | null;

  // Thông tin makeup
  makeup_id?: number;
  makeup_ten?: string;
  makeup_gia?: number;
  ngay_makeup?: string | null;
}

interface CreateDonHangData {
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  email: string;
  transaction_id: number;
  tong_tien: number;
  orderItems: OrderItem[];
}

export async function GET() {
  const datas = await prisma.donHang.findMany({
    include: {
      transaction_id_relation: true,
      orderItems: true,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const data: CreateDonHangData = await request.json();

  // Tạo đơn hàng và các items trong một transaction
  const datas = await prisma.$transaction(async (tx) => {
    // Tạo đơn hàng trước
    const donhang = await tx.donHang.create({
      data: {
        order_status: data.order_status,
        payment_method: data.payment_method,
        ten_khach_hang: data.ten_khach_hang,
        so_dien_thoai: data.so_dien_thoai,
        dia_chi: data.dia_chi,
        email: data.email,
        transaction_id: data.transaction_id,
        tong_tien: data.tong_tien,
        // Tạo các order items
        orderItems: {
          create: data.orderItems.map((item: OrderItem) => ({
            // Thông tin váy cưới
            vay_id: item.vay_id,
            vay_ten: item.vay_ten,
            vay_gia: item.vay_gia,
            vay_size: item.vay_size,
            vay_mau: item.vay_mau,
            ngay_muon: item.ngay_muon ? new Date(item.ngay_muon) : null,
            ngay_tra: item.ngay_tra ? new Date(item.ngay_tra) : null,

            // Thông tin rạp cưới
            rap_id: item.rap_id,
            rap_ten: item.rap_ten,
            rap_gia: item.rap_gia,
            ngay_to_chuc: item.ngay_to_chuc
              ? new Date(item.ngay_to_chuc)
              : null,

            // Thông tin makeup
            makeup_id: item.makeup_id,
            makeup_ten: item.makeup_ten,
            makeup_gia: item.makeup_gia,
            ngay_makeup: item.ngay_makeup ? new Date(item.ngay_makeup) : null,
          })),
        },
      },
      include: {
        orderItems: true,
        transaction_id_relation: true,
      },
    });

    // Nếu có váy cưới, cập nhật trạng thái VayInstance
    for (const item of data.orderItems) {
      if (item.vay_id) {
        const vayInstance = await tx.vayInstance.findFirst({
          where: {
            vay_id: item.vay_id,
            status: "AVAILABLE",
          },
        });

        if (vayInstance) {
          await tx.vayInstance.update({
            where: { id: vayInstance.id },
            data: {
              status: "RENTED",
              rental_start: item.ngay_muon ? new Date(item.ngay_muon) : null,
              rental_end: item.ngay_tra ? new Date(item.ngay_tra) : null,
            },
          });
        }
      }
    }

    return donhang;
  });

  return NextResponse.json({ datas: datas }, { status: 201 });
}

// API endpoint để lấy chi tiết một đơn hàng
export async function GET_ONE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const donhang = await prisma.donHang.findUnique({
    where: { id: parseInt(id) },
    include: {
      orderItems: true,
      transaction_id_relation: true,
    },
  });

  if (!donhang) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data: donhang }, { status: 200 });
}
