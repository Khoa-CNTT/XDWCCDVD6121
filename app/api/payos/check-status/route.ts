import { NextRequest, NextResponse } from "next/server";
import { checkPayosPaymentStatus } from "@/app/services/payos.service";
import prisma from "@/prisma/pclient";
import { PaymentStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/app/services/email.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentLinkId = searchParams.get("paymentLinkId");

  if (!paymentLinkId) {
    return NextResponse.json(
      { success: false, message: "Missing paymentLinkId" },
      { status: 400 }
    );
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        payos_payment_link_id: paymentLinkId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    const paymentStatus = await checkPayosPaymentStatus(paymentLinkId);

    // If payment is successful, update transaction status
    if (
      paymentStatus.success &&
      paymentStatus.status === "PAID" &&
      transaction.payment_status !== PaymentStatus.PAID
    ) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          payment_status: PaymentStatus.PAID,
          completed_at: new Date(),
        },
      });

      // Get the related order to send confirmation email
      const order = await prisma.donHang.findFirst({
        where: {
          transaction_id: transaction.id,
        },
        include: {
          orderItems: true,
        },
      });

      if (order) {
        // Format order items for email
        const orderItems = order.orderItems.map((item) => ({
          name: item.vay_ten || item.rap_ten || item.makeup_ten || "",
          quantity: 1,
          price: item.vay_gia || item.rap_gia || item.makeup_gia || 0,
          type: item.vay_id
            ? "VAYCUOI"
            : item.rap_id
              ? "RAPCUOI"
              : ("MAKEUP" as "VAYCUOI" | "RAPCUOI" | "MAKEUP"),
          startDate: item.ngay_muon
            ? item.ngay_muon.toISOString()
            : item.ngay_to_chuc
              ? item.ngay_to_chuc.toISOString()
              : undefined,
          endDate: item.ngay_tra ? item.ngay_tra.toISOString() : undefined,
          ngay_hen: item.ngay_makeup
            ? item.ngay_makeup.toISOString()
            : undefined,
        }));

        // Send email only after confirming payment
        await sendOrderConfirmationEmail(order.email, {
          orderCode: order.ma_don_hang,
          customerName: order.ten_khach_hang,
          items: orderItems,
          totalAmount: order.tong_tien,
        });
      }
    }

    return NextResponse.json({
      ...paymentStatus,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Không thể kiểm tra trạng thái thanh toán",
      },
      { status: 500 }
    );
  }
}
