import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/app/services/email.service";
import { createPayosPayment } from "@/app/services/payos.service";
import { VayInstanceService } from "@/app/services/vayInstance.service";

interface CartItem {
  type: "VAYCUOI" | "RAPCUOI" | "MAKEUP";
  vayId?: number;
  instanceId?: number; // Add instanceId here
  rapId?: number;
  makeupId?: number;
  startDate?: string;
  endDate?: string;
  ngay_hen?: string;
  vayInfo?: {
    ten: string;
    gia: number;
  };
  rapInfo?: {
    ten_rap: string;
    gia_thue: number;
  };
  makeupInfo?: {
    ten_makeup: string;
    gia_makeup: number;
  };
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface CheckoutData {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  totalAmount: number;
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as CheckoutData;

    // Generate unique order code (common for all payment methods)
    const today = new Date();
    const generateOrderCode = () =>
      `HD${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let orderCode = generateOrderCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existingOrder = await prisma.donHang.findUnique({
        where: { ma_don_hang: orderCode },
      });

      if (!existingOrder) {
        break;
      }

      orderCode = generateOrderCode();
      attempts++;

      if (attempts === maxAttempts) {
        throw new Error("Không thể tạo mã đơn hàng duy nhất sau nhiều lần thử");
      }
    }

    // If payment method is PAYOS, create a Payos transaction
    if (data.paymentMethod === "PAYOS") {
      // Create Payos payment
      const buyerInfo = {
        name: `${data.shippingInfo.firstName} ${data.shippingInfo.lastName}`,
        email: data.shippingInfo.email,
        phone: data.shippingInfo.phone,
        address: data.shippingInfo.address,
      };

      const payosResult = await createPayosPayment(
        data.totalAmount,
        "Wedding Services Payment", // Short description
        buyerInfo
      );

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          so_tien: data.totalAmount,
          payment_status: PaymentStatus.PENDING,
          payment_method: PaymentMethod.PAYOS,
          orderCode: payosResult.orderCode.toString(), // Convert number to string for storage
          payos_checkout_url: payosResult.checkoutUrl,
          payos_qr_code: payosResult.qrCode,
          payos_payment_link_id: payosResult.paymentLinkId,
          processing_fee: payosResult.processingFee,
        },
      });

      // Create order with the transaction
      const donhang = await prisma.donHang.create({
        data: {
          ma_don_hang: orderCode,
          order_status: OrderStatus.PENDING,
          payment_method: data.paymentMethod.toUpperCase() as PaymentMethod,
          ten_khach_hang: `${data.shippingInfo.firstName} ${data.shippingInfo.lastName}`,
          so_dien_thoai: data.shippingInfo.phone,
          dia_chi: data.shippingInfo.address,
          email: data.shippingInfo.email,
          tong_tien: data.totalAmount,
          transaction_id: transaction.id,
          orderItems: {
            create: data.items.map((item: CartItem) => {
              switch (item.type) {
                case "VAYCUOI":
                  if (
                    !item.vayId ||
                    !item.vayInfo ||
                    !item.startDate ||
                    !item.endDate ||
                    !item.instanceId // Ensure instanceId is present for VAYCUOI
                  ) {
                    throw new Error(
                      "Missing required wedding dress information or instanceId"
                    );
                  }
                  return {
                    vay_id: item.vayId,
                    vay_instance_id: item.instanceId, // Add this to link order item to specific instance
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

      // Update wedding dress instances status if applicable
      for (const item of data.items) {
        if (item.type === "VAYCUOI") {
          if (!item.instanceId || !item.startDate || !item.endDate) {
            // This check might be redundant if already validated above, but good for safety
            throw new Error(
              "Thiếu thông tin instanceId, startDate hoặc endDate cho váy cưới."
            );
          }
          try {
            await VayInstanceService.confirmReservationAndRent(
              item.instanceId,
              new Date(item.startDate),
              new Date(item.endDate)
            );
          } catch (error) {
            throw error;
          }
        }
      }

      // For PAYOS, we'll return payment info without sending email yet
      // Email will be sent after payment confirmation
      return NextResponse.json(
        {
          transactionId: transaction.id,
          orderId: donhang.id,
          orderCode: orderCode, // Use the uniquely generated orderCode
          checkoutUrl: payosResult.checkoutUrl,
          qrCode: payosResult.qrCode,
          originalAmount: payosResult.originalAmount,
          processingFee: payosResult.processingFee,
          totalAmount: payosResult.totalAmount,
          paymentLinkId: payosResult.paymentLinkId,
        },
        { status: 201 }
      );
    }

    // If payment method is COD, proceed with the original flow
    // Create transaction and order in a transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          so_tien: data.totalAmount,
          payment_status: PaymentStatus.PENDING,
          payment_method: PaymentMethod.COD,
        },
      });

      // 2. Create order with items
      const donhang = await tx.donHang.create({
        data: {
          ma_don_hang: orderCode, // Use the uniquely generated orderCode
          order_status: OrderStatus.PENDING, // Or PROCESSING if appropriate for COD
          payment_method: data.paymentMethod.toUpperCase() as PaymentMethod,
          ten_khach_hang: `${data.shippingInfo.firstName} ${data.shippingInfo.lastName}`,
          so_dien_thoai: data.shippingInfo.phone,
          dia_chi: data.shippingInfo.address,
          email: data.shippingInfo.email,
          tong_tien: data.totalAmount,
          transaction_id: transaction.id,
          orderItems: {
            create: data.items.map((item: CartItem) => {
              switch (item.type) {
                case "VAYCUOI":
                  if (
                    !item.vayId ||
                    !item.vayInfo ||
                    !item.startDate ||
                    !item.endDate ||
                    !item.instanceId // Ensure instanceId is present
                  ) {
                    throw new Error(
                      "Missing required wedding dress information or instanceId for COD"
                    );
                  }
                  return {
                    vay_id: item.vayId,
                    vay_instance_id: item.instanceId, // Add this to link order item to specific instance
                    vay_ten: item.vayInfo.ten,
                    vay_gia: item.vayInfo.gia,
                    ngay_muon: new Date(item.startDate),
                    ngay_tra: new Date(item.endDate),
                  };
                case "RAPCUOI":
                  if (!item.rapId || !item.rapInfo || !item.startDate) {
                    throw new Error(
                      "Missing required wedding venue information for COD"
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
                    throw new Error(
                      "Missing required makeup information for COD"
                    );
                  }
                  return {
                    makeup_id: item.makeupId,
                    makeup_ten: item.makeupInfo.ten_makeup,
                    makeup_gia: item.makeupInfo.gia_makeup,
                    ngay_makeup: new Date(item.ngay_hen),
                  };
                default:
                  throw new Error("Invalid item type for COD");
              }
            }),
          },
        },
      });

      // 3. If there are wedding dresses, update their instances' status
      for (const item of data.items) {
        if (item.type === "VAYCUOI") {
          if (!item.instanceId || !item.startDate || !item.endDate) {
            throw new Error(
              "Thiếu thông tin instanceId, startDate hoặc endDate cho váy cưới (COD)."
            );
          }

          const currentInstance = await tx.vayInstance.findUnique({
            where: { id: item.instanceId },
          });

          if (!currentInstance) {
            throw new Error(
              `Không tìm thấy instance váy với ID: ${item.instanceId} (COD)`
            );
          }

          if (currentInstance.status !== "RESERVED") {
            // If it was already processed by another request or released.
            await VayInstanceService.releaseReservedInstance(item.instanceId); // Attempt to release if it was expired but not caught by a cron
            throw new Error(
              `Váy (ID: ${item.instanceId}) không ở trạng thái RESERVED. Đã được giải phóng hoặc xử lý. (COD)`
            );
          }

          const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
          if (
            !currentInstance.reserved_at ||
            currentInstance.reserved_at < fifteenMinutesAgo
          ) {
            await VayInstanceService.releaseReservedInstance(item.instanceId);
            throw new Error(
              `Thời gian đặt trước cho váy (ID: ${item.instanceId}) đã hết hạn. (COD)`
            );
          }

          await tx.vayInstance.update({
            where: { id: item.instanceId },
            data: {
              status: "RENTED",
              rental_start: new Date(item.startDate),
              rental_end: new Date(item.endDate),
              reserved_at: null,
            },
          });
        }
      }

      // Prepare order details for email
      const orderItemsForEmail = data.items.map((item) => ({
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

      // Send confirmation email for COD immediately
      await sendOrderConfirmationEmail(data.shippingInfo.email, {
        orderCode,
        customerName: `${data.shippingInfo.firstName} ${data.shippingInfo.lastName}`,
        items: orderItemsForEmail,
        totalAmount: data.totalAmount,
      });

      return {
        orderId: donhang.id,
        orderCode,
        customerName: `${data.shippingInfo.firstName} ${data.shippingInfo.lastName}`,
        items: orderItemsForEmail,
        totalAmount: data.totalAmount,
        email: data.shippingInfo.email,
        phone: data.shippingInfo.phone,
        address: data.shippingInfo.address,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Lỗi trong quá trình thanh toán:", error);
    let clientMessage = "Lỗi xử lý đơn hàng";
    if (error instanceof Error) {
      // More specific error messages can be propagated if they are user-friendly
      if (
        error.message.includes("hết hạn") ||
        error.message.includes("không ở trạng thái RESERVED") ||
        error.message.includes("Không có váy nào sẵn có")
      ) {
        clientMessage = error.message;
      } else if (error.message.includes("Không thể tạo mã đơn hàng duy nhất")) {
        clientMessage =
          "Lỗi hệ thống, không thể tạo đơn hàng. Vui lòng thử lại sau.";
      }
    }
    return NextResponse.json(
      {
        error: clientMessage,
      },
      { status: 500 }
    );
  }
}
