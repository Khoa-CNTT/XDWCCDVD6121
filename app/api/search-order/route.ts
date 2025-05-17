import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("code");

    if (!orderCode) {
      return NextResponse.json(
        { error: "Order code is required" },
        { status: 400 }
      );
    }

    const order = await prisma.donHang.findUnique({
      where: { ma_don_hang: orderCode },
      include: {
        orderItems: true,
        transaction_id_relation: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error) {
    console.error("Error searching order:", error);
    return NextResponse.json(
      { error: "Failed to search order" },
      { status: 500 }
    );
  }
}
