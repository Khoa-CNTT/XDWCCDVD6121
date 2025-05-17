import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/app/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { transactionId, cartItems, shippingInfo } = data;

    if (!transactionId || !cartItems || !shippingInfo) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Find the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if the transaction is paid
    if (transaction.payment_status !== PaymentStatus.PAID) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Check if order already exists for this transaction
    const existingOrder = await prisma.donHang.findFirst({
      where: { transaction_id: transaction.id },
    });

    if (existingOrder) {
      return NextResponse.json({
        orderId: existingOrder.id,
        orderCode: existingOrder.ma_don_hang,
      });
    }

    // Create the order
    const result = await prisma.$transaction(async (tx) => {
      // Generate unique order code
      const today = new Date();
      const generateOrderCode = () =>
        `HD${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      let orderCode = generateOrderCode();
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const existingOrder = await tx.donHang.findUnique({
          where: { ma_don_hang: orderCode },
        });

        if (!existingOrder) {
          break;
        }

        orderCode = generateOrderCode();
        attempts++;

        if (attempts === maxAttempts) {
          throw new Error(
            "Không thể tạo mã đơn hàng duy nhất sau nhiều lần thử"
          );
        }
      }

      // Create order
      const donhang = await tx.donHang.create({
        data: {
          ma_don_hang: orderCode,
          order_status: OrderStatus.PENDING,
          payment_method: transaction.payment_method!,
          ten_khach_hang: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          so_dien_thoai: shippingInfo.phone,
          dia_chi: shippingInfo.address,
          email: shippingInfo.email,
          tong_tien: transaction.so_tien,
          transaction_id: transaction.id,
          orderItems: {
            create: cartItems.map((item: any) => {
              switch (item.type) {
                case "VAYCUOI":
                  if (
                    !item.vayId ||
                    !item.vayInfo ||
                    !item.startDate ||
                    !item.endDate
                  ) {
                    throw new Error(
                      "Missing required wedding dress information"
                    );
                  }
                  return {
                    vay_id: item.vayId,
                    vay_ten: item.vayInfo.ten,
                    vay_gia: item.vayInfo.gia,
                    ngay_muon: new Date(item.startDate),
                    ngay_tra: new Date(item.endDate),
                  };
                case "RAPCUOI":
                  if (!item.rapId || !item.rapInfo || !item.startDate) {
                    throw new Error(
                      "Missing required wedding venue information"
                    );
                  }
                  return {
                    rap_id: item.rapId,
                    rap_ten: item.rapInfo.ten_rap,
                    rap_gia: item.rapInfo.gia_thue,
                    ngay_to_chuc: new Date(item.startDate),
                  };
                case "MAKEUP":
                  if (!item.makeupId || !item.makeupInfo || !item.ngay_hen) {
                    throw new Error("Missing required makeup information");
                  }
                  return {
                    makeup_id: item.makeupId,
                    makeup_ten: item.makeupInfo.ten_makeup,
                    makeup_gia: item.makeupInfo.gia_makeup,
                    ngay_makeup: new Date(item.ngay_hen),
                  };
                default:
                  throw new Error("Invalid item type");
              }
            }),
          },
        },
      });

      // 3. If there are wedding dresses, update their instances' status
      for (const item of cartItems) {
        if (item.type === "VAYCUOI") {
          if (!item.vayId || !item.startDate || !item.endDate) {
            throw new Error("Missing required wedding dress information");
          }

          const vayInstance = await tx.vayInstance.findFirst({
            where: {
              vay_id: item.vayId,
              status: "AVAILABLE",
            },
          });

          if (vayInstance) {
            await tx.vayInstance.update({
              where: { id: vayInstance.id },
              data: {
                status: "RENTED",
                rental_start: new Date(item.startDate),
                rental_end: new Date(item.endDate),
              },
            });
          } else {
            throw new Error(
              `No available instance for dress ID: ${item.vayId}`
            );
          }
        }
      }

      // Prepare order details for email
      const orderItems = cartItems.map((item: any) => ({
        name:
          item.vayInfo?.ten ||
          item.rapInfo?.ten_rap ||
          item.makeupInfo?.ten_makeup ||
          "",
        quantity: 1,
        price:
          item.vayInfo?.gia ||
          item.rapInfo?.gia_thue ||
          item.makeupInfo?.gia_makeup ||
          0,
        type: item.type,
        startDate: item.type !== "MAKEUP" ? item.startDate : undefined,
        endDate: item.type === "VAYCUOI" ? item.endDate : undefined,
        ngay_hen: item.type === "MAKEUP" ? item.ngay_hen : undefined,
      }));

      // Send confirmation email
      await sendOrderConfirmationEmail(shippingInfo.email, {
        orderCode,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        items: orderItems,
        totalAmount: transaction.so_tien,
      });

      return {
        orderId: donhang.id,
        orderCode,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        items: orderItems,
        totalAmount: transaction.so_tien,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error processing order",
      },
      { status: 500 }
    );
  }
}
