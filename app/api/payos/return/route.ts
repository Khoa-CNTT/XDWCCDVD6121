import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { PaymentStatus } from "@prisma/client";
import { checkPayosPaymentStatus } from "@/app/services/payos.service";
import { sendOrderConfirmationEmail } from "@/app/services/email.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    // Find the transaction with this orderId
    const transaction = await prisma.transaction.findFirst({
      where: {
        orderCode: orderId.toString(),
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check the payment status
    if (!transaction.payos_payment_link_id) {
      return NextResponse.json(
        { error: "Invalid transaction" },
        { status: 400 }
      );
    }

    const paymentStatus = await checkPayosPaymentStatus(
      transaction.payos_payment_link_id
    );

    if (!paymentStatus.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment-error?error=${encodeURIComponent("Failed to verify payment status")}`
      );
    }

    if (paymentStatus.status.toUpperCase() === "PAID") {
      // If payment is confirmed, update transaction and create order
      if (transaction.payment_status !== PaymentStatus.PAID) {
        // Mark the transaction as paid
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

        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`
        );
      } else {
        // Payment already processed
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`
        );
      }
    } else {
      // Payment not completed
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment-pending?orderId=${orderId}`
      );
    }
  } catch (error) {
    console.error("Error in Payos return handler:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-error?error=${encodeURIComponent("An error occurred during payment verification")}`
    );
  }
}
